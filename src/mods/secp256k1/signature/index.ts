import { Base16 } from "@hazae41/base16"
import { Box } from "@hazae41/box"
import { Bytes, Uint8Array } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { RawHexString, ZeroHexString } from "@hazae41/hexane"
import { Secp256k1 } from "@hazae41/secp256k1"
import { Copiable } from "libs/copiable/index.js"
import { BytesAsInteger, CopiableBytesAsInteger, NumberAsInteger, RawHexAsInteger, ZeroHexAsInteger } from "../../convert/index.js"

export type Signature =
  | RsvZeroHexSignature
  | RsvBytesSignature
  | ZeroHexSignature
  | BytesSignature
  | ExtSignature

export namespace Signature {

  export type From =
    | RsvZeroHexSignature.From
    | RsvBytesSignature.From
    | ZeroHexSignature.From
    | BytesSignature.From
    | ExtSignature.From

  export function fromOrThrow(from: Signature.From): Signature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return from
    if (from instanceof Uint8Array)
      return BytesSignature.fromBytesOrThrow(from)
    if (typeof from === "object")
      return RsvZeroHexSignature.fromRsvOrThrow(from)
    return ZeroHexSignature.fromOtherOrThrow(from)
  }

}

export type RsvSignature =
  | RsvZeroHexSignature
  | RsvBytesSignature

export namespace RsvSignature {

  export type From =
    | RsvZeroHexSignature.From
    | RsvBytesSignature.From

}

export interface RsvZeroHexSignature {
  readonly r: ZeroHexString<32>
  readonly s: ZeroHexString<32>
  readonly v: number
}

export class RsvZeroHexSignature {

  constructor(
    readonly r: ZeroHexString<32>,
    readonly s: ZeroHexString<32>,
    readonly v: number
  ) { }

}

export namespace RsvZeroHexSignature {

  export interface From {
    readonly r: ZeroHexAsInteger.From
    readonly s: ZeroHexAsInteger.From
    readonly v: NumberAsInteger.From
  }

  export function fromOrThrow(from: Signature.From): RsvZeroHexSignature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSignature): RsvZeroHexSignature {
    using slice = from.exportOrThrow()

    const cursor = new Cursor(slice.bytes)

    const hr = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>
    const hs = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>

    const v = cursor.readUint8OrThrow()

    return new RsvZeroHexSignature(hr, hs, v)
  }

  export function fromBytesOrThrow(from: Uint8Array): RsvZeroHexSignature {
    const cursor = new Cursor(from)

    const hr = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>
    const hs = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>

    const v = cursor.readUint8OrThrow()

    return new RsvZeroHexSignature(hr, hs, v)
  }

  export function fromRsvOrThrow(from: RsvSignature.From): RsvZeroHexSignature {
    const { r, s, v } = from

    const hr = ZeroHexAsInteger.Length.fromOrThrow(r, 32)
    const hs = ZeroHexAsInteger.Length.fromOrThrow(s, 32)
    const nv = NumberAsInteger.fromOrThrow(v)

    return new RsvZeroHexSignature(hr, hs, nv)
  }

  export function fromOtherOrThrow(from: ZeroHexAsInteger.From): RsvZeroHexSignature {
    const bytes = BytesAsInteger.Length.fromOrThrow(from, 65)

    const cursor = new Cursor(bytes)

    const hr = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>
    const hs = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>

    const v = cursor.readUint8OrThrow()

    return new RsvZeroHexSignature(hr, hs, v)
  }

}

export interface RsvBytesSignature {
  readonly r: Uint8Array<32>
  readonly s: Uint8Array<32>
  readonly v: number
}

export class RsvBytesSignature {

  constructor(
    readonly r: Uint8Array<32>,
    readonly s: Uint8Array<32>,
    readonly v: number
  ) { }

}

export namespace RsvBytesSignature {

  export interface From {
    readonly r: BytesAsInteger.From
    readonly s: BytesAsInteger.From
    readonly v: NumberAsInteger.From
  }

