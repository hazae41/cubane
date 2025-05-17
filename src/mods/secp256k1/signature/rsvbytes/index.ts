import { Uint8Array } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { Secp256k1 } from "@hazae41/secp256k1"
import { BytesAsInteger, CopiableBytesAsInteger, NumberAsInteger } from "mods/convert/index.js"
import { BytesSignature, BytesSignatureInit } from "../bytes/index.js"
import { ExternalSignature, ExternalSignatureInit } from "../external/index.js"
import { AbstractSignature, RsvSignatureInit, RsvZeroHexSignature, RsvZeroHexSignatureObject, Signature, SignatureInit } from "../index.js"
import { ZeroHexSignature } from "../zerohex/index.js"

export interface RsvBytesSignatureInit {
  readonly r: BytesAsInteger.From
  readonly s: BytesAsInteger.From
  readonly v: NumberAsInteger.From
}

export interface RsvBytesSignatureObject {
  readonly r: Uint8Array<32>,
  readonly s: Uint8Array<32>,
  readonly v: number
}

export class RsvBytesSignature extends AbstractSignature {

  constructor(
    readonly r: Uint8Array<32>,
    readonly s: Uint8Array<32>,
    readonly v: number
  ) {
    super()
  }

  [Symbol.dispose]() { }

  sizeOrThrow() {
    return 65
  }

  writeOrThrow(cursor: Cursor) {
    const { r, s, v } = this

    cursor.writeOrThrow(r)
    cursor.writeOrThrow(s)
    cursor.writeUint8OrThrow(v)
  }

  intoOrThrow(): RsvBytesSignatureObject {
    const { r, s, v } = this
    return { r, s, v }
  }

  toJSON(): RsvZeroHexSignatureObject {
    return RsvZeroHexSignature.fromOrThrow(this).toJSON()
  }

}

export namespace RsvBytesSignature {

  export function readOrThrow(cursor: Cursor): RsvBytesSignature {
    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvBytesSignature(r, s, v)
  }

}

export namespace RsvBytesSignature {

  export type From = Signature | SignatureInit

  export function fromOrThrow(from: From): RsvBytesSignature {
    if (from instanceof RsvBytesSignature)
      return from

    if (from instanceof BytesSignature)
      return fromOtherOrThrow(from.value)
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

  function fromRsvOrThrow(from: RsvSignatureInit): RsvBytesSignature {
    const { r, s, v } = from

    const br = BytesAsInteger.Length.fromOrThrow(r, 32)
    const bs = BytesAsInteger.Length.fromOrThrow(s, 32)
    const nv = NumberAsInteger.fromOrThrow(v)

    return new RsvBytesSignature(br, bs, nv)
  }

  function fromExternalOrThrow(from: ExternalSignatureInit): RsvBytesSignature {
    using memory = from.exportOrThrow()

    return readOrThrow(new Cursor(memory.bytes))
  }

  function fromOtherOrThrow(from: BytesSignatureInit): RsvBytesSignature {
    using memory = CopiableBytesAsInteger.Length.fromOrThrow(from, 65)

    return readOrThrow(new Cursor(memory.bytes))
  }

}