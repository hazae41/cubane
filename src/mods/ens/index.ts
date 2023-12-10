import { Box, Copiable, Copied, Slot } from "@hazae41/box"
import { Bytes } from "@hazae41/bytes"
import { Keccak256 } from "@hazae41/keccak256"
import { Result } from "@hazae41/result"
import * as Uts46 from "idna-uts46-hx"

export class NamehashError extends Error {
  readonly #class = NamehashError
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Could not namehash`, options)
  }

  static from(cause: unknown) {
    return new NamehashError({ cause })
  }

}

export function namehashOrThrow(name: string) {
  if (name.length === 0)
    return new Uint8Array(32)

  const labels = Uts46.toUnicode(name, { useStd3ASCII: true }).split('.').reverse()

  using node: Slot<Box<Copiable>> = new Slot(new Box(new Copied(new Uint8Array(32))))

  for (const label of labels) {
    using previous = node.inner.unwrapOrThrow()
    using current = Keccak256.get().hashOrThrow(Bytes.fromUtf8(label))

    const concat = Bytes.concat([previous.bytes, current.bytes])
    node.inner = new Box(Keccak256.get().hashOrThrow(concat))
  }

  return node.inner.unwrapOrThrow().copyAndDispose()
}

export function tryNamehash(name: string): Result<Uint8Array, NamehashError> {
  return Result.runAndWrapSync(() => {
    return namehashOrThrow(name)
  }).mapErrSync(NamehashError.from)
}


