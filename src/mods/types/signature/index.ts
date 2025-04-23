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
    return from.toRsvOrThrow()
  }

  toRsvOrThrow(): RsvSignature {
    return this
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    const { r, s, v } = this

    const hr = Base16.get().getOrThrow().encodeOrThrow(r)
    const hs = Base16.get().getOrThrow().encodeOrThrow(s)

    const hvx = v.toString(16) as RawHexString
    const hvp = RawHexString.padStart(hvx)

    return new ZeroHexSignature(ZeroHexString.Unsafe.as(`0x${hr}${hs}${hvp}`))
  }

  toBytesOrThrow(): BytesSignature {
    const { r, s, v } = this

    const cursor = new Cursor(new Uint8Array(65))

    cursor.writeOrThrow(r)
    cursor.writeOrThrow(s)
    cursor.writeUint8OrThrow(v)

    return new BytesSignature(cursor.bytes)
  }

  toExtOrThrow(): ExtSignature {
    const { r, s, v } = this

    const cursor = new Cursor(new Uint8Array(65))

    cursor.writeOrThrow(r)
    cursor.writeOrThrow(s)
    cursor.writeUint8OrThrow(v)

    const inner = Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(cursor.bytes)

    return new ExtSignature(inner)
  }

}

export namespace ZeroHexSignature {

  export type Create = ZeroHexString

  export type From =
    | RsvSignature
    | ZeroHexSignature
    | BytesSignature
    | ExtSignature

}

export class ZeroHexSignature {

  constructor(
    readonly value: ZeroHexString
  ) { }

  static create(value: ZeroHexSignature.Create): ZeroHexSignature {
    return new ZeroHexSignature(value)
  }

  static fromOrThrow(from: ZeroHexSignature.From): ZeroHexSignature {
    return from.toZeroHexOrThrow()
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    return this
  }

  toRsvOrThrow(): RsvSignature {
    const { value } = this

    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))

    const cursor = new Cursor(slice.bytes)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvSignature(r, s, v)
  }

  toBytesOrThrow(): BytesSignature {
    const { value } = this

    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))

    return new BytesSignature(slice.bytes.slice())
  }

  toExtOrThrow(): ExtSignature {
    const { value } = this

    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))

    const inner = Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(slice.bytes)

    return new ExtSignature(inner)
  }

}

export namespace BytesSignature {

  export type Create = Uint8Array

  export type From =
    | RsvSignature
    | ZeroHexSignature
    | BytesSignature
    | ExtSignature

}

export class BytesSignature {

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesSignature.Create): BytesSignature {
    return new BytesSignature(value)
  }

  static fromOrThrow(from: BytesSignature.From): BytesSignature {
    return from.toBytesOrThrow()
  }

  toBytesOrThrow(): BytesSignature {
    return this
  }

  toRsvOrThrow(): RsvSignature {
    const { value } = this

    const cursor = new Cursor(value)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvSignature(r, s, v)
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    const { value } = this

    const base16 = Base16.get().getOrThrow().encodeOrThrow(value)

    return new ZeroHexSignature(`0x${base16}` as ZeroHexString)
  }

  toExtOrThrow(): ExtSignature {
    const { value } = this

    const inner = Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(value)

    return new ExtSignature(inner)
  }

}

export namespace ExtSignature {

  export type Create = Secp256k1.SignatureAndRecovery

  export type From =
    | RsvSignature
    | ZeroHexSignature
    | BytesSignature
    | ExtSignature

}

export class ExtSignature {

  constructor(
    readonly value: Secp256k1.SignatureAndRecovery
  ) { }

  static create(value: ExtSignature.Create): ExtSignature {
    return new ExtSignature(value)
  }

  static fromOrThrow(from: ExtSignature.From): ExtSignature {
    return from.toExtOrThrow()
  }

  toExtOrThrow(): ExtSignature {
    return this
  }

  toRsvOrThrow(): RsvSignature {
    const { value } = this

    using slice = value.exportOrThrow()

    const cursor = new Cursor(slice.bytes)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvSignature(r, s, v)
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    const { value } = this

    using slice = value.exportOrThrow()

    const base16 = Base16.get().getOrThrow().encodeOrThrow(slice.bytes)

    return new ZeroHexSignature(`0x${base16}` as ZeroHexString)
  }

  toBytesOrThrow(): BytesSignature {
    const { value } = this

    using slice = value.exportOrThrow()

    return new BytesSignature(slice.bytes.slice())
  }

}