import { Box, Copiable, Copied } from "@hazae41/box"
import { Bytes } from "@hazae41/bytes"
import { Keccak256 } from "@hazae41/keccak256"
import { Ok, Result } from "@hazae41/result"
import * as Uts46 from "idna-uts46-hx"

class Slot<T extends Disposable> implements Disposable {

  constructor(
    public inner: T
  ) { }

  [Symbol.dispose]() {
    this.inner[Symbol.dispose]()
  }

}

export function tryNamehash(name: string): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    if (name.length === 0)
      return new Ok(new Uint8Array(32))

    const uts46 = Uts46.toUnicode(name, { useStd3ASCII: true })
    const labels = uts46.split('.').reverse()

    using node: Slot<Box<Copiable>> = new Slot(new Box(new Copied(new Uint8Array(32))))

    for (const label of labels) {
      using previous = node.inner.unwrap()

      const prehash = new Box(new Copied(Bytes.fromUtf8(label)))
      using posthash = Keccak256.get().tryHash(prehash).unwrap()

      const concat = new Box(new Copied(Bytes.concat([previous.bytes, posthash.bytes])))
      node.inner = new Box(Keccak256.get().tryHash(concat).throw(t))
    }

    return new Ok(node.inner.unwrap().copyAndDispose().bytes)
  })
}
