import { Box, Copiable, Copied, Slot } from "@hazae41/box"
import { Bytes } from "@hazae41/bytes"
import { Keccak256 } from "@hazae41/keccak256"
import { Ok, Result } from "@hazae41/result"
import * as Uts46 from "idna-uts46-hx"

export function namehashOrThrow(name: string) {
  if (name.length === 0)
    return new Uint8Array(32)

  const labels = Uts46.toUnicode(name, { useStd3ASCII: true }).split('.').reverse()

  using node: Slot<Box<Copiable>> = new Slot(new Box(new Copied(new Uint8Array(32))))

  for (const label of labels) {
    using previous = node.inner.unwrap()
    using current = Keccak256.get().hashOrThrow(Bytes.fromUtf8(label))

    const concat = Bytes.concat([previous.bytes, current.bytes])
    node.inner = new Box(Keccak256.get().hashOrThrow(concat))
  }

  return node.inner.unwrap().copyAndDispose()
}

export function tryNamehash(name: string): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    if (name.length === 0)
      return new Ok(new Uint8Array(32))

    const labels = Uts46.toUnicode(name, { useStd3ASCII: true }).split('.').reverse()

    using node: Slot<Box<Copiable>> = new Slot(new Box(new Copied(new Uint8Array(32))))

    for (const label of labels) {
      using previous = node.inner.unwrap()
      using current = Keccak256.get().tryHash(Bytes.fromUtf8(label)).throw(t)

      const concat = Bytes.concat([previous.bytes, current.bytes])
      node.inner = new Box(Keccak256.get().tryHash(concat).throw(t))
    }

    return new Ok(node.inner.unwrap().copyAndDispose())
  })
}


