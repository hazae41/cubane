import { Base16 } from "@hazae41/base16"
import { Uint8Array } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { RawHexString, ZeroHexString } from "@hazae41/hex"
import { Secp256k1 } from "@hazae41/secp256k1"
import { Copiable } from "libs/copiable/index.js"
import { BytesAsInteger, ZeroHexAsInteger } from "../formats/index.js"

export namespace Signature {

  export type From =
    | RsvZeroHexSignature.From
    | RsvBytesSignature.From
    | ZeroHexSignature.From
    | BytesSignature.From
    | ExtSignature.From

}

export abstract class Signature {

  static fromOrThrow(from: Signature.From): Signature {
    if (from instanceof Signature)
      return from
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return ExtSignature.fromOrThrow(from)
    if (from instanceof Uint8Array)
      return BytesSignature.fromOrThrow(from)
    if (typeof from !== "object")
      return ZeroHexSignature.fromOrThrow(from)
    return RsvZeroHexSignature.fromOrThrow(from)
  }

  abstract toRsvZeroHexOrThrow(): RsvZeroHexSignature

  abstract toRsvBytesOrThrow(): RsvBytesSignature

  abstract toZeroHexOrThrow(): ZeroHexSignature

  abstract toBytesOrThrow(): BytesSignature

  abstract toExtOrThrow(): ExtSignature

}

export interface RsvZeroHexSignatureInit {
  readonly r: ZeroHexString<32>
  readonly s: ZeroHexString<32>
  readonly v: number
}

export namespace RsvZeroHexSignatureInit {

  export interface Unsafe {
    readonly r: ZeroHexAsInteger.From
    readonly s: ZeroHexAsInteger.From
    readonly v: number
  }

}

export namespace RsvZeroHexSignature {

  export type Create = RsvZeroHexSignatureInit

  export type From =
    | RsvZeroHexSignatureInit.Unsafe
    | Signature

}

export class RsvZeroHexSignature extends Signature {

  constructor(
    readonly r: ZeroHexString<32>,
    readonly s: ZeroHexString<32>,
    readonly v: number
  ) {
    super()
  }

  static create(init: RsvZeroHexSignature.Create): RsvZeroHexSignature {
    return new RsvZeroHexSignature(init.r, init.s, init.v)
  }

  static fromOrThrow(from: RsvZeroHexSignature.From): RsvZeroHexSignature {
    if (from instanceof Signature)
      return from.toRsvZeroHexOrThrow()

    const { r, s, v } = from

    const hr = ZeroHexAsInteger.Length.fromOrThrow(r, 32)
    const hs = ZeroHexAsInteger.Length.fromOrThrow(s, 32)

    return new RsvZeroHexSignature(hr, hs, v)
  }

  toRsvZeroHexOrThrow(): RsvZeroHexSignature {
    return this
  }

  toRsvBytesOrThrow(): RsvBytesSignature {
    const { r, s, v } = this

    const br = Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(r.slice(2))) as Uint8Array<32>
    const bs = Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(s.slice(2))) as Uint8Array<32>

    return new RsvBytesSignature(br, bs, v)
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    const { r, s, v } = this

    const hvx = v.toString(16) as RawHexString
    const hvp = RawHexString.padStart(hvx)

    return new ZeroHexSignature(`0x${r}${s}${hvp}` as ZeroHexString<65>)
  }

  toBytesOrThrow(): BytesSignature {
    const { r, s, v } = this

    const cursor = new Cursor(new Uint8Array(65))

    using br = Base16.get().getOrThrow().padStartAndDecodeOrThrow(r.slice(2))
    using bs = Base16.get().getOrThrow().padStartAndDecodeOrThrow(s.slice(2))

    cursor.writeOrThrow(br.bytes)
    cursor.writeOrThrow(bs.bytes)
    cursor.writeUint8OrThrow(v)

    return new BytesSignature(cursor.bytes as Uint8Array<65>)
  }

  toExtOrThrow(): ExtSignature {
    const { r, s, v } = this

    using br = Base16.get().getOrThrow().padStartAndDecodeOrThrow(r.slice(2))
    using bs = Base16.get().getOrThrow().padStartAndDecodeOrThrow(s.slice(2))

    const cursor = new Cursor(new Uint8Array(65))

    cursor.writeOrThrow(br.bytes)
    cursor.writeOrThrow(bs.bytes)
    cursor.writeUint8OrThrow(v)

    const inner = Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(cursor.bytes)

    return new ExtSignature(inner)
  }

}

