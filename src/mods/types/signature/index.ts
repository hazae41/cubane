import { Base16 } from "@hazae41/base16"
import { Uint8Array } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { Secp256k1 } from "@hazae41/secp256k1"
import { RawHexString, ZeroHexString } from "../string/index.js"

export type Signature =
  | RsvSignature
  | ZeroHexSignature
  | BytesSignature
  | ExtSignature

export namespace Signature {

  export type Create =
    | RsvSignatureInit
    | ZeroHexString
    | Uint8Array
    | Secp256k1.SignatureAndRecovery

  export type From =
    | RsvSignature
    | ZeroHexSignature
    | BytesSignature
    | ExtSignature
    | RsvSignatureInit
    | ZeroHexString
    | Uint8Array
    | Secp256k1.SignatureAndRecovery

  export function create(value: Create): Signature {
    if (value instanceof Secp256k1.SignatureAndRecovery)
      return new ExtSignature(value)
    if (value instanceof Uint8Array)
      return new BytesSignature(value)
    if (typeof value === "string")
      return new ZeroHexSignature(value)
    return RsvSignature.create(value)
  }

  export function fromOrThrow(value: From): Signature {
    if (value instanceof RsvSignature)
      return value
    if (value instanceof ZeroHexSignature)
      return value
    if (value instanceof BytesSignature)
      return value
    if (value instanceof ExtSignature)
      return value
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

  export type From =
    | RsvSignature
    | ZeroHexSignature
    | BytesSignature
    | ExtSignature
    | RsvSignatureInit
    | ZeroHexString
    | Uint8Array
    | Secp256k1.SignatureAndRecovery

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
    if (from instanceof RsvSignature)
      return from
    if (from instanceof ZeroHexSignature)
      return RsvSignature.fromOrThrow(from.value)
    if (from instanceof BytesSignature)
      return RsvSignature.fromOrThrow(from.value)
    if (from instanceof ExtSignature)
      return RsvSignature.fromOrThrow(from.value)

    if (from instanceof Secp256k1.SignatureAndRecovery) {
      using slice = from.exportOrThrow()

      const cursor = new Cursor(slice.bytes)

      const r = cursor.readAndCopyOrThrow(32)
      const s = cursor.readAndCopyOrThrow(32)
      const v = cursor.readUint8OrThrow()

      return new RsvSignature(r, s, v)
    }

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

  export type From =
    | RsvSignature
    | ZeroHexSignature
    | BytesSignature
    | ExtSignature
    | RsvSignatureInit
    | ZeroHexString
    | Uint8Array
    | Secp256k1.SignatureAndRecovery

}

export class ZeroHexSignature {

  constructor(
    readonly value: ZeroHexString
  ) { }

  static create(value: ZeroHexSignature.Create): ZeroHexSignature {
    return new ZeroHexSignature(value)
  }

  static fromOrThrow(from: ZeroHexSignature.From): ZeroHexSignature {
    if (from instanceof ZeroHexSignature)
      return from
    if (from instanceof BytesSignature)
      return ZeroHexSignature.fromOrThrow(from.value)
    if (from instanceof ExtSignature)
      return ZeroHexSignature.fromOrThrow(from.value)

    if (from instanceof Secp256k1.SignatureAndRecovery) {
      using slice = from.exportOrThrow()

      const raw = Base16.get().encodeOrThrow(slice.bytes)

      return new ZeroHexSignature(`0x${raw}` as ZeroHexString)
    }

    if (from instanceof Uint8Array) {
      const raw = Base16.get().encodeOrThrow(from)

      return new ZeroHexSignature(`0x${raw}` as ZeroHexString)
    }

    if (typeof from === "object") {
      const { r, s, v } = from

      const hr = Base16.get().encodeOrThrow(r)
      const hs = Base16.get().encodeOrThrow(s)

      const hvx = v.toString(16) as RawHexString
      const hvp = RawHexString.padStart(hvx)

      return new ZeroHexSignature(ZeroHexString.Unsafe.as(`0x${hr}${hs}${hvp}`))
    }

    return new ZeroHexSignature(from)
  }

}

export namespace BytesSignature {

  export type Create = Uint8Array

  export type From =
    | RsvSignature
    | ZeroHexSignature
    | BytesSignature
    | ExtSignature
    | RsvSignatureInit
    | ZeroHexString
    | Uint8Array
    | Secp256k1.SignatureAndRecovery

}

export class BytesSignature {

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesSignature.Create): BytesSignature {
    return new BytesSignature(value)
  }

  static fromOrThrow(from: BytesSignature.From): BytesSignature {
    if (from instanceof BytesSignature)
      return from
    if (from instanceof ZeroHexSignature)
      return BytesSignature.fromOrThrow(from.value)
    if (from instanceof ExtSignature)
      return BytesSignature.fromOrThrow(from.value)

    if (from instanceof Secp256k1.SignatureAndRecovery)
      return new BytesSignature(from.exportOrThrow().copyAndDispose())
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

export namespace ExtSignature {

  export type Create = Secp256k1.SignatureAndRecovery

  export type From =
    | ExtSignature
    | Secp256k1.SignatureAndRecovery

}

export class ExtSignature {

  constructor(
    readonly value: Secp256k1.SignatureAndRecovery
  ) { }

  static create(value: ExtSignature.Create): ExtSignature {
    return new ExtSignature(value)
  }

  static fromOrThrow(value: ExtSignature.From): ExtSignature {
    if (value instanceof ExtSignature)
      return value
    return new ExtSignature(value)
  }

}