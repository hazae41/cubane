import { Slot } from "@hazae41/box"
import { Bytes } from "@hazae41/bytes"
import { Keccak256 } from "@hazae41/keccak256"
import * as Uts46 from "idna-uts46-hx"
import { Copiable, Copied } from "libs/copiable/index.js"

export function namehashOrThrow(name: string) {
  if (name.length === 0)
    return new Uint8Array(32)

  const labels = Uts46.toUnicode(name, { useSTD3ASCIIRules: true }).split('.').reverse()

  using node: Slot<Copiable> = new Slot(new Copied(new Uint8Array(32)))

  for (const label of labels) {
    const previous = node.get()

    using current = Keccak256.get().getOrThrow().hashOrThrow(Bytes.fromUtf8(label))

    const concat = Bytes.concat([previous.bytes, current.bytes])
    node.set(Keccak256.get().getOrThrow().hashOrThrow(concat))

    using _ = previous
  }

  return node.get().bytes.slice()
}