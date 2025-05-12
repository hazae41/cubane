import { Base16 } from "@hazae41/base16"
import { Box } from "@hazae41/box"
import { Bytes, Uint8Array } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { RawHexString, ZeroHexString } from "@hazae41/hexane"
import { Secp256k1 } from "@hazae41/secp256k1"
import { BytesAsInteger, CopiableBytesAsInteger, NumberAsInteger, RawHexAsInteger, ZeroHexAsInteger } from "../../convert/index.js"

export type Signature =
  | RsvZeroHexSignature
  | RsvBytesSignature
  | ZeroHexSignature
  | BytesSignature
  | ExtSignature

export namespace Signature {

  export type From =
    | RsvZeroHexSignatureInit
    | RsvBytesSignatureInit
    | ZeroHexSignatureInit
    | BytesSignatureInit
    | ExtSignatureInit

  export function fromOrThrow(from: From): Signature {
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

export type RsvSignatureInit =
  | RsvZeroHexSignatureInit
  | RsvBytesSignatureInit

export interface RsvZeroHexSignatureInit {
  readonly r: ZeroHexAsInteger.From
  readonly s: ZeroHexAsInteger.From
  readonly v: NumberAsInteger.From
}

export class RsvZeroHexSignature {

  constructor(
    readonly r: ZeroHexString<32>,
    readonly s: ZeroHexString<32>,
    readonly v: number
  ) { }

  sizeOrThrow() {
    return 65
  }

  writeOrThrow(cursor: Cursor) {
    const { r, s, v } = this

    using br = CopiableBytesAsInteger.Length.fromOrThrow(r, 32)
    using bs = CopiableBytesAsInteger.Length.fromOrThrow(s, 32)

    const nv = NumberAsInteger.fromOrThrow(v)

    cursor.writeOrThrow(br.bytes)
    cursor.writeOrThrow(bs.bytes)
    cursor.writeUint8OrThrow(nv)
  }

}

export namespace RsvZeroHexSignature {

  export type From = Signature.From

  export function fromOrThrow(from: From): RsvZeroHexSignature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

}
export namespace RsvZeroHexSignature {

  export function readOrThrow(cursor: Cursor): RsvZeroHexSignature {
    const hr = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>
    const hs = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>

    const nv = cursor.readUint8OrThrow()

    return new RsvZeroHexSignature(hr, hs, nv)
  }

}

export namespace RsvZeroHexSignature {

  export function fromRsvOrThrow(from: RsvSignatureInit): RsvZeroHexSignature {
    const { r, s, v } = from

    const hr = ZeroHexAsInteger.Length.fromOrThrow(r, 32)
    const hs = ZeroHexAsInteger.Length.fromOrThrow(s, 32)
    const nv = NumberAsInteger.fromOrThrow(v)

    return new RsvZeroHexSignature(hr, hs, nv)
  }

  export function fromBytesOrThrow(from: Uint8Array): RsvZeroHexSignature {
    return readOrThrow(new Cursor(from))
  }

  export function fromExtOrThrow(from: ExtSignature): RsvZeroHexSignature {
    using memory = from.exportOrThrow()

    return fromBytesOrThrow(memory.bytes)
  }

  export function fromOtherOrThrow(from: ZeroHexAsInteger.From): RsvZeroHexSignature {
    using memory = CopiableBytesAsInteger.Length.fromOrThrow(from, 65)

    return fromBytesOrThrow(memory.bytes)
  }

}

export interface RsvBytesSignatureInit {
  readonly r: BytesAsInteger.From
  readonly s: BytesAsInteger.From
  readonly v: NumberAsInteger.From
}

export class RsvBytesSignature {

  constructor(
    readonly r: Uint8Array<32>,
    readonly s: Uint8Array<32>,
    readonly v: number
  ) { }

  sizeOrThrow() {
    return 65
  }

  writeOrThrow(cursor: Cursor) {
    const { r, s, v } = this

    cursor.writeOrThrow(r)
    cursor.writeOrThrow(s)
    cursor.writeUint8OrThrow(v)
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

  export type From = Signature.From

  export function fromOrThrow(from: From): RsvBytesSignature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

}

export namespace RsvBytesSignature {

  export function fromRsvOrThrow(from: RsvSignatureInit): RsvBytesSignature {
    const { r, s, v } = from

    const br = BytesAsInteger.Length.fromOrThrow(r, 32)
    const bs = BytesAsInteger.Length.fromOrThrow(s, 32)
    const nv = NumberAsInteger.fromOrThrow(v)

    return new RsvBytesSignature(br, bs, nv)
  }

  export function fromBytesOrThrow(from: Uint8Array): RsvBytesSignature {
    return readOrThrow(new Cursor(from))
  }

  export function fromExtOrThrow(from: ExtSignature): RsvBytesSignature {
    using memory = from.exportOrThrow()

    return fromBytesOrThrow(memory.bytes)
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): RsvBytesSignature {
    using memory = CopiableBytesAsInteger.Length.fromOrThrow(from, 65)

    return fromBytesOrThrow(memory.bytes)
  }

}

export type ZeroHexSignatureInit = ZeroHexAsInteger.From

export type ZeroHexSignature = ZeroHexString<65>

export namespace ZeroHexSignature {

  export type From = Signature.From

  export function fromOrThrow(from: From): ZeroHexSignature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

}

export namespace ZeroHexSignature {

  export function fromRsvOrThrow(from: RsvSignatureInit): ZeroHexSignature {
    const { r, s, v } = from

    const hr = RawHexAsInteger.Length.fromOrThrow(r, 32)
    const hs = RawHexAsInteger.Length.fromOrThrow(s, 32)

    const hvx = RawHexAsInteger.fromOrThrow(v)
    const hvp = RawHexString.padStart(hvx)

    return `0x${hr}${hs}${hvp}` as ZeroHexString<65>
  }

  export function fromExtOrThrow(from: ExtSignature): ZeroHexSignature {
    using memory = from.exportOrThrow()
    const base16 = Base16.get().getOrThrow().encodeOrThrow(memory.bytes)

    return `0x${base16}` as ZeroHexString<65>
  }

  export function fromBytesOrThrow(from: Uint8Array): ZeroHexSignature {
    const bytes = Bytes.castOrThrow(from, 65)
    const base16 = Base16.get().getOrThrow().encodeOrThrow(bytes)

    return `0x${base16}` as ZeroHexString<65>
  }

  export function fromOtherOrThrow(from: ZeroHexAsInteger.From): ZeroHexSignature {
    return ZeroHexAsInteger.Length.fromOrThrow(from, 65)
  }

}

export type BytesSignatureInit = BytesAsInteger.From

export type BytesSignature = Uint8Array<65>

export namespace BytesSignature {

  export type From = Signature.From

  export function fromOrThrow(from: From): BytesSignature {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

}

export namespace BytesSignature {

  export function fromExtOrThrow(from: ExtSignature): BytesSignature {
    using memory = from.exportOrThrow()

    return memory.bytes.slice() as Uint8Array<65>
  }

  export function fromBytesOrThrow(from: Uint8Array): BytesSignature {
    return Bytes.castOrThrow(from, 65)
  }

  export function fromRsvOrThrow(from: RsvSignatureInit): BytesSignature {
    const rsv = RsvBytesSignature.fromRsvOrThrow(from)
    const cursor = new Cursor(new Uint8Array(65))

    rsv.writeOrThrow(cursor)

    return cursor.bytes as Uint8Array<65>
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): BytesSignature {
    return BytesAsInteger.Length.fromOrThrow(from, 65)
  }

}

export type ExtSignatureInit = Secp256k1.SignatureAndRecovery

export type ExtSignature = Secp256k1.SignatureAndRecovery


export namespace ExtSignature {

  export type From = Signature.From

  export function fromOrThrow(from: From): Box<ExtSignature> {
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExtOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

}

export namespace ExtSignature {

  export function fromRsvOrThrow(from: RsvSignatureInit): Box<ExtSignature> {
    const rsv = RsvBytesSignature.fromRsvOrThrow(from)
    const cursor = new Cursor(new Uint8Array(65))

    rsv.writeOrThrow(cursor)

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