  export function fromOrThrow(from: Signature.From): RsvBytesSignature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSignature): RsvBytesSignature {
    using slice = from.exportOrThrow()

    const cursor = new Cursor(slice.bytes)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvBytesSignature(r, s, v)
  }

  export function fromBytesOrThrow(from: Uint8Array): RsvBytesSignature {
    const cursor = new Cursor(from)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvBytesSignature(r, s, v)
  }

  export function fromRsvOrThrow(from: RsvSignature.From): RsvBytesSignature {
    const { r, s, v } = from

    const br = BytesAsInteger.Length.fromOrThrow(r, 32)
    const bs = BytesAsInteger.Length.fromOrThrow(s, 32)
    const nv = NumberAsInteger.fromOrThrow(v)

    return new RsvBytesSignature(br, bs, nv)
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): RsvBytesSignature {
    const bytes = BytesAsInteger.Length.fromOrThrow(from, 65)

    const cursor = new Cursor(bytes)

    const r = cursor.readAndCopyOrThrow(32)
    const s = cursor.readAndCopyOrThrow(32)
    const v = cursor.readUint8OrThrow()

    return new RsvBytesSignature(r, s, v)
  }

}

export type ZeroHexSignature = ZeroHexString<65>

export namespace ZeroHexSignature {

  export type From = ZeroHexAsInteger.From

  export function fromOrThrow(from: Signature.From): ZeroHexSignature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSignature): ZeroHexSignature {
    using slice = from.exportOrThrow()

    const base16 = Base16.get().getOrThrow().encodeOrThrow(slice.bytes)

    return `0x${base16}` as ZeroHexString<65>
  }

  export function fromBytesOrThrow(from: Uint8Array): ZeroHexSignature {
    const bytes = Bytes.castOrThrow(from, 65)
    const base16 = Base16.get().getOrThrow().encodeOrThrow(bytes)

    return `0x${base16}` as ZeroHexString<65>
  }

  export function fromRsvOrThrow(from: RsvSignature.From): ZeroHexSignature {
    const { r, s, v } = from

    const hr = RawHexAsInteger.Length.fromOrThrow(r, 32)
    const hs = RawHexAsInteger.Length.fromOrThrow(s, 32)

    const hvx = RawHexAsInteger.fromOrThrow(v)
    const hvp = RawHexString.padStart(hvx)

    return `0x${hr}${hs}${hvp}` as ZeroHexString<65>
  }

  export function fromOtherOrThrow(from: ZeroHexAsInteger.From): ZeroHexSignature {
    return ZeroHexAsInteger.Length.fromOrThrow(from, 65)
  }

}

export type BytesSignature = Uint8Array<65>

export namespace BytesSignature {

  export type From = BytesAsInteger.From

  export function fromOrThrow(from: Signature.From): BytesSignature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSignature): BytesSignature {
    return Copiable.copyAndDispose(from.exportOrThrow()) as Uint8Array<65>
  }

  export function fromBytesOrThrow(from: Uint8Array): BytesSignature {
    return Bytes.castOrThrow(from, 65) as Uint8Array<65>
  }

  export function fromRsvOrThrow(from: RsvSignature.From): BytesSignature {
    const { r, s, v } = from

    using br = CopiableBytesAsInteger.Length.fromOrThrow(r, 32)
    using bs = CopiableBytesAsInteger.Length.fromOrThrow(s, 32)

    const cursor = new Cursor(new Uint8Array(65))

    cursor.writeOrThrow(br.bytes)
    cursor.writeOrThrow(bs.bytes)

    cursor.writeUint8OrThrow(NumberAsInteger.fromOrThrow(v))

    return cursor.bytes as Uint8Array<65>
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): BytesSignature {
    return BytesAsInteger.Length.fromOrThrow(from, 65)
  }

}

export type ExtSignature = Secp256k1.SignatureAndRecovery

export namespace ExtSignature {

  export type From = Secp256k1.SignatureAndRecovery

  export function fromOrThrow(from: Signature.From): Box<ExtSignature> {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromRsvOrThrow(from: RsvSignature.From): Box<ExtSignature> {
    const { r, s, v } = from

    using br = CopiableBytesAsInteger.Length.fromOrThrow(r, 32)
    using bs = CopiableBytesAsInteger.Length.fromOrThrow(s, 32)

    const cursor = new Cursor(new Uint8Array(65))

    cursor.writeOrThrow(br.bytes)
    cursor.writeOrThrow(bs.bytes)

    cursor.writeUint8OrThrow(NumberAsInteger.fromOrThrow(v))

    return new Box(Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(cursor.bytes))
  }

  export function fromBytesOrThrow(from: Uint8Array): Box<ExtSignature> {
    return new Box(Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(Bytes.castOrThrow(from, 65)))
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): Box<ExtSignature> {
    return new Box(Secp256k1.get().getOrThrow().SignatureAndRecovery.importOrThrow(BytesAsInteger.Length.fromOrThrow(from, 65)))
  }

  export function fromExtOrThrow(from: ExtSignature): Box<ExtSignature> {
    return Box.createAsDropped(from)
  }

}