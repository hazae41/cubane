import { Box } from "@hazae41/box"
import { Bytes } from "@hazae41/bytes"
import { Copiable, Copied, Keccak256 } from "@hazae41/keccak256"
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
      using hashed = Keccak256.get().tryHash(Bytes.fromUtf8(label)).unwrap()

      const concat = Bytes.concat([previous.bytes, hashed.bytes])
      node.inner = new Box(Keccak256.get().tryHash(concat).unwrap())
    }

    return new Ok(node.inner.unwrap().copyAndDispose())
  })
}
