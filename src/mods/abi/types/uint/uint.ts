import { Cursor } from "@hazae41/cursor";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { Bytes } from "@hazae41/bytes";
import { Base16 } from "@hazae41/base16";
import { ZeroHexString } from "mods/types/zerohex/index.js";
import { RawHexString } from "mods/types/rawhex/index.js";

export type StaticUint8 =
  | ZeroHexStaticUint8
  | BytesStaticUint8

export namespace StaticUint8 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint8.From
    | BytesStaticUint8.From

  export function create(value: StaticUint8.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint8.create(value)
    return ZeroHexStaticUint8.create(value)
  }

  export function from(value: StaticUint8.From) {
    return StaticUint8.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int8`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint8.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint8.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint8 {
  export type From = Bytes<1>
}

export class BytesStaticUint8 {
  readonly #class = BytesStaticUint8
  readonly name = this.#class.name

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint8.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint8(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint8(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint8.From) {
    return new BytesStaticUint8(value)
  }

  static from(value: BytesStaticUint8.From) {
    return BytesStaticUint8.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint8(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint8.nibbles

    const content = cursor.readOrThrow(BytesStaticUint8.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint8(value as Bytes<1>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint8.bytes

    const content = cursor.readOrThrow(BytesStaticUint8.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint8(value)
  }

}

export namespace ZeroHexStaticUint8 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint8 {
  readonly #class = ZeroHexStaticUint8
  readonly name = this.#class.name

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint8(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint8.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint8.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint8.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint8(value.slice(2))
  }

  static from(value: ZeroHexStaticUint8.From) {
    return ZeroHexStaticUint8.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint8(cursor.readOrThrow(ZeroHexStaticUint8.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint8.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint8.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint8(value)
  }

}

export type StaticUint16 =
  | ZeroHexStaticUint16
  | BytesStaticUint16

export namespace StaticUint16 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint16.From
    | BytesStaticUint16.From

  export function create(value: StaticUint16.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint16.create(value)
    return ZeroHexStaticUint16.create(value)
  }

  export function from(value: StaticUint16.From) {
    return StaticUint16.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int16`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint16.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint16.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint16 {
  export type From = Bytes<2>
}

export class BytesStaticUint16 {
  readonly #class = BytesStaticUint16
  readonly name = this.#class.name

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint16.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint16(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint16(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint16.From) {
    return new BytesStaticUint16(value)
  }

  static from(value: BytesStaticUint16.From) {
    return BytesStaticUint16.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint16(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint16.nibbles

    const content = cursor.readOrThrow(BytesStaticUint16.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint16(value as Bytes<2>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint16.bytes

    const content = cursor.readOrThrow(BytesStaticUint16.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint16(value)
  }

}

export namespace ZeroHexStaticUint16 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint16 {
  readonly #class = ZeroHexStaticUint16
  readonly name = this.#class.name

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint16(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint16.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint16.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint16.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint16(value.slice(2))
  }

  static from(value: ZeroHexStaticUint16.From) {
    return ZeroHexStaticUint16.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint16(cursor.readOrThrow(ZeroHexStaticUint16.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint16.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint16.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint16(value)
  }

}

export type StaticUint24 =
  | ZeroHexStaticUint24
  | BytesStaticUint24

export namespace StaticUint24 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint24.From
    | BytesStaticUint24.From

  export function create(value: StaticUint24.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint24.create(value)
    return ZeroHexStaticUint24.create(value)
  }

  export function from(value: StaticUint24.From) {
    return StaticUint24.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int24`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint24.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint24.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint24 {
  export type From = Bytes<3>
}

export class BytesStaticUint24 {
  readonly #class = BytesStaticUint24
  readonly name = this.#class.name

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint24.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint24(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint24(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint24.From) {
    return new BytesStaticUint24(value)
  }

  static from(value: BytesStaticUint24.From) {
    return BytesStaticUint24.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint24(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint24.nibbles

    const content = cursor.readOrThrow(BytesStaticUint24.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint24(value as Bytes<3>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint24.bytes

    const content = cursor.readOrThrow(BytesStaticUint24.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint24(value)
  }

}

export namespace ZeroHexStaticUint24 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint24 {
  readonly #class = ZeroHexStaticUint24
  readonly name = this.#class.name

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint24(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint24.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint24.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint24.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint24(value.slice(2))
  }

  static from(value: ZeroHexStaticUint24.From) {
    return ZeroHexStaticUint24.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint24(cursor.readOrThrow(ZeroHexStaticUint24.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint24.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint24.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint24(value)
  }

}

export type StaticUint32 =
  | ZeroHexStaticUint32
  | BytesStaticUint32

export namespace StaticUint32 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint32.From
    | BytesStaticUint32.From

  export function create(value: StaticUint32.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint32.create(value)
    return ZeroHexStaticUint32.create(value)
  }

  export function from(value: StaticUint32.From) {
    return StaticUint32.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int32`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint32.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint32.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint32 {
  export type From = Bytes<4>
}

export class BytesStaticUint32 {
  readonly #class = BytesStaticUint32
  readonly name = this.#class.name

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint32.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint32(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint32(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint32.From) {
    return new BytesStaticUint32(value)
  }

  static from(value: BytesStaticUint32.From) {
    return BytesStaticUint32.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint32(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint32.nibbles

    const content = cursor.readOrThrow(BytesStaticUint32.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint32(value as Bytes<4>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint32.bytes

    const content = cursor.readOrThrow(BytesStaticUint32.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint32(value)
  }

}

export namespace ZeroHexStaticUint32 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint32 {
  readonly #class = ZeroHexStaticUint32
  readonly name = this.#class.name

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint32(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint32.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint32.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint32.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint32(value.slice(2))
  }

  static from(value: ZeroHexStaticUint32.From) {
    return ZeroHexStaticUint32.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint32(cursor.readOrThrow(ZeroHexStaticUint32.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint32.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint32.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint32(value)
  }

}

export type StaticUint40 =
  | ZeroHexStaticUint40
  | BytesStaticUint40

export namespace StaticUint40 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint40.From
    | BytesStaticUint40.From

  export function create(value: StaticUint40.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint40.create(value)
    return ZeroHexStaticUint40.create(value)
  }

  export function from(value: StaticUint40.From) {
    return StaticUint40.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int40`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint40.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint40.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint40 {
  export type From = Bytes<5>
}

export class BytesStaticUint40 {
  readonly #class = BytesStaticUint40
  readonly name = this.#class.name

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint40.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint40(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint40(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint40.From) {
    return new BytesStaticUint40(value)
  }

  static from(value: BytesStaticUint40.From) {
    return BytesStaticUint40.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint40(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int40`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint40.nibbles

    const content = cursor.readOrThrow(BytesStaticUint40.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint40(value as Bytes<5>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint40.bytes

    const content = cursor.readOrThrow(BytesStaticUint40.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint40(value)
  }

}

export namespace ZeroHexStaticUint40 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint40 {
  readonly #class = ZeroHexStaticUint40
  readonly name = this.#class.name

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint40(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint40.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint40.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint40.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint40(value.slice(2))
  }

  static from(value: ZeroHexStaticUint40.From) {
    return ZeroHexStaticUint40.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int40`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint40(cursor.readOrThrow(ZeroHexStaticUint40.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint40.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint40.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint40(value)
  }

}

export type StaticUint48 =
  | ZeroHexStaticUint48
  | BytesStaticUint48

export namespace StaticUint48 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint48.From
    | BytesStaticUint48.From

  export function create(value: StaticUint48.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint48.create(value)
    return ZeroHexStaticUint48.create(value)
  }

  export function from(value: StaticUint48.From) {
    return StaticUint48.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int48`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint48.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint48.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint48 {
  export type From = Bytes<6>
}

export class BytesStaticUint48 {
  readonly #class = BytesStaticUint48
  readonly name = this.#class.name

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint48.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint48(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint48(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint48.From) {
    return new BytesStaticUint48(value)
  }

  static from(value: BytesStaticUint48.From) {
    return BytesStaticUint48.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint48(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int48`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint48.nibbles

    const content = cursor.readOrThrow(BytesStaticUint48.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint48(value as Bytes<6>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint48.bytes

    const content = cursor.readOrThrow(BytesStaticUint48.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint48(value)
  }

}

export namespace ZeroHexStaticUint48 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint48 {
  readonly #class = ZeroHexStaticUint48
  readonly name = this.#class.name

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint48(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint48.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint48.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint48.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint48(value.slice(2))
  }

  static from(value: ZeroHexStaticUint48.From) {
    return ZeroHexStaticUint48.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int48`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint48(cursor.readOrThrow(ZeroHexStaticUint48.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint48.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint48.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint48(value)
  }

}

export type StaticUint56 =
  | ZeroHexStaticUint56
  | BytesStaticUint56

export namespace StaticUint56 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint56.From
    | BytesStaticUint56.From

  export function create(value: StaticUint56.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint56.create(value)
    return ZeroHexStaticUint56.create(value)
  }

  export function from(value: StaticUint56.From) {
    return StaticUint56.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int56`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint56.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint56.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint56 {
  export type From = Bytes<7>
}

export class BytesStaticUint56 {
  readonly #class = BytesStaticUint56
  readonly name = this.#class.name

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint56.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint56(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint56(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint56.From) {
    return new BytesStaticUint56(value)
  }

  static from(value: BytesStaticUint56.From) {
    return BytesStaticUint56.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint56(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int56`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint56.nibbles

    const content = cursor.readOrThrow(BytesStaticUint56.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint56(value as Bytes<7>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint56.bytes

    const content = cursor.readOrThrow(BytesStaticUint56.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint56(value)
  }

}

export namespace ZeroHexStaticUint56 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint56 {
  readonly #class = ZeroHexStaticUint56
  readonly name = this.#class.name

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint56(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint56.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint56.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint56.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint56(value.slice(2))
  }

  static from(value: ZeroHexStaticUint56.From) {
    return ZeroHexStaticUint56.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int56`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint56(cursor.readOrThrow(ZeroHexStaticUint56.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint56.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint56.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint56(value)
  }

}

export type StaticUint64 =
  | ZeroHexStaticUint64
  | BytesStaticUint64

export namespace StaticUint64 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint64.From
    | BytesStaticUint64.From

  export function create(value: StaticUint64.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint64.create(value)
    return ZeroHexStaticUint64.create(value)
  }

  export function from(value: StaticUint64.From) {
    return StaticUint64.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int64`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint64.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint64.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint64 {
  export type From = Bytes<8>
}

export class BytesStaticUint64 {
  readonly #class = BytesStaticUint64
  readonly name = this.#class.name

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint64.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint64(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint64(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint64.From) {
    return new BytesStaticUint64(value)
  }

  static from(value: BytesStaticUint64.From) {
    return BytesStaticUint64.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint64(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int64`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint64.nibbles

    const content = cursor.readOrThrow(BytesStaticUint64.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint64(value as Bytes<8>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint64.bytes

    const content = cursor.readOrThrow(BytesStaticUint64.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint64(value)
  }

}

export namespace ZeroHexStaticUint64 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint64 {
  readonly #class = ZeroHexStaticUint64
  readonly name = this.#class.name

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint64(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint64.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint64.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint64.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint64(value.slice(2))
  }

  static from(value: ZeroHexStaticUint64.From) {
    return ZeroHexStaticUint64.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int64`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint64(cursor.readOrThrow(ZeroHexStaticUint64.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint64.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint64.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint64(value)
  }

}

export type StaticUint72 =
  | ZeroHexStaticUint72
  | BytesStaticUint72

export namespace StaticUint72 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint72.From
    | BytesStaticUint72.From

  export function create(value: StaticUint72.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint72.create(value)
    return ZeroHexStaticUint72.create(value)
  }

  export function from(value: StaticUint72.From) {
    return StaticUint72.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int72`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint72.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint72.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint72 {
  export type From = Bytes<9>
}

export class BytesStaticUint72 {
  readonly #class = BytesStaticUint72
  readonly name = this.#class.name

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint72.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint72(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint72(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint72.From) {
    return new BytesStaticUint72(value)
  }

  static from(value: BytesStaticUint72.From) {
    return BytesStaticUint72.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint72(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int72`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint72.nibbles

    const content = cursor.readOrThrow(BytesStaticUint72.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint72(value as Bytes<9>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint72.bytes

    const content = cursor.readOrThrow(BytesStaticUint72.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint72(value)
  }

}

export namespace ZeroHexStaticUint72 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint72 {
  readonly #class = ZeroHexStaticUint72
  readonly name = this.#class.name

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint72(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint72.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint72.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint72.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint72(value.slice(2))
  }

  static from(value: ZeroHexStaticUint72.From) {
    return ZeroHexStaticUint72.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int72`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint72(cursor.readOrThrow(ZeroHexStaticUint72.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint72.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint72.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint72(value)
  }

}

export type StaticUint80 =
  | ZeroHexStaticUint80
  | BytesStaticUint80

export namespace StaticUint80 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint80.From
    | BytesStaticUint80.From

  export function create(value: StaticUint80.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint80.create(value)
    return ZeroHexStaticUint80.create(value)
  }

  export function from(value: StaticUint80.From) {
    return StaticUint80.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int80`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint80.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint80.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint80 {
  export type From = Bytes<10>
}

export class BytesStaticUint80 {
  readonly #class = BytesStaticUint80
  readonly name = this.#class.name

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint80.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint80(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint80(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint80.From) {
    return new BytesStaticUint80(value)
  }

  static from(value: BytesStaticUint80.From) {
    return BytesStaticUint80.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint80(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int80`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint80.nibbles

    const content = cursor.readOrThrow(BytesStaticUint80.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint80(value as Bytes<10>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint80.bytes

    const content = cursor.readOrThrow(BytesStaticUint80.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint80(value)
  }

}

export namespace ZeroHexStaticUint80 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint80 {
  readonly #class = ZeroHexStaticUint80
  readonly name = this.#class.name

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint80(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint80.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint80.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint80.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint80(value.slice(2))
  }

  static from(value: ZeroHexStaticUint80.From) {
    return ZeroHexStaticUint80.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int80`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint80(cursor.readOrThrow(ZeroHexStaticUint80.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint80.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint80.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint80(value)
  }

}

export type StaticUint88 =
  | ZeroHexStaticUint88
  | BytesStaticUint88

export namespace StaticUint88 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint88.From
    | BytesStaticUint88.From

  export function create(value: StaticUint88.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint88.create(value)
    return ZeroHexStaticUint88.create(value)
  }

  export function from(value: StaticUint88.From) {
    return StaticUint88.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int88`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint88.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint88.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint88 {
  export type From = Bytes<11>
}

export class BytesStaticUint88 {
  readonly #class = BytesStaticUint88
  readonly name = this.#class.name

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint88.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint88(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint88(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint88.From) {
    return new BytesStaticUint88(value)
  }

  static from(value: BytesStaticUint88.From) {
    return BytesStaticUint88.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint88(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int88`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint88.nibbles

    const content = cursor.readOrThrow(BytesStaticUint88.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint88(value as Bytes<11>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint88.bytes

    const content = cursor.readOrThrow(BytesStaticUint88.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint88(value)
  }

}

export namespace ZeroHexStaticUint88 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint88 {
  readonly #class = ZeroHexStaticUint88
  readonly name = this.#class.name

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint88(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint88.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint88.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint88.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint88(value.slice(2))
  }

  static from(value: ZeroHexStaticUint88.From) {
    return ZeroHexStaticUint88.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int88`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint88(cursor.readOrThrow(ZeroHexStaticUint88.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint88.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint88.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint88(value)
  }

}

export type StaticUint96 =
  | ZeroHexStaticUint96
  | BytesStaticUint96

export namespace StaticUint96 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint96.From
    | BytesStaticUint96.From

  export function create(value: StaticUint96.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint96.create(value)
    return ZeroHexStaticUint96.create(value)
  }

  export function from(value: StaticUint96.From) {
    return StaticUint96.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int96`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint96.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint96.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint96 {
  export type From = Bytes<12>
}

export class BytesStaticUint96 {
  readonly #class = BytesStaticUint96
  readonly name = this.#class.name

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint96.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint96(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint96(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint96.From) {
    return new BytesStaticUint96(value)
  }

  static from(value: BytesStaticUint96.From) {
    return BytesStaticUint96.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint96(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int96`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint96.nibbles

    const content = cursor.readOrThrow(BytesStaticUint96.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint96(value as Bytes<12>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint96.bytes

    const content = cursor.readOrThrow(BytesStaticUint96.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint96(value)
  }

}

export namespace ZeroHexStaticUint96 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint96 {
  readonly #class = ZeroHexStaticUint96
  readonly name = this.#class.name

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint96(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint96.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint96.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint96.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint96(value.slice(2))
  }

  static from(value: ZeroHexStaticUint96.From) {
    return ZeroHexStaticUint96.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int96`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint96(cursor.readOrThrow(ZeroHexStaticUint96.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint96.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint96.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint96(value)
  }

}

export type StaticUint104 =
  | ZeroHexStaticUint104
  | BytesStaticUint104

export namespace StaticUint104 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint104.From
    | BytesStaticUint104.From

  export function create(value: StaticUint104.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint104.create(value)
    return ZeroHexStaticUint104.create(value)
  }

  export function from(value: StaticUint104.From) {
    return StaticUint104.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int104`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint104.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint104.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint104 {
  export type From = Bytes<13>
}

export class BytesStaticUint104 {
  readonly #class = BytesStaticUint104
  readonly name = this.#class.name

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint104.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint104(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint104(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint104.From) {
    return new BytesStaticUint104(value)
  }

  static from(value: BytesStaticUint104.From) {
    return BytesStaticUint104.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint104(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int104`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint104.nibbles

    const content = cursor.readOrThrow(BytesStaticUint104.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint104(value as Bytes<13>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint104.bytes

    const content = cursor.readOrThrow(BytesStaticUint104.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint104(value)
  }

}

export namespace ZeroHexStaticUint104 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint104 {
  readonly #class = ZeroHexStaticUint104
  readonly name = this.#class.name

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint104(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint104.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint104.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint104.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint104(value.slice(2))
  }

  static from(value: ZeroHexStaticUint104.From) {
    return ZeroHexStaticUint104.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int104`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint104(cursor.readOrThrow(ZeroHexStaticUint104.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint104.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint104.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint104(value)
  }

}

export type StaticUint112 =
  | ZeroHexStaticUint112
  | BytesStaticUint112

export namespace StaticUint112 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint112.From
    | BytesStaticUint112.From

  export function create(value: StaticUint112.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint112.create(value)
    return ZeroHexStaticUint112.create(value)
  }

  export function from(value: StaticUint112.From) {
    return StaticUint112.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int112`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint112.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint112.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint112 {
  export type From = Bytes<14>
}

export class BytesStaticUint112 {
  readonly #class = BytesStaticUint112
  readonly name = this.#class.name

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint112.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint112(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint112(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint112.From) {
    return new BytesStaticUint112(value)
  }

  static from(value: BytesStaticUint112.From) {
    return BytesStaticUint112.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint112(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int112`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint112.nibbles

    const content = cursor.readOrThrow(BytesStaticUint112.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint112(value as Bytes<14>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint112.bytes

    const content = cursor.readOrThrow(BytesStaticUint112.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint112(value)
  }

}

export namespace ZeroHexStaticUint112 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint112 {
  readonly #class = ZeroHexStaticUint112
  readonly name = this.#class.name

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint112(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint112.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint112.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint112.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint112(value.slice(2))
  }

  static from(value: ZeroHexStaticUint112.From) {
    return ZeroHexStaticUint112.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int112`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint112(cursor.readOrThrow(ZeroHexStaticUint112.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint112.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint112.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint112(value)
  }

}

export type StaticUint120 =
  | ZeroHexStaticUint120
  | BytesStaticUint120

export namespace StaticUint120 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint120.From
    | BytesStaticUint120.From

  export function create(value: StaticUint120.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint120.create(value)
    return ZeroHexStaticUint120.create(value)
  }

  export function from(value: StaticUint120.From) {
    return StaticUint120.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int120`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint120.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint120.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint120 {
  export type From = Bytes<15>
}

export class BytesStaticUint120 {
  readonly #class = BytesStaticUint120
  readonly name = this.#class.name

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint120.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint120(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint120(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint120.From) {
    return new BytesStaticUint120(value)
  }

  static from(value: BytesStaticUint120.From) {
    return BytesStaticUint120.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint120(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int120`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint120.nibbles

    const content = cursor.readOrThrow(BytesStaticUint120.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint120(value as Bytes<15>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint120.bytes

    const content = cursor.readOrThrow(BytesStaticUint120.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint120(value)
  }

}

export namespace ZeroHexStaticUint120 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint120 {
  readonly #class = ZeroHexStaticUint120
  readonly name = this.#class.name

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint120(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint120.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint120.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint120.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint120(value.slice(2))
  }

  static from(value: ZeroHexStaticUint120.From) {
    return ZeroHexStaticUint120.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int120`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint120(cursor.readOrThrow(ZeroHexStaticUint120.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint120.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint120.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint120(value)
  }

}

export type StaticUint128 =
  | ZeroHexStaticUint128
  | BytesStaticUint128

export namespace StaticUint128 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint128.From
    | BytesStaticUint128.From

  export function create(value: StaticUint128.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint128.create(value)
    return ZeroHexStaticUint128.create(value)
  }

  export function from(value: StaticUint128.From) {
    return StaticUint128.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int128`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint128.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint128.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint128 {
  export type From = Bytes<16>
}

export class BytesStaticUint128 {
  readonly #class = BytesStaticUint128
  readonly name = this.#class.name

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint128.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint128(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint128(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint128.From) {
    return new BytesStaticUint128(value)
  }

  static from(value: BytesStaticUint128.From) {
    return BytesStaticUint128.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint128(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int128`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint128.nibbles

    const content = cursor.readOrThrow(BytesStaticUint128.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint128(value as Bytes<16>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint128.bytes

    const content = cursor.readOrThrow(BytesStaticUint128.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint128(value)
  }

}

export namespace ZeroHexStaticUint128 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint128 {
  readonly #class = ZeroHexStaticUint128
  readonly name = this.#class.name

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint128(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint128.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint128.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint128.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint128(value.slice(2))
  }

  static from(value: ZeroHexStaticUint128.From) {
    return ZeroHexStaticUint128.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int128`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint128(cursor.readOrThrow(ZeroHexStaticUint128.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint128.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint128.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint128(value)
  }

}

export type StaticUint136 =
  | ZeroHexStaticUint136
  | BytesStaticUint136

export namespace StaticUint136 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint136.From
    | BytesStaticUint136.From

  export function create(value: StaticUint136.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint136.create(value)
    return ZeroHexStaticUint136.create(value)
  }

  export function from(value: StaticUint136.From) {
    return StaticUint136.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int136`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint136.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint136.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint136 {
  export type From = Bytes<17>
}

export class BytesStaticUint136 {
  readonly #class = BytesStaticUint136
  readonly name = this.#class.name

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint136.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint136(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint136(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint136.From) {
    return new BytesStaticUint136(value)
  }

  static from(value: BytesStaticUint136.From) {
    return BytesStaticUint136.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint136(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int136`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint136.nibbles

    const content = cursor.readOrThrow(BytesStaticUint136.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint136(value as Bytes<17>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint136.bytes

    const content = cursor.readOrThrow(BytesStaticUint136.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint136(value)
  }

}

export namespace ZeroHexStaticUint136 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint136 {
  readonly #class = ZeroHexStaticUint136
  readonly name = this.#class.name

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint136(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint136.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint136.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint136.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint136(value.slice(2))
  }

  static from(value: ZeroHexStaticUint136.From) {
    return ZeroHexStaticUint136.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int136`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint136(cursor.readOrThrow(ZeroHexStaticUint136.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint136.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint136.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint136(value)
  }

}

export type StaticUint144 =
  | ZeroHexStaticUint144
  | BytesStaticUint144

export namespace StaticUint144 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint144.From
    | BytesStaticUint144.From

  export function create(value: StaticUint144.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint144.create(value)
    return ZeroHexStaticUint144.create(value)
  }

  export function from(value: StaticUint144.From) {
    return StaticUint144.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int144`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint144.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint144.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint144 {
  export type From = Bytes<18>
}

export class BytesStaticUint144 {
  readonly #class = BytesStaticUint144
  readonly name = this.#class.name

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint144.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint144(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint144(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint144.From) {
    return new BytesStaticUint144(value)
  }

  static from(value: BytesStaticUint144.From) {
    return BytesStaticUint144.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint144(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int144`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint144.nibbles

    const content = cursor.readOrThrow(BytesStaticUint144.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint144(value as Bytes<18>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint144.bytes

    const content = cursor.readOrThrow(BytesStaticUint144.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint144(value)
  }

}

export namespace ZeroHexStaticUint144 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint144 {
  readonly #class = ZeroHexStaticUint144
  readonly name = this.#class.name

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint144(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint144.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint144.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint144.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint144(value.slice(2))
  }

  static from(value: ZeroHexStaticUint144.From) {
    return ZeroHexStaticUint144.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int144`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint144(cursor.readOrThrow(ZeroHexStaticUint144.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint144.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint144.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint144(value)
  }

}

export type StaticUint152 =
  | ZeroHexStaticUint152
  | BytesStaticUint152

export namespace StaticUint152 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint152.From
    | BytesStaticUint152.From

  export function create(value: StaticUint152.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint152.create(value)
    return ZeroHexStaticUint152.create(value)
  }

  export function from(value: StaticUint152.From) {
    return StaticUint152.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int152`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint152.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint152.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint152 {
  export type From = Bytes<19>
}

export class BytesStaticUint152 {
  readonly #class = BytesStaticUint152
  readonly name = this.#class.name

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint152.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint152(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint152(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint152.From) {
    return new BytesStaticUint152(value)
  }

  static from(value: BytesStaticUint152.From) {
    return BytesStaticUint152.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint152(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int152`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint152.nibbles

    const content = cursor.readOrThrow(BytesStaticUint152.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint152(value as Bytes<19>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint152.bytes

    const content = cursor.readOrThrow(BytesStaticUint152.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint152(value)
  }

}

export namespace ZeroHexStaticUint152 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint152 {
  readonly #class = ZeroHexStaticUint152
  readonly name = this.#class.name

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint152(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint152.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint152.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint152.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint152(value.slice(2))
  }

  static from(value: ZeroHexStaticUint152.From) {
    return ZeroHexStaticUint152.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int152`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint152(cursor.readOrThrow(ZeroHexStaticUint152.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint152.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint152.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint152(value)
  }

}

export type StaticUint160 =
  | ZeroHexStaticUint160
  | BytesStaticUint160

export namespace StaticUint160 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint160.From
    | BytesStaticUint160.From

  export function create(value: StaticUint160.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint160.create(value)
    return ZeroHexStaticUint160.create(value)
  }

  export function from(value: StaticUint160.From) {
    return StaticUint160.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int160`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint160.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint160.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint160 {
  export type From = Bytes<20>
}

export class BytesStaticUint160 {
  readonly #class = BytesStaticUint160
  readonly name = this.#class.name

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint160.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint160(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint160(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint160.From) {
    return new BytesStaticUint160(value)
  }

  static from(value: BytesStaticUint160.From) {
    return BytesStaticUint160.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint160(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int160`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint160.nibbles

    const content = cursor.readOrThrow(BytesStaticUint160.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint160(value as Bytes<20>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint160.bytes

    const content = cursor.readOrThrow(BytesStaticUint160.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint160(value)
  }

}

export namespace ZeroHexStaticUint160 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint160 {
  readonly #class = ZeroHexStaticUint160
  readonly name = this.#class.name

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint160(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint160.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint160.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint160.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint160(value.slice(2))
  }

  static from(value: ZeroHexStaticUint160.From) {
    return ZeroHexStaticUint160.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int160`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint160(cursor.readOrThrow(ZeroHexStaticUint160.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint160.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint160.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint160(value)
  }

}

export type StaticUint168 =
  | ZeroHexStaticUint168
  | BytesStaticUint168

export namespace StaticUint168 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint168.From
    | BytesStaticUint168.From

  export function create(value: StaticUint168.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint168.create(value)
    return ZeroHexStaticUint168.create(value)
  }

  export function from(value: StaticUint168.From) {
    return StaticUint168.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int168`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint168.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint168.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint168 {
  export type From = Bytes<21>
}

export class BytesStaticUint168 {
  readonly #class = BytesStaticUint168
  readonly name = this.#class.name

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint168.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint168(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint168(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint168.From) {
    return new BytesStaticUint168(value)
  }

  static from(value: BytesStaticUint168.From) {
    return BytesStaticUint168.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint168(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int168`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint168.nibbles

    const content = cursor.readOrThrow(BytesStaticUint168.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint168(value as Bytes<21>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint168.bytes

    const content = cursor.readOrThrow(BytesStaticUint168.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint168(value)
  }

}

export namespace ZeroHexStaticUint168 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint168 {
  readonly #class = ZeroHexStaticUint168
  readonly name = this.#class.name

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint168(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint168.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint168.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint168.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint168(value.slice(2))
  }

  static from(value: ZeroHexStaticUint168.From) {
    return ZeroHexStaticUint168.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int168`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint168(cursor.readOrThrow(ZeroHexStaticUint168.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint168.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint168.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint168(value)
  }

}

export type StaticUint176 =
  | ZeroHexStaticUint176
  | BytesStaticUint176

export namespace StaticUint176 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint176.From
    | BytesStaticUint176.From

  export function create(value: StaticUint176.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint176.create(value)
    return ZeroHexStaticUint176.create(value)
  }

  export function from(value: StaticUint176.From) {
    return StaticUint176.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int176`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint176.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint176.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint176 {
  export type From = Bytes<22>
}

export class BytesStaticUint176 {
  readonly #class = BytesStaticUint176
  readonly name = this.#class.name

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint176.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint176(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint176(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint176.From) {
    return new BytesStaticUint176(value)
  }

  static from(value: BytesStaticUint176.From) {
    return BytesStaticUint176.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint176(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int176`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint176.nibbles

    const content = cursor.readOrThrow(BytesStaticUint176.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint176(value as Bytes<22>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint176.bytes

    const content = cursor.readOrThrow(BytesStaticUint176.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint176(value)
  }

}

export namespace ZeroHexStaticUint176 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint176 {
  readonly #class = ZeroHexStaticUint176
  readonly name = this.#class.name

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint176(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint176.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint176.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint176.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint176(value.slice(2))
  }

  static from(value: ZeroHexStaticUint176.From) {
    return ZeroHexStaticUint176.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int176`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint176(cursor.readOrThrow(ZeroHexStaticUint176.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint176.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint176.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint176(value)
  }

}

export type StaticUint184 =
  | ZeroHexStaticUint184
  | BytesStaticUint184

export namespace StaticUint184 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint184.From
    | BytesStaticUint184.From

  export function create(value: StaticUint184.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint184.create(value)
    return ZeroHexStaticUint184.create(value)
  }

  export function from(value: StaticUint184.From) {
    return StaticUint184.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int184`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint184.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint184.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint184 {
  export type From = Bytes<23>
}

export class BytesStaticUint184 {
  readonly #class = BytesStaticUint184
  readonly name = this.#class.name

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint184.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint184(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint184(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint184.From) {
    return new BytesStaticUint184(value)
  }

  static from(value: BytesStaticUint184.From) {
    return BytesStaticUint184.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint184(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int184`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint184.nibbles

    const content = cursor.readOrThrow(BytesStaticUint184.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint184(value as Bytes<23>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint184.bytes

    const content = cursor.readOrThrow(BytesStaticUint184.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint184(value)
  }

}

export namespace ZeroHexStaticUint184 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint184 {
  readonly #class = ZeroHexStaticUint184
  readonly name = this.#class.name

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint184(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint184.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint184.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint184.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint184(value.slice(2))
  }

  static from(value: ZeroHexStaticUint184.From) {
    return ZeroHexStaticUint184.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int184`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint184(cursor.readOrThrow(ZeroHexStaticUint184.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint184.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint184.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint184(value)
  }

}

export type StaticUint192 =
  | ZeroHexStaticUint192
  | BytesStaticUint192

export namespace StaticUint192 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint192.From
    | BytesStaticUint192.From

  export function create(value: StaticUint192.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint192.create(value)
    return ZeroHexStaticUint192.create(value)
  }

  export function from(value: StaticUint192.From) {
    return StaticUint192.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int192`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint192.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint192.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint192 {
  export type From = Bytes<24>
}

export class BytesStaticUint192 {
  readonly #class = BytesStaticUint192
  readonly name = this.#class.name

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint192.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint192(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint192(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint192.From) {
    return new BytesStaticUint192(value)
  }

  static from(value: BytesStaticUint192.From) {
    return BytesStaticUint192.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint192(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int192`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint192.nibbles

    const content = cursor.readOrThrow(BytesStaticUint192.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint192(value as Bytes<24>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint192.bytes

    const content = cursor.readOrThrow(BytesStaticUint192.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint192(value)
  }

}

export namespace ZeroHexStaticUint192 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint192 {
  readonly #class = ZeroHexStaticUint192
  readonly name = this.#class.name

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint192(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint192.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint192.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint192.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint192(value.slice(2))
  }

  static from(value: ZeroHexStaticUint192.From) {
    return ZeroHexStaticUint192.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int192`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint192(cursor.readOrThrow(ZeroHexStaticUint192.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint192.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint192.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint192(value)
  }

}

export type StaticUint200 =
  | ZeroHexStaticUint200
  | BytesStaticUint200

export namespace StaticUint200 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint200.From
    | BytesStaticUint200.From

  export function create(value: StaticUint200.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint200.create(value)
    return ZeroHexStaticUint200.create(value)
  }

  export function from(value: StaticUint200.From) {
    return StaticUint200.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int200`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint200.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint200.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint200 {
  export type From = Bytes<25>
}

export class BytesStaticUint200 {
  readonly #class = BytesStaticUint200
  readonly name = this.#class.name

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint200.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint200(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint200(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint200.From) {
    return new BytesStaticUint200(value)
  }

  static from(value: BytesStaticUint200.From) {
    return BytesStaticUint200.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint200(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int200`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint200.nibbles

    const content = cursor.readOrThrow(BytesStaticUint200.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint200(value as Bytes<25>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint200.bytes

    const content = cursor.readOrThrow(BytesStaticUint200.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint200(value)
  }

}

export namespace ZeroHexStaticUint200 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint200 {
  readonly #class = ZeroHexStaticUint200
  readonly name = this.#class.name

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint200(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint200.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint200.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint200.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint200(value.slice(2))
  }

  static from(value: ZeroHexStaticUint200.From) {
    return ZeroHexStaticUint200.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int200`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint200(cursor.readOrThrow(ZeroHexStaticUint200.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint200.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint200.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint200(value)
  }

}

export type StaticUint208 =
  | ZeroHexStaticUint208
  | BytesStaticUint208

export namespace StaticUint208 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint208.From
    | BytesStaticUint208.From

  export function create(value: StaticUint208.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint208.create(value)
    return ZeroHexStaticUint208.create(value)
  }

  export function from(value: StaticUint208.From) {
    return StaticUint208.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int208`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint208.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint208.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint208 {
  export type From = Bytes<26>
}

export class BytesStaticUint208 {
  readonly #class = BytesStaticUint208
  readonly name = this.#class.name

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint208.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint208(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint208(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint208.From) {
    return new BytesStaticUint208(value)
  }

  static from(value: BytesStaticUint208.From) {
    return BytesStaticUint208.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint208(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int208`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint208.nibbles

    const content = cursor.readOrThrow(BytesStaticUint208.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint208(value as Bytes<26>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint208.bytes

    const content = cursor.readOrThrow(BytesStaticUint208.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint208(value)
  }

}

export namespace ZeroHexStaticUint208 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint208 {
  readonly #class = ZeroHexStaticUint208
  readonly name = this.#class.name

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint208(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint208.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint208.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint208.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint208(value.slice(2))
  }

  static from(value: ZeroHexStaticUint208.From) {
    return ZeroHexStaticUint208.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int208`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint208(cursor.readOrThrow(ZeroHexStaticUint208.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint208.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint208.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint208(value)
  }

}

export type StaticUint216 =
  | ZeroHexStaticUint216
  | BytesStaticUint216

export namespace StaticUint216 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint216.From
    | BytesStaticUint216.From

  export function create(value: StaticUint216.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint216.create(value)
    return ZeroHexStaticUint216.create(value)
  }

  export function from(value: StaticUint216.From) {
    return StaticUint216.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int216`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint216.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint216.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint216 {
  export type From = Bytes<27>
}

export class BytesStaticUint216 {
  readonly #class = BytesStaticUint216
  readonly name = this.#class.name

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint216.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint216(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint216(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint216.From) {
    return new BytesStaticUint216(value)
  }

  static from(value: BytesStaticUint216.From) {
    return BytesStaticUint216.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint216(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int216`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint216.nibbles

    const content = cursor.readOrThrow(BytesStaticUint216.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint216(value as Bytes<27>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint216.bytes

    const content = cursor.readOrThrow(BytesStaticUint216.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint216(value)
  }

}

export namespace ZeroHexStaticUint216 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint216 {
  readonly #class = ZeroHexStaticUint216
  readonly name = this.#class.name

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint216(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint216.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint216.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint216.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint216(value.slice(2))
  }

  static from(value: ZeroHexStaticUint216.From) {
    return ZeroHexStaticUint216.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int216`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint216(cursor.readOrThrow(ZeroHexStaticUint216.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint216.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint216.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint216(value)
  }

}

export type StaticUint224 =
  | ZeroHexStaticUint224
  | BytesStaticUint224

export namespace StaticUint224 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint224.From
    | BytesStaticUint224.From

  export function create(value: StaticUint224.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint224.create(value)
    return ZeroHexStaticUint224.create(value)
  }

  export function from(value: StaticUint224.From) {
    return StaticUint224.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int224`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint224.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint224.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint224 {
  export type From = Bytes<28>
}

export class BytesStaticUint224 {
  readonly #class = BytesStaticUint224
  readonly name = this.#class.name

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint224.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint224(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint224(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint224.From) {
    return new BytesStaticUint224(value)
  }

  static from(value: BytesStaticUint224.From) {
    return BytesStaticUint224.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint224(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int224`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint224.nibbles

    const content = cursor.readOrThrow(BytesStaticUint224.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint224(value as Bytes<28>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint224.bytes

    const content = cursor.readOrThrow(BytesStaticUint224.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint224(value)
  }

}

export namespace ZeroHexStaticUint224 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint224 {
  readonly #class = ZeroHexStaticUint224
  readonly name = this.#class.name

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint224(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint224.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint224.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint224.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint224(value.slice(2))
  }

  static from(value: ZeroHexStaticUint224.From) {
    return ZeroHexStaticUint224.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int224`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint224(cursor.readOrThrow(ZeroHexStaticUint224.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint224.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint224.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint224(value)
  }

}

export type StaticUint232 =
  | ZeroHexStaticUint232
  | BytesStaticUint232

export namespace StaticUint232 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint232.From
    | BytesStaticUint232.From

  export function create(value: StaticUint232.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint232.create(value)
    return ZeroHexStaticUint232.create(value)
  }

  export function from(value: StaticUint232.From) {
    return StaticUint232.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int232`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint232.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint232.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint232 {
  export type From = Bytes<29>
}

export class BytesStaticUint232 {
  readonly #class = BytesStaticUint232
  readonly name = this.#class.name

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint232.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint232(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint232(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint232.From) {
    return new BytesStaticUint232(value)
  }

  static from(value: BytesStaticUint232.From) {
    return BytesStaticUint232.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint232(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int232`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint232.nibbles

    const content = cursor.readOrThrow(BytesStaticUint232.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint232(value as Bytes<29>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint232.bytes

    const content = cursor.readOrThrow(BytesStaticUint232.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint232(value)
  }

}

export namespace ZeroHexStaticUint232 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint232 {
  readonly #class = ZeroHexStaticUint232
  readonly name = this.#class.name

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint232(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint232.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint232.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint232.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint232(value.slice(2))
  }

  static from(value: ZeroHexStaticUint232.From) {
    return ZeroHexStaticUint232.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int232`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint232(cursor.readOrThrow(ZeroHexStaticUint232.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint232.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint232.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint232(value)
  }

}

export type StaticUint240 =
  | ZeroHexStaticUint240
  | BytesStaticUint240

export namespace StaticUint240 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint240.From
    | BytesStaticUint240.From

  export function create(value: StaticUint240.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint240.create(value)
    return ZeroHexStaticUint240.create(value)
  }

  export function from(value: StaticUint240.From) {
    return StaticUint240.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int240`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint240.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint240.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint240 {
  export type From = Bytes<30>
}

export class BytesStaticUint240 {
  readonly #class = BytesStaticUint240
  readonly name = this.#class.name

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint240.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint240(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint240(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint240.From) {
    return new BytesStaticUint240(value)
  }

  static from(value: BytesStaticUint240.From) {
    return BytesStaticUint240.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint240(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int240`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint240.nibbles

    const content = cursor.readOrThrow(BytesStaticUint240.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint240(value as Bytes<30>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint240.bytes

    const content = cursor.readOrThrow(BytesStaticUint240.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint240(value)
  }

}

export namespace ZeroHexStaticUint240 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint240 {
  readonly #class = ZeroHexStaticUint240
  readonly name = this.#class.name

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint240(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint240.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint240.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint240.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint240(value.slice(2))
  }

  static from(value: ZeroHexStaticUint240.From) {
    return ZeroHexStaticUint240.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int240`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint240(cursor.readOrThrow(ZeroHexStaticUint240.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint240.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint240.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint240(value)
  }

}

export type StaticUint248 =
  | ZeroHexStaticUint248
  | BytesStaticUint248

export namespace StaticUint248 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint248.From
    | BytesStaticUint248.From

  export function create(value: StaticUint248.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint248.create(value)
    return ZeroHexStaticUint248.create(value)
  }

  export function from(value: StaticUint248.From) {
    return StaticUint248.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int248`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint248.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint248.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint248 {
  export type From = Bytes<31>
}

export class BytesStaticUint248 {
  readonly #class = BytesStaticUint248
  readonly name = this.#class.name

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint248.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint248(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint248(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint248.From) {
    return new BytesStaticUint248(value)
  }

  static from(value: BytesStaticUint248.From) {
    return BytesStaticUint248.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint248(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int248`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint248.nibbles

    const content = cursor.readOrThrow(BytesStaticUint248.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint248(value as Bytes<31>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint248.bytes

    const content = cursor.readOrThrow(BytesStaticUint248.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint248(value)
  }

}

export namespace ZeroHexStaticUint248 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint248 {
  readonly #class = ZeroHexStaticUint248
  readonly name = this.#class.name

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint248(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint248.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint248.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint248.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint248(value.slice(2))
  }

  static from(value: ZeroHexStaticUint248.From) {
    return ZeroHexStaticUint248.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int248`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint248(cursor.readOrThrow(ZeroHexStaticUint248.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint248.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint248.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint248(value)
  }

}

export type StaticUint256 =
  | ZeroHexStaticUint256
  | BytesStaticUint256

export namespace StaticUint256 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint256.From
    | BytesStaticUint256.From

  export function create(value: StaticUint256.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint256.create(value)
    return ZeroHexStaticUint256.create(value)
  }

  export function from(value: StaticUint256.From) {
    return StaticUint256.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int256`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint256.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint256.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint256 {
  export type From = Bytes<32>
}

export class BytesStaticUint256 {
  readonly #class = BytesStaticUint256
  readonly name = this.#class.name

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BytesStaticUint256.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint256(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint256(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint256.From) {
    return new BytesStaticUint256(value)
  }

  static from(value: BytesStaticUint256.From) {
    return BytesStaticUint256.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint256(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return `Cubane.Abi.Int256`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesStaticUint256.nibbles

    const content = cursor.readOrThrow(BytesStaticUint256.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint256(value as Bytes<32>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint256.bytes

    const content = cursor.readOrThrow(BytesStaticUint256.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint256(value)
  }

}

export namespace ZeroHexStaticUint256 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint256 {
  readonly #class = ZeroHexStaticUint256
  readonly name = this.#class.name

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint256(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint256.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint256.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint256.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint256(value.slice(2))
  }

  static from(value: ZeroHexStaticUint256.From) {
    return ZeroHexStaticUint256.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return `Cubane.Abi.Int256`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new ZeroHexStaticUint256(cursor.readOrThrow(ZeroHexStaticUint256.nibbles))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - ZeroHexStaticUint256.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint256.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint256(value)
  }

}

export type UintByName = {
    uint8: typeof StaticUint8,
    uint16: typeof StaticUint16,
    uint24: typeof StaticUint24,
    uint32: typeof StaticUint32,
    uint40: typeof StaticUint40,
    uint48: typeof StaticUint48,
    uint56: typeof StaticUint56,
    uint64: typeof StaticUint64,
    uint72: typeof StaticUint72,
    uint80: typeof StaticUint80,
    uint88: typeof StaticUint88,
    uint96: typeof StaticUint96,
    uint104: typeof StaticUint104,
    uint112: typeof StaticUint112,
    uint120: typeof StaticUint120,
    uint128: typeof StaticUint128,
    uint136: typeof StaticUint136,
    uint144: typeof StaticUint144,
    uint152: typeof StaticUint152,
    uint160: typeof StaticUint160,
    uint168: typeof StaticUint168,
    uint176: typeof StaticUint176,
    uint184: typeof StaticUint184,
    uint192: typeof StaticUint192,
    uint200: typeof StaticUint200,
    uint208: typeof StaticUint208,
    uint216: typeof StaticUint216,
    uint224: typeof StaticUint224,
    uint232: typeof StaticUint232,
    uint240: typeof StaticUint240,
    uint248: typeof StaticUint248,
    uint256: typeof StaticUint256,
  }
  
  export const uintByName: UintByName = {
    uint8: StaticUint8,
    uint16: StaticUint16,
    uint24: StaticUint24,
    uint32: StaticUint32,
    uint40: StaticUint40,
    uint48: StaticUint48,
    uint56: StaticUint56,
    uint64: StaticUint64,
    uint72: StaticUint72,
    uint80: StaticUint80,
    uint88: StaticUint88,
    uint96: StaticUint96,
    uint104: StaticUint104,
    uint112: StaticUint112,
    uint120: StaticUint120,
    uint128: StaticUint128,
    uint136: StaticUint136,
    uint144: StaticUint144,
    uint152: StaticUint152,
    uint160: StaticUint160,
    uint168: StaticUint168,
    uint176: StaticUint176,
    uint184: StaticUint184,
    uint192: StaticUint192,
    uint200: StaticUint200,
    uint208: StaticUint208,
    uint216: StaticUint216,
    uint224: StaticUint224,
    uint232: StaticUint232,
    uint240: StaticUint240,
    uint248: StaticUint248,
    uint256: StaticUint256,
  }