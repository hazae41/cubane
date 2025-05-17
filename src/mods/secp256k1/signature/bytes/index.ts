import { Uint8Array } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { Secp256k1 } from "@hazae41/secp256k1"
import { BytesAsInteger } from "mods/convert/index.js"
import { ExternalSignature, ExternalSignatureInit } from "../external/index.js"
import { AbstractSignature, RsvSignatureInit, Signature, SignatureInit } from "../index.js"
import { RsvBytesSignature } from "../rsvbytes/index.js"
import { ZeroHexSignature, ZeroHexSignatureString } from "../zerohex/index.js"

export type BytesSignatureInit = BytesAsInteger.From

export type BytesSignatureBytes = Uint8Array<65>

export class BytesSignature extends AbstractSignature {

  constructor(
    readonly value: BytesSignatureBytes
  ) {
    super()
  }

  [Symbol.dispose]() { }

  sizeOrThrow(): 65 {
    return 65
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
  }

  intoOrThrow(): BytesSignatureBytes {
    return this.value
  }

  toJSON(): ZeroHexSignatureString {
    return ZeroHexSignature.fromOrThrow(this).toJSON()
  }

}

export namespace BytesSignature {

  export type From = Signature | SignatureInit

  export function fromOrThrow(from: From): BytesSignature {
    if (from instanceof BytesSignature)
      return from

    if (from instanceof ZeroHexSignature)
      return fromOtherOrThrow(from.value)
    if (from instanceof ExternalSignature)
      return fromExternalOrThrow(from.value)

    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExternalOrThrow(from)
    if (from instanceof Uint8Array)
      return fromOtherOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromRsvOrThrow(from: RsvSignatureInit): BytesSignature {
    const rsv = RsvBytesSignature.fromOrThrow(from)
    const cursor = new Cursor(new Uint8Array(65))

    rsv.writeOrThrow(cursor)

    return new BytesSignature(cursor.bytes as Uint8Array<65>)
  }

  function fromExternalOrThrow(from: ExternalSignatureInit): BytesSignature {
    using memory = from.exportOrThrow()
    const bytes = memory.bytes.slice()

    return new BytesSignature(bytes as Uint8Array<65>)
  }

  function fromOtherOrThrow(from: BytesSignatureInit): BytesSignature {
    return new BytesSignature(BytesAsInteger.Length.fromOrThrow(from, 65))
  }

}
