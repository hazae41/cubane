import { Box } from "@hazae41/box"
import { Cursor } from "@hazae41/cursor"
import { Secp256k1 } from "@hazae41/secp256k1"
import { CopiableBytesAsInteger } from "mods/convert/index.js"
import { BytesSignature, BytesSignatureInit } from "../bytes/index.js"
import { AbstractSignature, RsvSignatureInit, Signature, SignatureInit } from "../index.js"
import { RsvBytesSignature } from "../rsvbytes/index.js"
import { ZeroHexSignature, ZeroHexSignatureString } from "../zerohex/index.js"

export type ExternalSignatureInit = Secp256k1.SignatureAndRecovery

export type ExternalSignatureObject = Secp256k1.SignatureAndRecovery

export class ExternalSignature extends AbstractSignature {

  constructor(
    readonly boxed: Box<ExternalSignatureObject>
  ) {
    super()
  }

  get value() {
    return this.boxed.get()
  }

  [Symbol.dispose]() {
    this.boxed[Symbol.dispose]()
  }

  sizeOrThrow(): 65 {
    return 65
  }

  writeOrThrow(cursor: Cursor) {
    using memory = this.value.exportOrThrow()

    cursor.writeOrThrow(memory.bytes)
  }

  intoOrThrow(): Box<ExternalSignatureObject> {
    return this.boxed
  }

  toJSON(): ZeroHexSignatureString {
    return ZeroHexSignature.fromOrThrow(this).toJSON()
  }

}

export namespace ExternalSignature {

  export type From = Signature | SignatureInit

  export function fromOrThrow(from: From): ExternalSignature {
    if (from instanceof ExternalSignature)
      return from

    if (from instanceof BytesSignature)
      return fromOtherOrThrow(from.value)
    if (from instanceof ZeroHexSignature)
      return fromOtherOrThrow(from.value)

    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExternalOrThrow(from)
    if (from instanceof Uint8Array)
      return fromOtherOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalSignatureInit): ExternalSignature {
    return new ExternalSignature(Box.createAsDropped(from))
  }

  function fromRsvOrThrow(from: RsvSignatureInit): ExternalSignature {
    const rsv = RsvBytesSignature.fromOrThrow(from)
    const cursor = new Cursor(new Uint8Array(65)) // TODO: cursor on wasm memory

    rsv.writeOrThrow(cursor)

    const value = Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(cursor.bytes)

    return new ExternalSignature(new Box(value))
  }

  function fromOtherOrThrow(from: BytesSignatureInit): ExternalSignature {
    using memory = CopiableBytesAsInteger.Length.fromOrThrow(from, 65)
    const value = Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(memory.bytes)

    return new ExternalSignature(new Box(value))
  }

}
