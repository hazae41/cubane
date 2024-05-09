import { Base16 } from "@hazae41/base16"
import { Uint8Array } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { RawHexString } from "../rawhex/index.js"
import { ZeroHexString } from "../zerohex/index.js"

export type Signature =
  | RsvSignature
  | ZeroHexSignature
  | BytesSignature

export namespace Signature {

  export type Create =
    | RsvSignatureInit
    | ZeroHexString
    | Uint8Array

  export type From =
    | RsvSignatureInit
    | ZeroHexString
    | Uint8Array

  export function create(value: Create): Signature {
    if (value instanceof Uint8Array)
      return new BytesSignature(value)
    if (typeof value === "string")
      return new ZeroHexSignature(value)
    return RsvSignature.create(value)
  }

  export function fromOrThrow(value: From): Signature {
    return create(value)
  }

}

export interface RsvSignatureInit {
  readonly r: Uint8Array<32>
  readonly s: Uint8Array<32>
  readonly v: number
}

export namespace RsvSignature {

  export type Create = RsvSignatureInit

  export type From = Signature.From

}

export class RsvSignature {

  constructor(
    readonly r: Uint8Array<32>,
    readonly s: Uint8Array<32>,
    readonly v: number
  ) { }

  static create(init: RsvSignature.Create): RsvSignature {
    return new RsvSignature(init.r, init.s, init.v)
  }

  static fromOrThrow(from: RsvSignature.From): RsvSignature {
    if (from instanceof Uint8Array) {
      const cursor = new Cursor(from)

      const r = cursor.readAndCopyOrThrow(32)
      const s = cursor.readAndCopyOrThrow(32)
      const v = cursor.readUint8OrThrow()

      return new RsvSignature(r, s, v)
    }

    if (typeof from === "string") {
      using slice = Base16.get().padStartAndDecodeOrThrow(from.slice(2))

      const cursor = new Cursor(slice.bytes)

      const r = cursor.readAndCopyOrThrow(32)
      const s = cursor.readAndCopyOrThrow(32)
      const v = cursor.readUint8OrThrow()

      return new RsvSignature(r, s, v)
    }

    return RsvSignature.create(from)
  }

}

export namespace ZeroHexSignature {

  export type Create = ZeroHexString

  export type From = Signature.From

}

export class ZeroHexSignature {

  constructor(
    readonly value: ZeroHexString
  ) { }

  static create(value: ZeroHexSignature.Create): ZeroHexSignature {
    return new ZeroHexSignature(value)
  }

  static fromOrThrow(from: ZeroHexSignature.From): ZeroHexSignature {
    if (from instanceof Uint8Array)
      return new ZeroHexSignature(`0x${Base16.get().encodeOrThrow(from)}`)
    if (typeof from === "string")
      return new ZeroHexSignature(from)

    const { r, s, v } = from

    const hr = Base16.get().encodeOrThrow(r)
    const hs = Base16.get().encodeOrThrow(s)
    const hv = RawHexString.padStart(v.toString(16))

    return new ZeroHexSignature(`0x${hr}${hs}${hv}`)
  }

}

export namespace BytesSignature {

  export type Create = Uint8Array

  export type From = Signature.From

}

export class BytesSignature {

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesSignature.Create): BytesSignature {
    return new BytesSignature(value)
  }

  static fromOrThrow(from: BytesSignature.From): BytesSignature {
    if (from instanceof Uint8Array)
      return new BytesSignature(from)
    if (typeof from === "string")
      return new BytesSignature(Base16.get().padEndAndDecodeOrThrow(from).copyAndDispose())

    const { r, s, v } = from

    const cursor = new Cursor(new Uint8Array(65))

    cursor.writeOrThrow(r)
    cursor.writeOrThrow(s)
    cursor.writeUint8OrThrow(v)

    return new BytesSignature(cursor.bytes)
  }

}