export interface RsvBytesSignatureInit {
  readonly r: Uint8Array<32>
  readonly s: Uint8Array<32>
  readonly v: number
}

export namespace RsvBytesSignatureInit {

  export interface Unsafe {
    readonly r: BytesAsInteger.From
    readonly s: BytesAsInteger.From
    readonly v: number
  }

}

export namespace RsvBytesSignature {

  export type Create = RsvBytesSignatureInit

  export type From =
    | RsvBytesSignatureInit.Unsafe
    | Signature

}

export class RsvBytesSignature extends Signature {

  constructor(
    readonly r: Uint8Array<32>,
    readonly s: Uint8Array<32>,
    readonly v: number
  ) {
    super()
  }

  static create(init: RsvBytesSignature.Create): RsvBytesSignature {
    return new RsvBytesSignature(init.r, init.s, init.v)
  }

  static fromOrThrow(from: RsvBytesSignature.From): RsvBytesSignature {
    if (from instanceof Signature)
      return from.toRsvBytesOrThrow()

    const { r, s, v } = from

    const br = BytesAsInteger.Length.fromOrThrow(r, 32)
    const bs = BytesAsInteger.Length.fromOrThrow(s, 32)

    return new RsvBytesSignature(br, bs, v)
  }

  toRsvBytesOrThrow(): RsvBytesSignature {
    return this
  }

  toRsvZeroHexOrThrow(): RsvZeroHexSignature {
    const { r, s, v } = this

    const hr = Base16.get().getOrThrow().encodeOrThrow(r) as ZeroHexString<32> & { readonly length: 66 }
    const hs = Base16.get().getOrThrow().encodeOrThrow(s) as ZeroHexString<32> & { readonly length: 66 }

    return new RsvZeroHexSignature(hr, hs, v)
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    const { r, s, v } = this

    const hr = Base16.get().getOrThrow().encodeOrThrow(r)
    const hs = Base16.get().getOrThrow().encodeOrThrow(s)

    const hvx = v.toString(16) as RawHexString
    const hvp = RawHexString.padStart(hvx)

    return new ZeroHexSignature(`0x${hr}${hs}${hvp}` as ZeroHexString<65>)
  }

  toBytesOrThrow(): BytesSignature {
    const { r, s, v } = this

    const cursor = new Cursor(new Uint8Array(65))

    cursor.writeOrThrow(r)
    cursor.writeOrThrow(s)
    cursor.writeUint8OrThrow(v)

    return new BytesSignature(cursor.bytes as Uint8Array<65>)
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

  export type Create = ZeroHexString<65>

  export type From =
    | ZeroHexAsInteger.From
    | Signature

}

export class ZeroHexSignature extends Signature {

  constructor(
    readonly value: ZeroHexString<65>
  ) {
    super()
  }

  static create(value: ZeroHexSignature.Create): ZeroHexSignature {
    return new ZeroHexSignature(value)
  }

  static fromOrThrow(from: ZeroHexSignature.From): ZeroHexSignature {
    if (from instanceof Signature)
      return from.toZeroHexOrThrow()
    return new ZeroHexSignature(ZeroHexAsInteger.Length.fromOrThrow(from, 65))
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    return this
  }

