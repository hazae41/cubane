import { Cursor } from "@hazae41/cursor";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { Bytes } from "@hazae41/bytes";
import { Base16 } from "@hazae41/base16";
import { ZeroHexString } from "mods/types/zerohex/index.js";
import { RawHexString } from "mods/types/rawhex/index.js";
  
const BN_0 = 0n
const BN_1 = 1n

export type StaticInt8 =
  | ZeroHexStaticInt8
  | BytesStaticInt8

export namespace StaticInt8 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt8.From
    | BytesStaticInt8.From

  export function create(value: StaticInt8.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt8.create(value)
    return ZeroHexStaticInt8.create(value)
  }

  export function from(value: StaticInt8.From) {
    return StaticInt8.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int8`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt8.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt8.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt8 {
  export type From = Bytes<1>
}

export class BytesStaticInt8 {
  readonly #class = BytesStaticInt8
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
    readonly value: BytesStaticInt8.From
  ) { }

  static create(value: BytesStaticInt8.From) {
    return new BytesStaticInt8(value)
  }

  static from(value: BytesStaticInt8.From) {
    return BytesStaticInt8.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt8(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt8.nibbles

    const content = cursor.readOrThrow(BytesStaticInt8.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt8(value as Bytes<1>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt8.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt8.bytes

    const content = cursor.readOrThrow(BytesStaticInt8.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt8(value)
  }

}

export namespace ZeroHexStaticInt8 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt8 {
  readonly #class = ZeroHexStaticInt8
  readonly name = this.#class.name

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly bitsn = BigInt(8)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt8.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt8(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt8(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt8.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt8.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt8.fromNumber(value)
    return new ZeroHexStaticInt8(value.slice(2))
  }

  static from(value: ZeroHexStaticInt8.From) {
    return ZeroHexStaticInt8.create(value)
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
    return new ZeroHexStaticInt8(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt8.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt8.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt8(value)
  }

}

export type StaticInt16 =
  | ZeroHexStaticInt16
  | BytesStaticInt16

export namespace StaticInt16 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt16.From
    | BytesStaticInt16.From

  export function create(value: StaticInt16.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt16.create(value)
    return ZeroHexStaticInt16.create(value)
  }

  export function from(value: StaticInt16.From) {
    return StaticInt16.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int16`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt16.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt16.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt16 {
  export type From = Bytes<2>
}

export class BytesStaticInt16 {
  readonly #class = BytesStaticInt16
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
    readonly value: BytesStaticInt16.From
  ) { }

  static create(value: BytesStaticInt16.From) {
    return new BytesStaticInt16(value)
  }

  static from(value: BytesStaticInt16.From) {
    return BytesStaticInt16.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt16(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt16.nibbles

    const content = cursor.readOrThrow(BytesStaticInt16.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt16(value as Bytes<2>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt16.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt16.bytes

    const content = cursor.readOrThrow(BytesStaticInt16.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt16(value)
  }

}

export namespace ZeroHexStaticInt16 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt16 {
  readonly #class = ZeroHexStaticInt16
  readonly name = this.#class.name

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly bitsn = BigInt(16)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt16.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt16(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt16(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt16.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt16.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt16.fromNumber(value)
    return new ZeroHexStaticInt16(value.slice(2))
  }

  static from(value: ZeroHexStaticInt16.From) {
    return ZeroHexStaticInt16.create(value)
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
    return new ZeroHexStaticInt16(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt16.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt16.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt16(value)
  }

}

export type StaticInt24 =
  | ZeroHexStaticInt24
  | BytesStaticInt24

export namespace StaticInt24 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt24.From
    | BytesStaticInt24.From

  export function create(value: StaticInt24.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt24.create(value)
    return ZeroHexStaticInt24.create(value)
  }

  export function from(value: StaticInt24.From) {
    return StaticInt24.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int24`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt24.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt24.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt24 {
  export type From = Bytes<3>
}

export class BytesStaticInt24 {
  readonly #class = BytesStaticInt24
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
    readonly value: BytesStaticInt24.From
  ) { }

  static create(value: BytesStaticInt24.From) {
    return new BytesStaticInt24(value)
  }

  static from(value: BytesStaticInt24.From) {
    return BytesStaticInt24.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt24(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt24.nibbles

    const content = cursor.readOrThrow(BytesStaticInt24.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt24(value as Bytes<3>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt24.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt24.bytes

    const content = cursor.readOrThrow(BytesStaticInt24.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt24(value)
  }

}

export namespace ZeroHexStaticInt24 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt24 {
  readonly #class = ZeroHexStaticInt24
  readonly name = this.#class.name

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly bitsn = BigInt(24)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt24.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt24(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt24(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt24.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt24.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt24.fromNumber(value)
    return new ZeroHexStaticInt24(value.slice(2))
  }

  static from(value: ZeroHexStaticInt24.From) {
    return ZeroHexStaticInt24.create(value)
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
    return new ZeroHexStaticInt24(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt24.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt24.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt24(value)
  }

}

export type StaticInt32 =
  | ZeroHexStaticInt32
  | BytesStaticInt32

export namespace StaticInt32 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt32.From
    | BytesStaticInt32.From

  export function create(value: StaticInt32.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt32.create(value)
    return ZeroHexStaticInt32.create(value)
  }

  export function from(value: StaticInt32.From) {
    return StaticInt32.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int32`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt32.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt32.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt32 {
  export type From = Bytes<4>
}

export class BytesStaticInt32 {
  readonly #class = BytesStaticInt32
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
    readonly value: BytesStaticInt32.From
  ) { }

  static create(value: BytesStaticInt32.From) {
    return new BytesStaticInt32(value)
  }

  static from(value: BytesStaticInt32.From) {
    return BytesStaticInt32.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt32(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt32.nibbles

    const content = cursor.readOrThrow(BytesStaticInt32.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt32(value as Bytes<4>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt32.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt32.bytes

    const content = cursor.readOrThrow(BytesStaticInt32.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt32(value)
  }

}

export namespace ZeroHexStaticInt32 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt32 {
  readonly #class = ZeroHexStaticInt32
  readonly name = this.#class.name

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly bitsn = BigInt(32)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt32.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt32(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt32(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt32.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt32.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt32.fromNumber(value)
    return new ZeroHexStaticInt32(value.slice(2))
  }

  static from(value: ZeroHexStaticInt32.From) {
    return ZeroHexStaticInt32.create(value)
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
    return new ZeroHexStaticInt32(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt32.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt32.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt32(value)
  }

}

export type StaticInt40 =
  | ZeroHexStaticInt40
  | BytesStaticInt40

export namespace StaticInt40 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt40.From
    | BytesStaticInt40.From

  export function create(value: StaticInt40.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt40.create(value)
    return ZeroHexStaticInt40.create(value)
  }

  export function from(value: StaticInt40.From) {
    return StaticInt40.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int40`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt40.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt40.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt40 {
  export type From = Bytes<5>
}

export class BytesStaticInt40 {
  readonly #class = BytesStaticInt40
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
    readonly value: BytesStaticInt40.From
  ) { }

  static create(value: BytesStaticInt40.From) {
    return new BytesStaticInt40(value)
  }

  static from(value: BytesStaticInt40.From) {
    return BytesStaticInt40.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt40(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt40.nibbles

    const content = cursor.readOrThrow(BytesStaticInt40.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt40(value as Bytes<5>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt40.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt40.bytes

    const content = cursor.readOrThrow(BytesStaticInt40.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt40(value)
  }

}

export namespace ZeroHexStaticInt40 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt40 {
  readonly #class = ZeroHexStaticInt40
  readonly name = this.#class.name

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly bitsn = BigInt(40)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt40.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt40(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt40(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt40.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt40.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt40.fromNumber(value)
    return new ZeroHexStaticInt40(value.slice(2))
  }

  static from(value: ZeroHexStaticInt40.From) {
    return ZeroHexStaticInt40.create(value)
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
    return new ZeroHexStaticInt40(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt40.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt40.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt40(value)
  }

}

export type StaticInt48 =
  | ZeroHexStaticInt48
  | BytesStaticInt48

export namespace StaticInt48 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt48.From
    | BytesStaticInt48.From

  export function create(value: StaticInt48.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt48.create(value)
    return ZeroHexStaticInt48.create(value)
  }

  export function from(value: StaticInt48.From) {
    return StaticInt48.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int48`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt48.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt48.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt48 {
  export type From = Bytes<6>
}

export class BytesStaticInt48 {
  readonly #class = BytesStaticInt48
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
    readonly value: BytesStaticInt48.From
  ) { }

  static create(value: BytesStaticInt48.From) {
    return new BytesStaticInt48(value)
  }

  static from(value: BytesStaticInt48.From) {
    return BytesStaticInt48.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt48(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt48.nibbles

    const content = cursor.readOrThrow(BytesStaticInt48.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt48(value as Bytes<6>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt48.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt48.bytes

    const content = cursor.readOrThrow(BytesStaticInt48.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt48(value)
  }

}

export namespace ZeroHexStaticInt48 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt48 {
  readonly #class = ZeroHexStaticInt48
  readonly name = this.#class.name

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly bitsn = BigInt(48)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt48.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt48(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt48(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt48.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt48.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt48.fromNumber(value)
    return new ZeroHexStaticInt48(value.slice(2))
  }

  static from(value: ZeroHexStaticInt48.From) {
    return ZeroHexStaticInt48.create(value)
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
    return new ZeroHexStaticInt48(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt48.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt48.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt48(value)
  }

}

export type StaticInt56 =
  | ZeroHexStaticInt56
  | BytesStaticInt56

export namespace StaticInt56 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt56.From
    | BytesStaticInt56.From

  export function create(value: StaticInt56.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt56.create(value)
    return ZeroHexStaticInt56.create(value)
  }

  export function from(value: StaticInt56.From) {
    return StaticInt56.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int56`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt56.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt56.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt56 {
  export type From = Bytes<7>
}

export class BytesStaticInt56 {
  readonly #class = BytesStaticInt56
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
    readonly value: BytesStaticInt56.From
  ) { }

  static create(value: BytesStaticInt56.From) {
    return new BytesStaticInt56(value)
  }

  static from(value: BytesStaticInt56.From) {
    return BytesStaticInt56.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt56(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt56.nibbles

    const content = cursor.readOrThrow(BytesStaticInt56.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt56(value as Bytes<7>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt56.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt56.bytes

    const content = cursor.readOrThrow(BytesStaticInt56.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt56(value)
  }

}

export namespace ZeroHexStaticInt56 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt56 {
  readonly #class = ZeroHexStaticInt56
  readonly name = this.#class.name

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly bitsn = BigInt(56)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt56.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt56(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt56(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt56.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt56.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt56.fromNumber(value)
    return new ZeroHexStaticInt56(value.slice(2))
  }

  static from(value: ZeroHexStaticInt56.From) {
    return ZeroHexStaticInt56.create(value)
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
    return new ZeroHexStaticInt56(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt56.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt56.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt56(value)
  }

}

export type StaticInt64 =
  | ZeroHexStaticInt64
  | BytesStaticInt64

export namespace StaticInt64 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt64.From
    | BytesStaticInt64.From

  export function create(value: StaticInt64.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt64.create(value)
    return ZeroHexStaticInt64.create(value)
  }

  export function from(value: StaticInt64.From) {
    return StaticInt64.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int64`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt64.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt64.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt64 {
  export type From = Bytes<8>
}

export class BytesStaticInt64 {
  readonly #class = BytesStaticInt64
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
    readonly value: BytesStaticInt64.From
  ) { }

  static create(value: BytesStaticInt64.From) {
    return new BytesStaticInt64(value)
  }

  static from(value: BytesStaticInt64.From) {
    return BytesStaticInt64.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt64(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt64.nibbles

    const content = cursor.readOrThrow(BytesStaticInt64.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt64(value as Bytes<8>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt64.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt64.bytes

    const content = cursor.readOrThrow(BytesStaticInt64.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt64(value)
  }

}

export namespace ZeroHexStaticInt64 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt64 {
  readonly #class = ZeroHexStaticInt64
  readonly name = this.#class.name

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly bitsn = BigInt(64)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt64.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt64(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt64(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt64.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt64.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt64.fromNumber(value)
    return new ZeroHexStaticInt64(value.slice(2))
  }

  static from(value: ZeroHexStaticInt64.From) {
    return ZeroHexStaticInt64.create(value)
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
    return new ZeroHexStaticInt64(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt64.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt64.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt64(value)
  }

}

export type StaticInt72 =
  | ZeroHexStaticInt72
  | BytesStaticInt72

export namespace StaticInt72 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt72.From
    | BytesStaticInt72.From

  export function create(value: StaticInt72.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt72.create(value)
    return ZeroHexStaticInt72.create(value)
  }

  export function from(value: StaticInt72.From) {
    return StaticInt72.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int72`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt72.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt72.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt72 {
  export type From = Bytes<9>
}

export class BytesStaticInt72 {
  readonly #class = BytesStaticInt72
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
    readonly value: BytesStaticInt72.From
  ) { }

  static create(value: BytesStaticInt72.From) {
    return new BytesStaticInt72(value)
  }

  static from(value: BytesStaticInt72.From) {
    return BytesStaticInt72.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt72(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt72.nibbles

    const content = cursor.readOrThrow(BytesStaticInt72.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt72(value as Bytes<9>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt72.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt72.bytes

    const content = cursor.readOrThrow(BytesStaticInt72.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt72(value)
  }

}

export namespace ZeroHexStaticInt72 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt72 {
  readonly #class = ZeroHexStaticInt72
  readonly name = this.#class.name

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly bitsn = BigInt(72)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt72.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt72(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt72(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt72.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt72.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt72.fromNumber(value)
    return new ZeroHexStaticInt72(value.slice(2))
  }

  static from(value: ZeroHexStaticInt72.From) {
    return ZeroHexStaticInt72.create(value)
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
    return new ZeroHexStaticInt72(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt72.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt72.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt72(value)
  }

}

export type StaticInt80 =
  | ZeroHexStaticInt80
  | BytesStaticInt80

export namespace StaticInt80 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt80.From
    | BytesStaticInt80.From

  export function create(value: StaticInt80.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt80.create(value)
    return ZeroHexStaticInt80.create(value)
  }

  export function from(value: StaticInt80.From) {
    return StaticInt80.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int80`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt80.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt80.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt80 {
  export type From = Bytes<10>
}

export class BytesStaticInt80 {
  readonly #class = BytesStaticInt80
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
    readonly value: BytesStaticInt80.From
  ) { }

  static create(value: BytesStaticInt80.From) {
    return new BytesStaticInt80(value)
  }

  static from(value: BytesStaticInt80.From) {
    return BytesStaticInt80.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt80(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt80.nibbles

    const content = cursor.readOrThrow(BytesStaticInt80.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt80(value as Bytes<10>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt80.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt80.bytes

    const content = cursor.readOrThrow(BytesStaticInt80.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt80(value)
  }

}

export namespace ZeroHexStaticInt80 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt80 {
  readonly #class = ZeroHexStaticInt80
  readonly name = this.#class.name

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly bitsn = BigInt(80)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt80.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt80(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt80(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt80.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt80.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt80.fromNumber(value)
    return new ZeroHexStaticInt80(value.slice(2))
  }

  static from(value: ZeroHexStaticInt80.From) {
    return ZeroHexStaticInt80.create(value)
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
    return new ZeroHexStaticInt80(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt80.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt80.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt80(value)
  }

}

export type StaticInt88 =
  | ZeroHexStaticInt88
  | BytesStaticInt88

export namespace StaticInt88 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt88.From
    | BytesStaticInt88.From

  export function create(value: StaticInt88.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt88.create(value)
    return ZeroHexStaticInt88.create(value)
  }

  export function from(value: StaticInt88.From) {
    return StaticInt88.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int88`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt88.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt88.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt88 {
  export type From = Bytes<11>
}

export class BytesStaticInt88 {
  readonly #class = BytesStaticInt88
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
    readonly value: BytesStaticInt88.From
  ) { }

  static create(value: BytesStaticInt88.From) {
    return new BytesStaticInt88(value)
  }

  static from(value: BytesStaticInt88.From) {
    return BytesStaticInt88.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt88(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt88.nibbles

    const content = cursor.readOrThrow(BytesStaticInt88.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt88(value as Bytes<11>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt88.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt88.bytes

    const content = cursor.readOrThrow(BytesStaticInt88.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt88(value)
  }

}

export namespace ZeroHexStaticInt88 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt88 {
  readonly #class = ZeroHexStaticInt88
  readonly name = this.#class.name

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly bitsn = BigInt(88)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt88.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt88(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt88(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt88.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt88.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt88.fromNumber(value)
    return new ZeroHexStaticInt88(value.slice(2))
  }

  static from(value: ZeroHexStaticInt88.From) {
    return ZeroHexStaticInt88.create(value)
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
    return new ZeroHexStaticInt88(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt88.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt88.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt88(value)
  }

}

export type StaticInt96 =
  | ZeroHexStaticInt96
  | BytesStaticInt96

export namespace StaticInt96 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt96.From
    | BytesStaticInt96.From

  export function create(value: StaticInt96.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt96.create(value)
    return ZeroHexStaticInt96.create(value)
  }

  export function from(value: StaticInt96.From) {
    return StaticInt96.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int96`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt96.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt96.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt96 {
  export type From = Bytes<12>
}

export class BytesStaticInt96 {
  readonly #class = BytesStaticInt96
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
    readonly value: BytesStaticInt96.From
  ) { }

  static create(value: BytesStaticInt96.From) {
    return new BytesStaticInt96(value)
  }

  static from(value: BytesStaticInt96.From) {
    return BytesStaticInt96.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt96(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt96.nibbles

    const content = cursor.readOrThrow(BytesStaticInt96.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt96(value as Bytes<12>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt96.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt96.bytes

    const content = cursor.readOrThrow(BytesStaticInt96.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt96(value)
  }

}

export namespace ZeroHexStaticInt96 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt96 {
  readonly #class = ZeroHexStaticInt96
  readonly name = this.#class.name

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly bitsn = BigInt(96)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt96.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt96(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt96(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt96.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt96.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt96.fromNumber(value)
    return new ZeroHexStaticInt96(value.slice(2))
  }

  static from(value: ZeroHexStaticInt96.From) {
    return ZeroHexStaticInt96.create(value)
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
    return new ZeroHexStaticInt96(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt96.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt96.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt96(value)
  }

}

export type StaticInt104 =
  | ZeroHexStaticInt104
  | BytesStaticInt104

export namespace StaticInt104 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt104.From
    | BytesStaticInt104.From

  export function create(value: StaticInt104.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt104.create(value)
    return ZeroHexStaticInt104.create(value)
  }

  export function from(value: StaticInt104.From) {
    return StaticInt104.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int104`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt104.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt104.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt104 {
  export type From = Bytes<13>
}

export class BytesStaticInt104 {
  readonly #class = BytesStaticInt104
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
    readonly value: BytesStaticInt104.From
  ) { }

  static create(value: BytesStaticInt104.From) {
    return new BytesStaticInt104(value)
  }

  static from(value: BytesStaticInt104.From) {
    return BytesStaticInt104.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt104(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt104.nibbles

    const content = cursor.readOrThrow(BytesStaticInt104.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt104(value as Bytes<13>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt104.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt104.bytes

    const content = cursor.readOrThrow(BytesStaticInt104.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt104(value)
  }

}

export namespace ZeroHexStaticInt104 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt104 {
  readonly #class = ZeroHexStaticInt104
  readonly name = this.#class.name

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly bitsn = BigInt(104)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt104.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt104(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt104(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt104.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt104.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt104.fromNumber(value)
    return new ZeroHexStaticInt104(value.slice(2))
  }

  static from(value: ZeroHexStaticInt104.From) {
    return ZeroHexStaticInt104.create(value)
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
    return new ZeroHexStaticInt104(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt104.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt104.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt104(value)
  }

}

export type StaticInt112 =
  | ZeroHexStaticInt112
  | BytesStaticInt112

export namespace StaticInt112 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt112.From
    | BytesStaticInt112.From

  export function create(value: StaticInt112.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt112.create(value)
    return ZeroHexStaticInt112.create(value)
  }

  export function from(value: StaticInt112.From) {
    return StaticInt112.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int112`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt112.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt112.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt112 {
  export type From = Bytes<14>
}

export class BytesStaticInt112 {
  readonly #class = BytesStaticInt112
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
    readonly value: BytesStaticInt112.From
  ) { }

  static create(value: BytesStaticInt112.From) {
    return new BytesStaticInt112(value)
  }

  static from(value: BytesStaticInt112.From) {
    return BytesStaticInt112.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt112(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt112.nibbles

    const content = cursor.readOrThrow(BytesStaticInt112.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt112(value as Bytes<14>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt112.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt112.bytes

    const content = cursor.readOrThrow(BytesStaticInt112.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt112(value)
  }

}

export namespace ZeroHexStaticInt112 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt112 {
  readonly #class = ZeroHexStaticInt112
  readonly name = this.#class.name

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly bitsn = BigInt(112)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt112.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt112(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt112(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt112.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt112.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt112.fromNumber(value)
    return new ZeroHexStaticInt112(value.slice(2))
  }

  static from(value: ZeroHexStaticInt112.From) {
    return ZeroHexStaticInt112.create(value)
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
    return new ZeroHexStaticInt112(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt112.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt112.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt112(value)
  }

}

export type StaticInt120 =
  | ZeroHexStaticInt120
  | BytesStaticInt120

export namespace StaticInt120 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt120.From
    | BytesStaticInt120.From

  export function create(value: StaticInt120.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt120.create(value)
    return ZeroHexStaticInt120.create(value)
  }

  export function from(value: StaticInt120.From) {
    return StaticInt120.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int120`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt120.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt120.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt120 {
  export type From = Bytes<15>
}

export class BytesStaticInt120 {
  readonly #class = BytesStaticInt120
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
    readonly value: BytesStaticInt120.From
  ) { }

  static create(value: BytesStaticInt120.From) {
    return new BytesStaticInt120(value)
  }

  static from(value: BytesStaticInt120.From) {
    return BytesStaticInt120.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt120(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt120.nibbles

    const content = cursor.readOrThrow(BytesStaticInt120.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt120(value as Bytes<15>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt120.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt120.bytes

    const content = cursor.readOrThrow(BytesStaticInt120.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt120(value)
  }

}

export namespace ZeroHexStaticInt120 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt120 {
  readonly #class = ZeroHexStaticInt120
  readonly name = this.#class.name

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly bitsn = BigInt(120)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt120.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt120(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt120(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt120.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt120.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt120.fromNumber(value)
    return new ZeroHexStaticInt120(value.slice(2))
  }

  static from(value: ZeroHexStaticInt120.From) {
    return ZeroHexStaticInt120.create(value)
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
    return new ZeroHexStaticInt120(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt120.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt120.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt120(value)
  }

}

export type StaticInt128 =
  | ZeroHexStaticInt128
  | BytesStaticInt128

export namespace StaticInt128 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt128.From
    | BytesStaticInt128.From

  export function create(value: StaticInt128.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt128.create(value)
    return ZeroHexStaticInt128.create(value)
  }

  export function from(value: StaticInt128.From) {
    return StaticInt128.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int128`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt128.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt128.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt128 {
  export type From = Bytes<16>
}

export class BytesStaticInt128 {
  readonly #class = BytesStaticInt128
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
    readonly value: BytesStaticInt128.From
  ) { }

  static create(value: BytesStaticInt128.From) {
    return new BytesStaticInt128(value)
  }

  static from(value: BytesStaticInt128.From) {
    return BytesStaticInt128.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt128(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt128.nibbles

    const content = cursor.readOrThrow(BytesStaticInt128.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt128(value as Bytes<16>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt128.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt128.bytes

    const content = cursor.readOrThrow(BytesStaticInt128.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt128(value)
  }

}

export namespace ZeroHexStaticInt128 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt128 {
  readonly #class = ZeroHexStaticInt128
  readonly name = this.#class.name

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly bitsn = BigInt(128)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt128.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt128(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt128(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt128.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt128.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt128.fromNumber(value)
    return new ZeroHexStaticInt128(value.slice(2))
  }

  static from(value: ZeroHexStaticInt128.From) {
    return ZeroHexStaticInt128.create(value)
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
    return new ZeroHexStaticInt128(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt128.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt128.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt128(value)
  }

}

export type StaticInt136 =
  | ZeroHexStaticInt136
  | BytesStaticInt136

export namespace StaticInt136 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt136.From
    | BytesStaticInt136.From

  export function create(value: StaticInt136.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt136.create(value)
    return ZeroHexStaticInt136.create(value)
  }

  export function from(value: StaticInt136.From) {
    return StaticInt136.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int136`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt136.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt136.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt136 {
  export type From = Bytes<17>
}

export class BytesStaticInt136 {
  readonly #class = BytesStaticInt136
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
    readonly value: BytesStaticInt136.From
  ) { }

  static create(value: BytesStaticInt136.From) {
    return new BytesStaticInt136(value)
  }

  static from(value: BytesStaticInt136.From) {
    return BytesStaticInt136.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt136(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt136.nibbles

    const content = cursor.readOrThrow(BytesStaticInt136.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt136(value as Bytes<17>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt136.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt136.bytes

    const content = cursor.readOrThrow(BytesStaticInt136.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt136(value)
  }

}

export namespace ZeroHexStaticInt136 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt136 {
  readonly #class = ZeroHexStaticInt136
  readonly name = this.#class.name

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly bitsn = BigInt(136)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt136.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt136(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt136(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt136.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt136.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt136.fromNumber(value)
    return new ZeroHexStaticInt136(value.slice(2))
  }

  static from(value: ZeroHexStaticInt136.From) {
    return ZeroHexStaticInt136.create(value)
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
    return new ZeroHexStaticInt136(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt136.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt136.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt136(value)
  }

}

export type StaticInt144 =
  | ZeroHexStaticInt144
  | BytesStaticInt144

export namespace StaticInt144 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt144.From
    | BytesStaticInt144.From

  export function create(value: StaticInt144.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt144.create(value)
    return ZeroHexStaticInt144.create(value)
  }

  export function from(value: StaticInt144.From) {
    return StaticInt144.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int144`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt144.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt144.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt144 {
  export type From = Bytes<18>
}

export class BytesStaticInt144 {
  readonly #class = BytesStaticInt144
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
    readonly value: BytesStaticInt144.From
  ) { }

  static create(value: BytesStaticInt144.From) {
    return new BytesStaticInt144(value)
  }

  static from(value: BytesStaticInt144.From) {
    return BytesStaticInt144.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt144(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt144.nibbles

    const content = cursor.readOrThrow(BytesStaticInt144.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt144(value as Bytes<18>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt144.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt144.bytes

    const content = cursor.readOrThrow(BytesStaticInt144.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt144(value)
  }

}

export namespace ZeroHexStaticInt144 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt144 {
  readonly #class = ZeroHexStaticInt144
  readonly name = this.#class.name

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly bitsn = BigInt(144)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt144.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt144(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt144(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt144.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt144.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt144.fromNumber(value)
    return new ZeroHexStaticInt144(value.slice(2))
  }

  static from(value: ZeroHexStaticInt144.From) {
    return ZeroHexStaticInt144.create(value)
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
    return new ZeroHexStaticInt144(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt144.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt144.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt144(value)
  }

}

export type StaticInt152 =
  | ZeroHexStaticInt152
  | BytesStaticInt152

export namespace StaticInt152 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt152.From
    | BytesStaticInt152.From

  export function create(value: StaticInt152.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt152.create(value)
    return ZeroHexStaticInt152.create(value)
  }

  export function from(value: StaticInt152.From) {
    return StaticInt152.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int152`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt152.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt152.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt152 {
  export type From = Bytes<19>
}

export class BytesStaticInt152 {
  readonly #class = BytesStaticInt152
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
    readonly value: BytesStaticInt152.From
  ) { }

  static create(value: BytesStaticInt152.From) {
    return new BytesStaticInt152(value)
  }

  static from(value: BytesStaticInt152.From) {
    return BytesStaticInt152.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt152(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt152.nibbles

    const content = cursor.readOrThrow(BytesStaticInt152.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt152(value as Bytes<19>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt152.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt152.bytes

    const content = cursor.readOrThrow(BytesStaticInt152.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt152(value)
  }

}

export namespace ZeroHexStaticInt152 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt152 {
  readonly #class = ZeroHexStaticInt152
  readonly name = this.#class.name

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly bitsn = BigInt(152)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt152.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt152(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt152(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt152.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt152.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt152.fromNumber(value)
    return new ZeroHexStaticInt152(value.slice(2))
  }

  static from(value: ZeroHexStaticInt152.From) {
    return ZeroHexStaticInt152.create(value)
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
    return new ZeroHexStaticInt152(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt152.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt152.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt152(value)
  }

}

export type StaticInt160 =
  | ZeroHexStaticInt160
  | BytesStaticInt160

export namespace StaticInt160 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt160.From
    | BytesStaticInt160.From

  export function create(value: StaticInt160.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt160.create(value)
    return ZeroHexStaticInt160.create(value)
  }

  export function from(value: StaticInt160.From) {
    return StaticInt160.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int160`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt160.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt160.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt160 {
  export type From = Bytes<20>
}

export class BytesStaticInt160 {
  readonly #class = BytesStaticInt160
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
    readonly value: BytesStaticInt160.From
  ) { }

  static create(value: BytesStaticInt160.From) {
    return new BytesStaticInt160(value)
  }

  static from(value: BytesStaticInt160.From) {
    return BytesStaticInt160.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt160(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt160.nibbles

    const content = cursor.readOrThrow(BytesStaticInt160.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt160(value as Bytes<20>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt160.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt160.bytes

    const content = cursor.readOrThrow(BytesStaticInt160.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt160(value)
  }

}

export namespace ZeroHexStaticInt160 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt160 {
  readonly #class = ZeroHexStaticInt160
  readonly name = this.#class.name

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly bitsn = BigInt(160)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt160.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt160(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt160(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt160.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt160.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt160.fromNumber(value)
    return new ZeroHexStaticInt160(value.slice(2))
  }

  static from(value: ZeroHexStaticInt160.From) {
    return ZeroHexStaticInt160.create(value)
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
    return new ZeroHexStaticInt160(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt160.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt160.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt160(value)
  }

}

export type StaticInt168 =
  | ZeroHexStaticInt168
  | BytesStaticInt168

export namespace StaticInt168 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt168.From
    | BytesStaticInt168.From

  export function create(value: StaticInt168.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt168.create(value)
    return ZeroHexStaticInt168.create(value)
  }

  export function from(value: StaticInt168.From) {
    return StaticInt168.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int168`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt168.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt168.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt168 {
  export type From = Bytes<21>
}

export class BytesStaticInt168 {
  readonly #class = BytesStaticInt168
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
    readonly value: BytesStaticInt168.From
  ) { }

  static create(value: BytesStaticInt168.From) {
    return new BytesStaticInt168(value)
  }

  static from(value: BytesStaticInt168.From) {
    return BytesStaticInt168.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt168(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt168.nibbles

    const content = cursor.readOrThrow(BytesStaticInt168.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt168(value as Bytes<21>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt168.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt168.bytes

    const content = cursor.readOrThrow(BytesStaticInt168.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt168(value)
  }

}

export namespace ZeroHexStaticInt168 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt168 {
  readonly #class = ZeroHexStaticInt168
  readonly name = this.#class.name

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly bitsn = BigInt(168)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt168.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt168(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt168(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt168.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt168.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt168.fromNumber(value)
    return new ZeroHexStaticInt168(value.slice(2))
  }

  static from(value: ZeroHexStaticInt168.From) {
    return ZeroHexStaticInt168.create(value)
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
    return new ZeroHexStaticInt168(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt168.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt168.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt168(value)
  }

}

export type StaticInt176 =
  | ZeroHexStaticInt176
  | BytesStaticInt176

export namespace StaticInt176 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt176.From
    | BytesStaticInt176.From

  export function create(value: StaticInt176.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt176.create(value)
    return ZeroHexStaticInt176.create(value)
  }

  export function from(value: StaticInt176.From) {
    return StaticInt176.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int176`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt176.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt176.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt176 {
  export type From = Bytes<22>
}

export class BytesStaticInt176 {
  readonly #class = BytesStaticInt176
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
    readonly value: BytesStaticInt176.From
  ) { }

  static create(value: BytesStaticInt176.From) {
    return new BytesStaticInt176(value)
  }

  static from(value: BytesStaticInt176.From) {
    return BytesStaticInt176.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt176(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt176.nibbles

    const content = cursor.readOrThrow(BytesStaticInt176.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt176(value as Bytes<22>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt176.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt176.bytes

    const content = cursor.readOrThrow(BytesStaticInt176.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt176(value)
  }

}

export namespace ZeroHexStaticInt176 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt176 {
  readonly #class = ZeroHexStaticInt176
  readonly name = this.#class.name

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly bitsn = BigInt(176)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt176.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt176(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt176(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt176.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt176.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt176.fromNumber(value)
    return new ZeroHexStaticInt176(value.slice(2))
  }

  static from(value: ZeroHexStaticInt176.From) {
    return ZeroHexStaticInt176.create(value)
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
    return new ZeroHexStaticInt176(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt176.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt176.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt176(value)
  }

}

export type StaticInt184 =
  | ZeroHexStaticInt184
  | BytesStaticInt184

export namespace StaticInt184 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt184.From
    | BytesStaticInt184.From

  export function create(value: StaticInt184.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt184.create(value)
    return ZeroHexStaticInt184.create(value)
  }

  export function from(value: StaticInt184.From) {
    return StaticInt184.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int184`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt184.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt184.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt184 {
  export type From = Bytes<23>
}

export class BytesStaticInt184 {
  readonly #class = BytesStaticInt184
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
    readonly value: BytesStaticInt184.From
  ) { }

  static create(value: BytesStaticInt184.From) {
    return new BytesStaticInt184(value)
  }

  static from(value: BytesStaticInt184.From) {
    return BytesStaticInt184.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt184(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt184.nibbles

    const content = cursor.readOrThrow(BytesStaticInt184.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt184(value as Bytes<23>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt184.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt184.bytes

    const content = cursor.readOrThrow(BytesStaticInt184.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt184(value)
  }

}

export namespace ZeroHexStaticInt184 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt184 {
  readonly #class = ZeroHexStaticInt184
  readonly name = this.#class.name

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly bitsn = BigInt(184)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt184.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt184(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt184(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt184.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt184.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt184.fromNumber(value)
    return new ZeroHexStaticInt184(value.slice(2))
  }

  static from(value: ZeroHexStaticInt184.From) {
    return ZeroHexStaticInt184.create(value)
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
    return new ZeroHexStaticInt184(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt184.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt184.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt184(value)
  }

}

export type StaticInt192 =
  | ZeroHexStaticInt192
  | BytesStaticInt192

export namespace StaticInt192 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt192.From
    | BytesStaticInt192.From

  export function create(value: StaticInt192.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt192.create(value)
    return ZeroHexStaticInt192.create(value)
  }

  export function from(value: StaticInt192.From) {
    return StaticInt192.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int192`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt192.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt192.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt192 {
  export type From = Bytes<24>
}

export class BytesStaticInt192 {
  readonly #class = BytesStaticInt192
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
    readonly value: BytesStaticInt192.From
  ) { }

  static create(value: BytesStaticInt192.From) {
    return new BytesStaticInt192(value)
  }

  static from(value: BytesStaticInt192.From) {
    return BytesStaticInt192.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt192(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt192.nibbles

    const content = cursor.readOrThrow(BytesStaticInt192.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt192(value as Bytes<24>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt192.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt192.bytes

    const content = cursor.readOrThrow(BytesStaticInt192.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt192(value)
  }

}

export namespace ZeroHexStaticInt192 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt192 {
  readonly #class = ZeroHexStaticInt192
  readonly name = this.#class.name

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly bitsn = BigInt(192)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt192.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt192(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt192(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt192.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt192.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt192.fromNumber(value)
    return new ZeroHexStaticInt192(value.slice(2))
  }

  static from(value: ZeroHexStaticInt192.From) {
    return ZeroHexStaticInt192.create(value)
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
    return new ZeroHexStaticInt192(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt192.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt192.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt192(value)
  }

}

export type StaticInt200 =
  | ZeroHexStaticInt200
  | BytesStaticInt200

export namespace StaticInt200 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt200.From
    | BytesStaticInt200.From

  export function create(value: StaticInt200.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt200.create(value)
    return ZeroHexStaticInt200.create(value)
  }

  export function from(value: StaticInt200.From) {
    return StaticInt200.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int200`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt200.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt200.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt200 {
  export type From = Bytes<25>
}

export class BytesStaticInt200 {
  readonly #class = BytesStaticInt200
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
    readonly value: BytesStaticInt200.From
  ) { }

  static create(value: BytesStaticInt200.From) {
    return new BytesStaticInt200(value)
  }

  static from(value: BytesStaticInt200.From) {
    return BytesStaticInt200.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt200(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt200.nibbles

    const content = cursor.readOrThrow(BytesStaticInt200.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt200(value as Bytes<25>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt200.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt200.bytes

    const content = cursor.readOrThrow(BytesStaticInt200.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt200(value)
  }

}

export namespace ZeroHexStaticInt200 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt200 {
  readonly #class = ZeroHexStaticInt200
  readonly name = this.#class.name

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly bitsn = BigInt(200)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt200.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt200(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt200(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt200.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt200.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt200.fromNumber(value)
    return new ZeroHexStaticInt200(value.slice(2))
  }

  static from(value: ZeroHexStaticInt200.From) {
    return ZeroHexStaticInt200.create(value)
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
    return new ZeroHexStaticInt200(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt200.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt200.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt200(value)
  }

}

export type StaticInt208 =
  | ZeroHexStaticInt208
  | BytesStaticInt208

export namespace StaticInt208 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt208.From
    | BytesStaticInt208.From

  export function create(value: StaticInt208.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt208.create(value)
    return ZeroHexStaticInt208.create(value)
  }

  export function from(value: StaticInt208.From) {
    return StaticInt208.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int208`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt208.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt208.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt208 {
  export type From = Bytes<26>
}

export class BytesStaticInt208 {
  readonly #class = BytesStaticInt208
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
    readonly value: BytesStaticInt208.From
  ) { }

  static create(value: BytesStaticInt208.From) {
    return new BytesStaticInt208(value)
  }

  static from(value: BytesStaticInt208.From) {
    return BytesStaticInt208.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt208(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt208.nibbles

    const content = cursor.readOrThrow(BytesStaticInt208.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt208(value as Bytes<26>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt208.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt208.bytes

    const content = cursor.readOrThrow(BytesStaticInt208.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt208(value)
  }

}

export namespace ZeroHexStaticInt208 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt208 {
  readonly #class = ZeroHexStaticInt208
  readonly name = this.#class.name

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly bitsn = BigInt(208)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt208.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt208(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt208(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt208.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt208.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt208.fromNumber(value)
    return new ZeroHexStaticInt208(value.slice(2))
  }

  static from(value: ZeroHexStaticInt208.From) {
    return ZeroHexStaticInt208.create(value)
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
    return new ZeroHexStaticInt208(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt208.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt208.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt208(value)
  }

}

export type StaticInt216 =
  | ZeroHexStaticInt216
  | BytesStaticInt216

export namespace StaticInt216 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt216.From
    | BytesStaticInt216.From

  export function create(value: StaticInt216.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt216.create(value)
    return ZeroHexStaticInt216.create(value)
  }

  export function from(value: StaticInt216.From) {
    return StaticInt216.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int216`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt216.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt216.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt216 {
  export type From = Bytes<27>
}

export class BytesStaticInt216 {
  readonly #class = BytesStaticInt216
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
    readonly value: BytesStaticInt216.From
  ) { }

  static create(value: BytesStaticInt216.From) {
    return new BytesStaticInt216(value)
  }

  static from(value: BytesStaticInt216.From) {
    return BytesStaticInt216.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt216(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt216.nibbles

    const content = cursor.readOrThrow(BytesStaticInt216.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt216(value as Bytes<27>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt216.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt216.bytes

    const content = cursor.readOrThrow(BytesStaticInt216.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt216(value)
  }

}

export namespace ZeroHexStaticInt216 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt216 {
  readonly #class = ZeroHexStaticInt216
  readonly name = this.#class.name

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly bitsn = BigInt(216)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt216.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt216(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt216(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt216.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt216.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt216.fromNumber(value)
    return new ZeroHexStaticInt216(value.slice(2))
  }

  static from(value: ZeroHexStaticInt216.From) {
    return ZeroHexStaticInt216.create(value)
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
    return new ZeroHexStaticInt216(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt216.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt216.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt216(value)
  }

}

export type StaticInt224 =
  | ZeroHexStaticInt224
  | BytesStaticInt224

export namespace StaticInt224 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt224.From
    | BytesStaticInt224.From

  export function create(value: StaticInt224.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt224.create(value)
    return ZeroHexStaticInt224.create(value)
  }

  export function from(value: StaticInt224.From) {
    return StaticInt224.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int224`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt224.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt224.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt224 {
  export type From = Bytes<28>
}

export class BytesStaticInt224 {
  readonly #class = BytesStaticInt224
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
    readonly value: BytesStaticInt224.From
  ) { }

  static create(value: BytesStaticInt224.From) {
    return new BytesStaticInt224(value)
  }

  static from(value: BytesStaticInt224.From) {
    return BytesStaticInt224.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt224(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt224.nibbles

    const content = cursor.readOrThrow(BytesStaticInt224.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt224(value as Bytes<28>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt224.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt224.bytes

    const content = cursor.readOrThrow(BytesStaticInt224.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt224(value)
  }

}

export namespace ZeroHexStaticInt224 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt224 {
  readonly #class = ZeroHexStaticInt224
  readonly name = this.#class.name

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly bitsn = BigInt(224)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt224.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt224(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt224(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt224.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt224.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt224.fromNumber(value)
    return new ZeroHexStaticInt224(value.slice(2))
  }

  static from(value: ZeroHexStaticInt224.From) {
    return ZeroHexStaticInt224.create(value)
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
    return new ZeroHexStaticInt224(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt224.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt224.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt224(value)
  }

}

export type StaticInt232 =
  | ZeroHexStaticInt232
  | BytesStaticInt232

export namespace StaticInt232 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt232.From
    | BytesStaticInt232.From

  export function create(value: StaticInt232.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt232.create(value)
    return ZeroHexStaticInt232.create(value)
  }

  export function from(value: StaticInt232.From) {
    return StaticInt232.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int232`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt232.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt232.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt232 {
  export type From = Bytes<29>
}

export class BytesStaticInt232 {
  readonly #class = BytesStaticInt232
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
    readonly value: BytesStaticInt232.From
  ) { }

  static create(value: BytesStaticInt232.From) {
    return new BytesStaticInt232(value)
  }

  static from(value: BytesStaticInt232.From) {
    return BytesStaticInt232.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt232(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt232.nibbles

    const content = cursor.readOrThrow(BytesStaticInt232.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt232(value as Bytes<29>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt232.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt232.bytes

    const content = cursor.readOrThrow(BytesStaticInt232.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt232(value)
  }

}

export namespace ZeroHexStaticInt232 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt232 {
  readonly #class = ZeroHexStaticInt232
  readonly name = this.#class.name

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly bitsn = BigInt(232)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt232.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt232(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt232(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt232.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt232.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt232.fromNumber(value)
    return new ZeroHexStaticInt232(value.slice(2))
  }

  static from(value: ZeroHexStaticInt232.From) {
    return ZeroHexStaticInt232.create(value)
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
    return new ZeroHexStaticInt232(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt232.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt232.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt232(value)
  }

}

export type StaticInt240 =
  | ZeroHexStaticInt240
  | BytesStaticInt240

export namespace StaticInt240 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt240.From
    | BytesStaticInt240.From

  export function create(value: StaticInt240.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt240.create(value)
    return ZeroHexStaticInt240.create(value)
  }

  export function from(value: StaticInt240.From) {
    return StaticInt240.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int240`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt240.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt240.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt240 {
  export type From = Bytes<30>
}

export class BytesStaticInt240 {
  readonly #class = BytesStaticInt240
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
    readonly value: BytesStaticInt240.From
  ) { }

  static create(value: BytesStaticInt240.From) {
    return new BytesStaticInt240(value)
  }

  static from(value: BytesStaticInt240.From) {
    return BytesStaticInt240.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt240(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt240.nibbles

    const content = cursor.readOrThrow(BytesStaticInt240.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt240(value as Bytes<30>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt240.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt240.bytes

    const content = cursor.readOrThrow(BytesStaticInt240.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt240(value)
  }

}

export namespace ZeroHexStaticInt240 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt240 {
  readonly #class = ZeroHexStaticInt240
  readonly name = this.#class.name

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly bitsn = BigInt(240)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt240.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt240(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt240(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt240.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt240.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt240.fromNumber(value)
    return new ZeroHexStaticInt240(value.slice(2))
  }

  static from(value: ZeroHexStaticInt240.From) {
    return ZeroHexStaticInt240.create(value)
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
    return new ZeroHexStaticInt240(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt240.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt240.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt240(value)
  }

}

export type StaticInt248 =
  | ZeroHexStaticInt248
  | BytesStaticInt248

export namespace StaticInt248 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt248.From
    | BytesStaticInt248.From

  export function create(value: StaticInt248.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt248.create(value)
    return ZeroHexStaticInt248.create(value)
  }

  export function from(value: StaticInt248.From) {
    return StaticInt248.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int248`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt248.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt248.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt248 {
  export type From = Bytes<31>
}

export class BytesStaticInt248 {
  readonly #class = BytesStaticInt248
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
    readonly value: BytesStaticInt248.From
  ) { }

  static create(value: BytesStaticInt248.From) {
    return new BytesStaticInt248(value)
  }

  static from(value: BytesStaticInt248.From) {
    return BytesStaticInt248.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt248(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt248.nibbles

    const content = cursor.readOrThrow(BytesStaticInt248.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt248(value as Bytes<31>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt248.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt248.bytes

    const content = cursor.readOrThrow(BytesStaticInt248.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt248(value)
  }

}

export namespace ZeroHexStaticInt248 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt248 {
  readonly #class = ZeroHexStaticInt248
  readonly name = this.#class.name

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly bitsn = BigInt(248)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt248.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt248(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt248(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt248.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt248.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt248.fromNumber(value)
    return new ZeroHexStaticInt248(value.slice(2))
  }

  static from(value: ZeroHexStaticInt248.From) {
    return ZeroHexStaticInt248.create(value)
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
    return new ZeroHexStaticInt248(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt248.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt248.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt248(value)
  }

}

export type StaticInt256 =
  | ZeroHexStaticInt256
  | BytesStaticInt256

export namespace StaticInt256 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt256.From
    | BytesStaticInt256.From

  export function create(value: StaticInt256.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt256.create(value)
    return ZeroHexStaticInt256.create(value)
  }

  export function from(value: StaticInt256.From) {
    return StaticInt256.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.Int256`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt256.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt256.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt256 {
  export type From = Bytes<32>
}

export class BytesStaticInt256 {
  readonly #class = BytesStaticInt256
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
    readonly value: BytesStaticInt256.From
  ) { }

  static create(value: BytesStaticInt256.From) {
    return new BytesStaticInt256(value)
  }

  static from(value: BytesStaticInt256.From) {
    return BytesStaticInt256.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt256(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticInt256.nibbles

    const content = cursor.readOrThrow(BytesStaticInt256.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt256(value as Bytes<32>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt256.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt256.bytes

    const content = cursor.readOrThrow(BytesStaticInt256.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt256(value)
  }

}

export namespace ZeroHexStaticInt256 {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticInt256 {
  readonly #class = ZeroHexStaticInt256
  readonly name = this.#class.name

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly bitsn = BigInt(256)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static fromNumber(value: number) {
    return ZeroHexStaticInt256.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt256(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt256(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt256.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt256.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt256.fromNumber(value)
    return new ZeroHexStaticInt256(value.slice(2))
  }

  static from(value: ZeroHexStaticInt256.From) {
    return ZeroHexStaticInt256.create(value)
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
    return new ZeroHexStaticInt256(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt256.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt256.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt256(value)
  }

}

export type IntByName = {
    int8: typeof StaticInt8,
    int16: typeof StaticInt16,
    int24: typeof StaticInt24,
    int32: typeof StaticInt32,
    int40: typeof StaticInt40,
    int48: typeof StaticInt48,
    int56: typeof StaticInt56,
    int64: typeof StaticInt64,
    int72: typeof StaticInt72,
    int80: typeof StaticInt80,
    int88: typeof StaticInt88,
    int96: typeof StaticInt96,
    int104: typeof StaticInt104,
    int112: typeof StaticInt112,
    int120: typeof StaticInt120,
    int128: typeof StaticInt128,
    int136: typeof StaticInt136,
    int144: typeof StaticInt144,
    int152: typeof StaticInt152,
    int160: typeof StaticInt160,
    int168: typeof StaticInt168,
    int176: typeof StaticInt176,
    int184: typeof StaticInt184,
    int192: typeof StaticInt192,
    int200: typeof StaticInt200,
    int208: typeof StaticInt208,
    int216: typeof StaticInt216,
    int224: typeof StaticInt224,
    int232: typeof StaticInt232,
    int240: typeof StaticInt240,
    int248: typeof StaticInt248,
    int256: typeof StaticInt256,
  }
  
  export const intByName: IntByName = {
    int8: StaticInt8,
    int16: StaticInt16,
    int24: StaticInt24,
    int32: StaticInt32,
    int40: StaticInt40,
    int48: StaticInt48,
    int56: StaticInt56,
    int64: StaticInt64,
    int72: StaticInt72,
    int80: StaticInt80,
    int88: StaticInt88,
    int96: StaticInt96,
    int104: StaticInt104,
    int112: StaticInt112,
    int120: StaticInt120,
    int128: StaticInt128,
    int136: StaticInt136,
    int144: StaticInt144,
    int152: StaticInt152,
    int160: StaticInt160,
    int168: StaticInt168,
    int176: StaticInt176,
    int184: StaticInt184,
    int192: StaticInt192,
    int200: StaticInt200,
    int208: StaticInt208,
    int216: StaticInt216,
    int224: StaticInt224,
    int232: StaticInt232,
    int240: StaticInt240,
    int248: StaticInt248,
    int256: StaticInt256,
  }