  toRsvZeroHexOrThrow(): RsvZeroHexSignature {
    const { value } = this

    const r = `0x${value.slice(2, 66)}` as ZeroHexString<32> & { readonly length: 66 }
    const s = `0x${value.slice(66, 130)}` as ZeroHexString<32> & { readonly length: 66 }
    const v = Number(`0x${value.slice(130)}`)

    return new RsvZeroHexSignature(r, s, v)
  }

  toRsvBytesOrThrow(): RsvBytesSignature {
    const { value } = this

    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))

    const cursor = new Cursor(slice.bytes)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvBytesSignature(r, s, v)
  }

  toBytesOrThrow(): BytesSignature {
    const { value } = this

    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))

    return new BytesSignature(slice.bytes.slice() as Uint8Array<65>)
  }

  toExtOrThrow(): ExtSignature {
    const { value } = this

    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))

    const inner = Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(slice.bytes)

    return new ExtSignature(inner)
  }

}

export namespace BytesSignature {

  export type Create = Uint8Array<65>

  export type From =
    | BytesAsInteger.From
    | Signature

}

export class BytesSignature extends Signature {

  constructor(
    readonly value: Uint8Array<65>
  ) {
    super()
  }

  static create(value: BytesSignature.Create): BytesSignature {
    return new BytesSignature(value)
  }

  static fromOrThrow(from: BytesSignature.From): BytesSignature {
    if (from instanceof Signature)
      return from.toBytesOrThrow()
    return new BytesSignature(BytesAsInteger.Length.fromOrThrow(from, 65))
  }

  toBytesOrThrow(): BytesSignature {
    return this
  }

  toRsvZeroHexOrThrow(): RsvZeroHexSignature {
    const { value } = this

    const cursor = new Cursor(value)

    const hr = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32> & { readonly length: 66 }
    const hs = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32> & { readonly length: 66 }

    const v = cursor.readUint8OrThrow()

    return new RsvZeroHexSignature(hr, hs, v)
  }

  toRsvBytesOrThrow(): RsvBytesSignature {
    const { value } = this

    const cursor = new Cursor(value)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvBytesSignature(r, s, v)
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    const { value } = this

    const base16 = Base16.get().getOrThrow().encodeOrThrow(value)

    return new ZeroHexSignature(`0x${base16}` as ZeroHexString<65>)
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
    | Secp256k1.SignatureAndRecovery
    | Signature

}

export class ExtSignature extends Signature {

  constructor(
    readonly value: Secp256k1.SignatureAndRecovery
  ) {
    super()
  }

  static create(value: ExtSignature.Create): ExtSignature {
    return new ExtSignature(value)
  }

  static fromOrThrow(from: ExtSignature.From): ExtSignature {
    if (from instanceof Signature)
      return from.toExtOrThrow()
    return new ExtSignature(from)
  }

  toExtOrThrow(): ExtSignature {
    return this
  }

  toRsvZeroHexOrThrow(): RsvZeroHexSignature {
    const { value } = this

    using slice = value.exportOrThrow()

    const cursor = new Cursor(slice.bytes)

    const hr = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32> & { readonly length: 66 }
    const hs = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32> & { readonly length: 66 }

    const v = cursor.readUint8OrThrow()

    return new RsvZeroHexSignature(hr, hs, v)
  }

  toRsvBytesOrThrow(): RsvBytesSignature {
    const { value } = this

    using slice = value.exportOrThrow()

    const cursor = new Cursor(slice.bytes)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvBytesSignature(r, s, v)
  }

  toZeroHexOrThrow(): ZeroHexSignature {
    const { value } = this

    using slice = value.exportOrThrow()

    const base16 = Base16.get().getOrThrow().encodeOrThrow(slice.bytes)

    return new ZeroHexSignature(`0x${base16}` as ZeroHexString<65>)
  }

  toBytesOrThrow(): BytesSignature {
    const { value } = this

    using slice = value.exportOrThrow()

    return new BytesSignature(slice.bytes.slice() as Uint8Array<65>)
  }

}