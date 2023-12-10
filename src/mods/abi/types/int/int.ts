import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { RawHexString } from "mods/types/rawhex/index.js";
import { ZeroHexString } from "mods/types/zerohex/index.js";

const BN_0 = 0n
const BN_1 = 1n

export { AbiInt8 as Int8 };

export type AbiInt8 =
  | ZeroHexAbiInt8
  | BytesAbiInt8

export namespace AbiInt8 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt8.From
    | BytesAbiInt8.From

  export function create(value: AbiInt8.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt8.create(value)
    return ZeroHexAbiInt8.create(value)
  }

  export function from(value: AbiInt8.From) {
    return AbiInt8.create(value)
  }

  export function codegen() {
    return `Abi.Int8`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt8.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt8.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt8 {
  export type From = Uint8Array
}

export class BytesAbiInt8 {
  readonly #class = BytesAbiInt8
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt8.From) {
    return new BytesAbiInt8(value)
  }

  static from(value: BytesAbiInt8.From) {
    return BytesAbiInt8.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt8(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt8(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int8`
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
    cursor.offset += 64 - BytesAbiInt8.nibbles

    const content = cursor.readOrThrow(BytesAbiInt8.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt8(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt8.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt8.bytes

    const content = cursor.readOrThrow(BytesAbiInt8.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt8(value)
  }

}

export namespace ZeroHexAbiInt8 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt8 {
  readonly #class = ZeroHexAbiInt8
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
    return ZeroHexAbiInt8.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt8(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt8(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt8.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt8.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt8.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt8(value.slice(2))
    return ZeroHexAbiInt8.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt8.From) {
    return ZeroHexAbiInt8.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int8`
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
    return new ZeroHexAbiInt8(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt8.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt8.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt8(value)
  }

}

export { AbiInt16 as Int16 };

export type AbiInt16 =
  | ZeroHexAbiInt16
  | BytesAbiInt16

export namespace AbiInt16 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt16.From
    | BytesAbiInt16.From

  export function create(value: AbiInt16.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt16.create(value)
    return ZeroHexAbiInt16.create(value)
  }

  export function from(value: AbiInt16.From) {
    return AbiInt16.create(value)
  }

  export function codegen() {
    return `Abi.Int16`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt16.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt16.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt16 {
  export type From = Uint8Array
}

export class BytesAbiInt16 {
  readonly #class = BytesAbiInt16
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt16.From) {
    return new BytesAbiInt16(value)
  }

  static from(value: BytesAbiInt16.From) {
    return BytesAbiInt16.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt16(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt16(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int16`
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
    cursor.offset += 64 - BytesAbiInt16.nibbles

    const content = cursor.readOrThrow(BytesAbiInt16.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt16(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt16.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt16.bytes

    const content = cursor.readOrThrow(BytesAbiInt16.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt16(value)
  }

}

export namespace ZeroHexAbiInt16 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt16 {
  readonly #class = ZeroHexAbiInt16
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
    return ZeroHexAbiInt16.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt16(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt16(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt16.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt16.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt16.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt16(value.slice(2))
    return ZeroHexAbiInt16.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt16.From) {
    return ZeroHexAbiInt16.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int16`
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
    return new ZeroHexAbiInt16(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt16.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt16.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt16(value)
  }

}

export { AbiInt24 as Int24 };

export type AbiInt24 =
  | ZeroHexAbiInt24
  | BytesAbiInt24

export namespace AbiInt24 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt24.From
    | BytesAbiInt24.From

  export function create(value: AbiInt24.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt24.create(value)
    return ZeroHexAbiInt24.create(value)
  }

  export function from(value: AbiInt24.From) {
    return AbiInt24.create(value)
  }

  export function codegen() {
    return `Abi.Int24`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt24.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt24.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt24 {
  export type From = Uint8Array
}

export class BytesAbiInt24 {
  readonly #class = BytesAbiInt24
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt24.From) {
    return new BytesAbiInt24(value)
  }

  static from(value: BytesAbiInt24.From) {
    return BytesAbiInt24.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt24(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt24(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int24`
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
    cursor.offset += 64 - BytesAbiInt24.nibbles

    const content = cursor.readOrThrow(BytesAbiInt24.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt24(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt24.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt24.bytes

    const content = cursor.readOrThrow(BytesAbiInt24.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt24(value)
  }

}

export namespace ZeroHexAbiInt24 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt24 {
  readonly #class = ZeroHexAbiInt24
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
    return ZeroHexAbiInt24.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt24(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt24(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt24.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt24.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt24.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt24(value.slice(2))
    return ZeroHexAbiInt24.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt24.From) {
    return ZeroHexAbiInt24.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int24`
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
    return new ZeroHexAbiInt24(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt24.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt24.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt24(value)
  }

}

export { AbiInt32 as Int32 };

export type AbiInt32 =
  | ZeroHexAbiInt32
  | BytesAbiInt32

export namespace AbiInt32 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt32.From
    | BytesAbiInt32.From

  export function create(value: AbiInt32.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt32.create(value)
    return ZeroHexAbiInt32.create(value)
  }

  export function from(value: AbiInt32.From) {
    return AbiInt32.create(value)
  }

  export function codegen() {
    return `Abi.Int32`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt32.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt32.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt32 {
  export type From = Uint8Array
}

export class BytesAbiInt32 {
  readonly #class = BytesAbiInt32
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt32.From) {
    return new BytesAbiInt32(value)
  }

  static from(value: BytesAbiInt32.From) {
    return BytesAbiInt32.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt32(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt32(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int32`
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
    cursor.offset += 64 - BytesAbiInt32.nibbles

    const content = cursor.readOrThrow(BytesAbiInt32.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt32(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt32.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt32.bytes

    const content = cursor.readOrThrow(BytesAbiInt32.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt32(value)
  }

}

export namespace ZeroHexAbiInt32 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt32 {
  readonly #class = ZeroHexAbiInt32
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
    return ZeroHexAbiInt32.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt32(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt32(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt32.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt32.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt32.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt32(value.slice(2))
    return ZeroHexAbiInt32.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt32.From) {
    return ZeroHexAbiInt32.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int32`
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
    return new ZeroHexAbiInt32(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt32.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt32.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt32(value)
  }

}

export { AbiInt40 as Int40 };

export type AbiInt40 =
  | ZeroHexAbiInt40
  | BytesAbiInt40

export namespace AbiInt40 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt40.From
    | BytesAbiInt40.From

  export function create(value: AbiInt40.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt40.create(value)
    return ZeroHexAbiInt40.create(value)
  }

  export function from(value: AbiInt40.From) {
    return AbiInt40.create(value)
  }

  export function codegen() {
    return `Abi.Int40`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt40.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt40.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt40 {
  export type From = Uint8Array
}

export class BytesAbiInt40 {
  readonly #class = BytesAbiInt40
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt40.From) {
    return new BytesAbiInt40(value)
  }

  static from(value: BytesAbiInt40.From) {
    return BytesAbiInt40.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt40(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt40(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int40`
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
    cursor.offset += 64 - BytesAbiInt40.nibbles

    const content = cursor.readOrThrow(BytesAbiInt40.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt40(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt40.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt40.bytes

    const content = cursor.readOrThrow(BytesAbiInt40.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt40(value)
  }

}

export namespace ZeroHexAbiInt40 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt40 {
  readonly #class = ZeroHexAbiInt40
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
    return ZeroHexAbiInt40.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt40(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt40(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt40.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt40.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt40.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt40(value.slice(2))
    return ZeroHexAbiInt40.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt40.From) {
    return ZeroHexAbiInt40.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int40`
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
    return new ZeroHexAbiInt40(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt40.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt40.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt40(value)
  }

}

export { AbiInt48 as Int48 };

export type AbiInt48 =
  | ZeroHexAbiInt48
  | BytesAbiInt48

export namespace AbiInt48 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt48.From
    | BytesAbiInt48.From

  export function create(value: AbiInt48.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt48.create(value)
    return ZeroHexAbiInt48.create(value)
  }

  export function from(value: AbiInt48.From) {
    return AbiInt48.create(value)
  }

  export function codegen() {
    return `Abi.Int48`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt48.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt48.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt48 {
  export type From = Uint8Array
}

export class BytesAbiInt48 {
  readonly #class = BytesAbiInt48
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt48.From) {
    return new BytesAbiInt48(value)
  }

  static from(value: BytesAbiInt48.From) {
    return BytesAbiInt48.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt48(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt48(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int48`
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
    cursor.offset += 64 - BytesAbiInt48.nibbles

    const content = cursor.readOrThrow(BytesAbiInt48.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt48(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt48.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt48.bytes

    const content = cursor.readOrThrow(BytesAbiInt48.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt48(value)
  }

}

export namespace ZeroHexAbiInt48 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt48 {
  readonly #class = ZeroHexAbiInt48
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
    return ZeroHexAbiInt48.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt48(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt48(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt48.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt48.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt48.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt48(value.slice(2))
    return ZeroHexAbiInt48.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt48.From) {
    return ZeroHexAbiInt48.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int48`
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
    return new ZeroHexAbiInt48(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt48.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt48.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt48(value)
  }

}

export { AbiInt56 as Int56 };

export type AbiInt56 =
  | ZeroHexAbiInt56
  | BytesAbiInt56

export namespace AbiInt56 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt56.From
    | BytesAbiInt56.From

  export function create(value: AbiInt56.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt56.create(value)
    return ZeroHexAbiInt56.create(value)
  }

  export function from(value: AbiInt56.From) {
    return AbiInt56.create(value)
  }

  export function codegen() {
    return `Abi.Int56`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt56.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt56.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt56 {
  export type From = Uint8Array
}

export class BytesAbiInt56 {
  readonly #class = BytesAbiInt56
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt56.From) {
    return new BytesAbiInt56(value)
  }

  static from(value: BytesAbiInt56.From) {
    return BytesAbiInt56.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt56(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt56(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int56`
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
    cursor.offset += 64 - BytesAbiInt56.nibbles

    const content = cursor.readOrThrow(BytesAbiInt56.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt56(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt56.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt56.bytes

    const content = cursor.readOrThrow(BytesAbiInt56.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt56(value)
  }

}

export namespace ZeroHexAbiInt56 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt56 {
  readonly #class = ZeroHexAbiInt56
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
    return ZeroHexAbiInt56.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt56(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt56(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt56.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt56.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt56.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt56(value.slice(2))
    return ZeroHexAbiInt56.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt56.From) {
    return ZeroHexAbiInt56.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int56`
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
    return new ZeroHexAbiInt56(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt56.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt56.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt56(value)
  }

}

export { AbiInt64 as Int64 };

export type AbiInt64 =
  | ZeroHexAbiInt64
  | BytesAbiInt64

export namespace AbiInt64 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt64.From
    | BytesAbiInt64.From

  export function create(value: AbiInt64.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt64.create(value)
    return ZeroHexAbiInt64.create(value)
  }

  export function from(value: AbiInt64.From) {
    return AbiInt64.create(value)
  }

  export function codegen() {
    return `Abi.Int64`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt64.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt64.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt64 {
  export type From = Uint8Array
}

export class BytesAbiInt64 {
  readonly #class = BytesAbiInt64
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt64.From) {
    return new BytesAbiInt64(value)
  }

  static from(value: BytesAbiInt64.From) {
    return BytesAbiInt64.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt64(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt64(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int64`
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
    cursor.offset += 64 - BytesAbiInt64.nibbles

    const content = cursor.readOrThrow(BytesAbiInt64.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt64(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt64.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt64.bytes

    const content = cursor.readOrThrow(BytesAbiInt64.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt64(value)
  }

}

export namespace ZeroHexAbiInt64 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt64 {
  readonly #class = ZeroHexAbiInt64
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
    return ZeroHexAbiInt64.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt64(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt64(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt64.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt64.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt64.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt64(value.slice(2))
    return ZeroHexAbiInt64.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt64.From) {
    return ZeroHexAbiInt64.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int64`
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
    return new ZeroHexAbiInt64(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt64.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt64.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt64(value)
  }

}

export { AbiInt72 as Int72 };

export type AbiInt72 =
  | ZeroHexAbiInt72
  | BytesAbiInt72

export namespace AbiInt72 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt72.From
    | BytesAbiInt72.From

  export function create(value: AbiInt72.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt72.create(value)
    return ZeroHexAbiInt72.create(value)
  }

  export function from(value: AbiInt72.From) {
    return AbiInt72.create(value)
  }

  export function codegen() {
    return `Abi.Int72`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt72.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt72.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt72 {
  export type From = Uint8Array
}

export class BytesAbiInt72 {
  readonly #class = BytesAbiInt72
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt72.From) {
    return new BytesAbiInt72(value)
  }

  static from(value: BytesAbiInt72.From) {
    return BytesAbiInt72.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt72(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt72(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int72`
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
    cursor.offset += 64 - BytesAbiInt72.nibbles

    const content = cursor.readOrThrow(BytesAbiInt72.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt72(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt72.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt72.bytes

    const content = cursor.readOrThrow(BytesAbiInt72.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt72(value)
  }

}

export namespace ZeroHexAbiInt72 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt72 {
  readonly #class = ZeroHexAbiInt72
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
    return ZeroHexAbiInt72.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt72(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt72(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt72.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt72.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt72.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt72(value.slice(2))
    return ZeroHexAbiInt72.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt72.From) {
    return ZeroHexAbiInt72.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int72`
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
    return new ZeroHexAbiInt72(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt72.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt72.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt72(value)
  }

}

export { AbiInt80 as Int80 };

export type AbiInt80 =
  | ZeroHexAbiInt80
  | BytesAbiInt80

export namespace AbiInt80 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt80.From
    | BytesAbiInt80.From

  export function create(value: AbiInt80.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt80.create(value)
    return ZeroHexAbiInt80.create(value)
  }

  export function from(value: AbiInt80.From) {
    return AbiInt80.create(value)
  }

  export function codegen() {
    return `Abi.Int80`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt80.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt80.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt80 {
  export type From = Uint8Array
}

export class BytesAbiInt80 {
  readonly #class = BytesAbiInt80
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt80.From) {
    return new BytesAbiInt80(value)
  }

  static from(value: BytesAbiInt80.From) {
    return BytesAbiInt80.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt80(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt80(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int80`
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
    cursor.offset += 64 - BytesAbiInt80.nibbles

    const content = cursor.readOrThrow(BytesAbiInt80.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt80(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt80.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt80.bytes

    const content = cursor.readOrThrow(BytesAbiInt80.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt80(value)
  }

}

export namespace ZeroHexAbiInt80 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt80 {
  readonly #class = ZeroHexAbiInt80
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
    return ZeroHexAbiInt80.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt80(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt80(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt80.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt80.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt80.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt80(value.slice(2))
    return ZeroHexAbiInt80.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt80.From) {
    return ZeroHexAbiInt80.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int80`
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
    return new ZeroHexAbiInt80(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt80.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt80.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt80(value)
  }

}

export { AbiInt88 as Int88 };

export type AbiInt88 =
  | ZeroHexAbiInt88
  | BytesAbiInt88

export namespace AbiInt88 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt88.From
    | BytesAbiInt88.From

  export function create(value: AbiInt88.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt88.create(value)
    return ZeroHexAbiInt88.create(value)
  }

  export function from(value: AbiInt88.From) {
    return AbiInt88.create(value)
  }

  export function codegen() {
    return `Abi.Int88`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt88.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt88.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt88 {
  export type From = Uint8Array
}

export class BytesAbiInt88 {
  readonly #class = BytesAbiInt88
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt88.From) {
    return new BytesAbiInt88(value)
  }

  static from(value: BytesAbiInt88.From) {
    return BytesAbiInt88.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt88(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt88(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int88`
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
    cursor.offset += 64 - BytesAbiInt88.nibbles

    const content = cursor.readOrThrow(BytesAbiInt88.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt88(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt88.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt88.bytes

    const content = cursor.readOrThrow(BytesAbiInt88.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt88(value)
  }

}

export namespace ZeroHexAbiInt88 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt88 {
  readonly #class = ZeroHexAbiInt88
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
    return ZeroHexAbiInt88.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt88(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt88(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt88.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt88.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt88.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt88(value.slice(2))
    return ZeroHexAbiInt88.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt88.From) {
    return ZeroHexAbiInt88.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int88`
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
    return new ZeroHexAbiInt88(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt88.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt88.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt88(value)
  }

}

export { AbiInt96 as Int96 };

export type AbiInt96 =
  | ZeroHexAbiInt96
  | BytesAbiInt96

export namespace AbiInt96 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt96.From
    | BytesAbiInt96.From

  export function create(value: AbiInt96.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt96.create(value)
    return ZeroHexAbiInt96.create(value)
  }

  export function from(value: AbiInt96.From) {
    return AbiInt96.create(value)
  }

  export function codegen() {
    return `Abi.Int96`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt96.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt96.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt96 {
  export type From = Uint8Array
}

export class BytesAbiInt96 {
  readonly #class = BytesAbiInt96
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt96.From) {
    return new BytesAbiInt96(value)
  }

  static from(value: BytesAbiInt96.From) {
    return BytesAbiInt96.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt96(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt96(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int96`
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
    cursor.offset += 64 - BytesAbiInt96.nibbles

    const content = cursor.readOrThrow(BytesAbiInt96.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt96(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt96.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt96.bytes

    const content = cursor.readOrThrow(BytesAbiInt96.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt96(value)
  }

}

export namespace ZeroHexAbiInt96 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt96 {
  readonly #class = ZeroHexAbiInt96
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
    return ZeroHexAbiInt96.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt96(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt96(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt96.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt96.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt96.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt96(value.slice(2))
    return ZeroHexAbiInt96.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt96.From) {
    return ZeroHexAbiInt96.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int96`
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
    return new ZeroHexAbiInt96(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt96.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt96.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt96(value)
  }

}

export { AbiInt104 as Int104 };

export type AbiInt104 =
  | ZeroHexAbiInt104
  | BytesAbiInt104

export namespace AbiInt104 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt104.From
    | BytesAbiInt104.From

  export function create(value: AbiInt104.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt104.create(value)
    return ZeroHexAbiInt104.create(value)
  }

  export function from(value: AbiInt104.From) {
    return AbiInt104.create(value)
  }

  export function codegen() {
    return `Abi.Int104`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt104.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt104.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt104 {
  export type From = Uint8Array
}

export class BytesAbiInt104 {
  readonly #class = BytesAbiInt104
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt104.From) {
    return new BytesAbiInt104(value)
  }

  static from(value: BytesAbiInt104.From) {
    return BytesAbiInt104.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt104(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt104(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int104`
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
    cursor.offset += 64 - BytesAbiInt104.nibbles

    const content = cursor.readOrThrow(BytesAbiInt104.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt104(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt104.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt104.bytes

    const content = cursor.readOrThrow(BytesAbiInt104.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt104(value)
  }

}

export namespace ZeroHexAbiInt104 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt104 {
  readonly #class = ZeroHexAbiInt104
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
    return ZeroHexAbiInt104.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt104(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt104(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt104.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt104.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt104.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt104(value.slice(2))
    return ZeroHexAbiInt104.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt104.From) {
    return ZeroHexAbiInt104.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int104`
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
    return new ZeroHexAbiInt104(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt104.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt104.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt104(value)
  }

}

export { AbiInt112 as Int112 };

export type AbiInt112 =
  | ZeroHexAbiInt112
  | BytesAbiInt112

export namespace AbiInt112 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt112.From
    | BytesAbiInt112.From

  export function create(value: AbiInt112.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt112.create(value)
    return ZeroHexAbiInt112.create(value)
  }

  export function from(value: AbiInt112.From) {
    return AbiInt112.create(value)
  }

  export function codegen() {
    return `Abi.Int112`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt112.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt112.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt112 {
  export type From = Uint8Array
}

export class BytesAbiInt112 {
  readonly #class = BytesAbiInt112
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt112.From) {
    return new BytesAbiInt112(value)
  }

  static from(value: BytesAbiInt112.From) {
    return BytesAbiInt112.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt112(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt112(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int112`
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
    cursor.offset += 64 - BytesAbiInt112.nibbles

    const content = cursor.readOrThrow(BytesAbiInt112.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt112(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt112.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt112.bytes

    const content = cursor.readOrThrow(BytesAbiInt112.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt112(value)
  }

}

export namespace ZeroHexAbiInt112 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt112 {
  readonly #class = ZeroHexAbiInt112
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
    return ZeroHexAbiInt112.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt112(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt112(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt112.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt112.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt112.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt112(value.slice(2))
    return ZeroHexAbiInt112.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt112.From) {
    return ZeroHexAbiInt112.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int112`
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
    return new ZeroHexAbiInt112(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt112.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt112.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt112(value)
  }

}

export { AbiInt120 as Int120 };

export type AbiInt120 =
  | ZeroHexAbiInt120
  | BytesAbiInt120

export namespace AbiInt120 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt120.From
    | BytesAbiInt120.From

  export function create(value: AbiInt120.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt120.create(value)
    return ZeroHexAbiInt120.create(value)
  }

  export function from(value: AbiInt120.From) {
    return AbiInt120.create(value)
  }

  export function codegen() {
    return `Abi.Int120`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt120.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt120.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt120 {
  export type From = Uint8Array
}

export class BytesAbiInt120 {
  readonly #class = BytesAbiInt120
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt120.From) {
    return new BytesAbiInt120(value)
  }

  static from(value: BytesAbiInt120.From) {
    return BytesAbiInt120.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt120(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt120(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int120`
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
    cursor.offset += 64 - BytesAbiInt120.nibbles

    const content = cursor.readOrThrow(BytesAbiInt120.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt120(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt120.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt120.bytes

    const content = cursor.readOrThrow(BytesAbiInt120.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt120(value)
  }

}

export namespace ZeroHexAbiInt120 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt120 {
  readonly #class = ZeroHexAbiInt120
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
    return ZeroHexAbiInt120.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt120(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt120(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt120.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt120.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt120.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt120(value.slice(2))
    return ZeroHexAbiInt120.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt120.From) {
    return ZeroHexAbiInt120.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int120`
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
    return new ZeroHexAbiInt120(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt120.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt120.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt120(value)
  }

}

export { AbiInt128 as Int128 };

export type AbiInt128 =
  | ZeroHexAbiInt128
  | BytesAbiInt128

export namespace AbiInt128 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt128.From
    | BytesAbiInt128.From

  export function create(value: AbiInt128.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt128.create(value)
    return ZeroHexAbiInt128.create(value)
  }

  export function from(value: AbiInt128.From) {
    return AbiInt128.create(value)
  }

  export function codegen() {
    return `Abi.Int128`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt128.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt128.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt128 {
  export type From = Uint8Array
}

export class BytesAbiInt128 {
  readonly #class = BytesAbiInt128
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt128.From) {
    return new BytesAbiInt128(value)
  }

  static from(value: BytesAbiInt128.From) {
    return BytesAbiInt128.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt128(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt128(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int128`
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
    cursor.offset += 64 - BytesAbiInt128.nibbles

    const content = cursor.readOrThrow(BytesAbiInt128.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt128(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt128.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt128.bytes

    const content = cursor.readOrThrow(BytesAbiInt128.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt128(value)
  }

}

export namespace ZeroHexAbiInt128 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt128 {
  readonly #class = ZeroHexAbiInt128
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
    return ZeroHexAbiInt128.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt128(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt128(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt128.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt128.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt128.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt128(value.slice(2))
    return ZeroHexAbiInt128.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt128.From) {
    return ZeroHexAbiInt128.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int128`
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
    return new ZeroHexAbiInt128(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt128.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt128.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt128(value)
  }

}

export { AbiInt136 as Int136 };

export type AbiInt136 =
  | ZeroHexAbiInt136
  | BytesAbiInt136

export namespace AbiInt136 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt136.From
    | BytesAbiInt136.From

  export function create(value: AbiInt136.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt136.create(value)
    return ZeroHexAbiInt136.create(value)
  }

  export function from(value: AbiInt136.From) {
    return AbiInt136.create(value)
  }

  export function codegen() {
    return `Abi.Int136`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt136.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt136.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt136 {
  export type From = Uint8Array
}

export class BytesAbiInt136 {
  readonly #class = BytesAbiInt136
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt136.From) {
    return new BytesAbiInt136(value)
  }

  static from(value: BytesAbiInt136.From) {
    return BytesAbiInt136.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt136(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt136(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int136`
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
    cursor.offset += 64 - BytesAbiInt136.nibbles

    const content = cursor.readOrThrow(BytesAbiInt136.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt136(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt136.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt136.bytes

    const content = cursor.readOrThrow(BytesAbiInt136.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt136(value)
  }

}

export namespace ZeroHexAbiInt136 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt136 {
  readonly #class = ZeroHexAbiInt136
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
    return ZeroHexAbiInt136.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt136(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt136(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt136.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt136.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt136.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt136(value.slice(2))
    return ZeroHexAbiInt136.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt136.From) {
    return ZeroHexAbiInt136.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int136`
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
    return new ZeroHexAbiInt136(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt136.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt136.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt136(value)
  }

}

export { AbiInt144 as Int144 };

export type AbiInt144 =
  | ZeroHexAbiInt144
  | BytesAbiInt144

export namespace AbiInt144 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt144.From
    | BytesAbiInt144.From

  export function create(value: AbiInt144.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt144.create(value)
    return ZeroHexAbiInt144.create(value)
  }

  export function from(value: AbiInt144.From) {
    return AbiInt144.create(value)
  }

  export function codegen() {
    return `Abi.Int144`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt144.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt144.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt144 {
  export type From = Uint8Array
}

export class BytesAbiInt144 {
  readonly #class = BytesAbiInt144
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt144.From) {
    return new BytesAbiInt144(value)
  }

  static from(value: BytesAbiInt144.From) {
    return BytesAbiInt144.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt144(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt144(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int144`
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
    cursor.offset += 64 - BytesAbiInt144.nibbles

    const content = cursor.readOrThrow(BytesAbiInt144.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt144(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt144.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt144.bytes

    const content = cursor.readOrThrow(BytesAbiInt144.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt144(value)
  }

}

export namespace ZeroHexAbiInt144 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt144 {
  readonly #class = ZeroHexAbiInt144
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
    return ZeroHexAbiInt144.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt144(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt144(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt144.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt144.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt144.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt144(value.slice(2))
    return ZeroHexAbiInt144.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt144.From) {
    return ZeroHexAbiInt144.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int144`
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
    return new ZeroHexAbiInt144(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt144.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt144.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt144(value)
  }

}

export { AbiInt152 as Int152 };

export type AbiInt152 =
  | ZeroHexAbiInt152
  | BytesAbiInt152

export namespace AbiInt152 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt152.From
    | BytesAbiInt152.From

  export function create(value: AbiInt152.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt152.create(value)
    return ZeroHexAbiInt152.create(value)
  }

  export function from(value: AbiInt152.From) {
    return AbiInt152.create(value)
  }

  export function codegen() {
    return `Abi.Int152`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt152.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt152.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt152 {
  export type From = Uint8Array
}

export class BytesAbiInt152 {
  readonly #class = BytesAbiInt152
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt152.From) {
    return new BytesAbiInt152(value)
  }

  static from(value: BytesAbiInt152.From) {
    return BytesAbiInt152.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt152(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt152(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int152`
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
    cursor.offset += 64 - BytesAbiInt152.nibbles

    const content = cursor.readOrThrow(BytesAbiInt152.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt152(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt152.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt152.bytes

    const content = cursor.readOrThrow(BytesAbiInt152.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt152(value)
  }

}

export namespace ZeroHexAbiInt152 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt152 {
  readonly #class = ZeroHexAbiInt152
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
    return ZeroHexAbiInt152.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt152(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt152(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt152.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt152.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt152.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt152(value.slice(2))
    return ZeroHexAbiInt152.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt152.From) {
    return ZeroHexAbiInt152.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int152`
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
    return new ZeroHexAbiInt152(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt152.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt152.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt152(value)
  }

}

export { AbiInt160 as Int160 };

export type AbiInt160 =
  | ZeroHexAbiInt160
  | BytesAbiInt160

export namespace AbiInt160 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt160.From
    | BytesAbiInt160.From

  export function create(value: AbiInt160.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt160.create(value)
    return ZeroHexAbiInt160.create(value)
  }

  export function from(value: AbiInt160.From) {
    return AbiInt160.create(value)
  }

  export function codegen() {
    return `Abi.Int160`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt160.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt160.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt160 {
  export type From = Uint8Array
}

export class BytesAbiInt160 {
  readonly #class = BytesAbiInt160
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt160.From) {
    return new BytesAbiInt160(value)
  }

  static from(value: BytesAbiInt160.From) {
    return BytesAbiInt160.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt160(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt160(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int160`
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
    cursor.offset += 64 - BytesAbiInt160.nibbles

    const content = cursor.readOrThrow(BytesAbiInt160.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt160(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt160.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt160.bytes

    const content = cursor.readOrThrow(BytesAbiInt160.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt160(value)
  }

}

export namespace ZeroHexAbiInt160 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt160 {
  readonly #class = ZeroHexAbiInt160
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
    return ZeroHexAbiInt160.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt160(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt160(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt160.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt160.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt160.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt160(value.slice(2))
    return ZeroHexAbiInt160.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt160.From) {
    return ZeroHexAbiInt160.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int160`
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
    return new ZeroHexAbiInt160(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt160.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt160.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt160(value)
  }

}

export { AbiInt168 as Int168 };

export type AbiInt168 =
  | ZeroHexAbiInt168
  | BytesAbiInt168

export namespace AbiInt168 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt168.From
    | BytesAbiInt168.From

  export function create(value: AbiInt168.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt168.create(value)
    return ZeroHexAbiInt168.create(value)
  }

  export function from(value: AbiInt168.From) {
    return AbiInt168.create(value)
  }

  export function codegen() {
    return `Abi.Int168`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt168.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt168.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt168 {
  export type From = Uint8Array
}

export class BytesAbiInt168 {
  readonly #class = BytesAbiInt168
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt168.From) {
    return new BytesAbiInt168(value)
  }

  static from(value: BytesAbiInt168.From) {
    return BytesAbiInt168.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt168(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt168(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int168`
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
    cursor.offset += 64 - BytesAbiInt168.nibbles

    const content = cursor.readOrThrow(BytesAbiInt168.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt168(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt168.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt168.bytes

    const content = cursor.readOrThrow(BytesAbiInt168.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt168(value)
  }

}

export namespace ZeroHexAbiInt168 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt168 {
  readonly #class = ZeroHexAbiInt168
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
    return ZeroHexAbiInt168.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt168(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt168(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt168.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt168.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt168.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt168(value.slice(2))
    return ZeroHexAbiInt168.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt168.From) {
    return ZeroHexAbiInt168.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int168`
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
    return new ZeroHexAbiInt168(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt168.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt168.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt168(value)
  }

}

export { AbiInt176 as Int176 };

export type AbiInt176 =
  | ZeroHexAbiInt176
  | BytesAbiInt176

export namespace AbiInt176 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt176.From
    | BytesAbiInt176.From

  export function create(value: AbiInt176.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt176.create(value)
    return ZeroHexAbiInt176.create(value)
  }

  export function from(value: AbiInt176.From) {
    return AbiInt176.create(value)
  }

  export function codegen() {
    return `Abi.Int176`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt176.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt176.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt176 {
  export type From = Uint8Array
}

export class BytesAbiInt176 {
  readonly #class = BytesAbiInt176
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt176.From) {
    return new BytesAbiInt176(value)
  }

  static from(value: BytesAbiInt176.From) {
    return BytesAbiInt176.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt176(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt176(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int176`
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
    cursor.offset += 64 - BytesAbiInt176.nibbles

    const content = cursor.readOrThrow(BytesAbiInt176.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt176(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt176.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt176.bytes

    const content = cursor.readOrThrow(BytesAbiInt176.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt176(value)
  }

}

export namespace ZeroHexAbiInt176 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt176 {
  readonly #class = ZeroHexAbiInt176
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
    return ZeroHexAbiInt176.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt176(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt176(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt176.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt176.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt176.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt176(value.slice(2))
    return ZeroHexAbiInt176.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt176.From) {
    return ZeroHexAbiInt176.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int176`
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
    return new ZeroHexAbiInt176(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt176.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt176.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt176(value)
  }

}

export { AbiInt184 as Int184 };

export type AbiInt184 =
  | ZeroHexAbiInt184
  | BytesAbiInt184

export namespace AbiInt184 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt184.From
    | BytesAbiInt184.From

  export function create(value: AbiInt184.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt184.create(value)
    return ZeroHexAbiInt184.create(value)
  }

  export function from(value: AbiInt184.From) {
    return AbiInt184.create(value)
  }

  export function codegen() {
    return `Abi.Int184`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt184.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt184.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt184 {
  export type From = Uint8Array
}

export class BytesAbiInt184 {
  readonly #class = BytesAbiInt184
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt184.From) {
    return new BytesAbiInt184(value)
  }

  static from(value: BytesAbiInt184.From) {
    return BytesAbiInt184.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt184(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt184(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int184`
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
    cursor.offset += 64 - BytesAbiInt184.nibbles

    const content = cursor.readOrThrow(BytesAbiInt184.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt184(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt184.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt184.bytes

    const content = cursor.readOrThrow(BytesAbiInt184.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt184(value)
  }

}

export namespace ZeroHexAbiInt184 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt184 {
  readonly #class = ZeroHexAbiInt184
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
    return ZeroHexAbiInt184.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt184(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt184(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt184.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt184.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt184.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt184(value.slice(2))
    return ZeroHexAbiInt184.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt184.From) {
    return ZeroHexAbiInt184.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int184`
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
    return new ZeroHexAbiInt184(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt184.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt184.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt184(value)
  }

}

export { AbiInt192 as Int192 };

export type AbiInt192 =
  | ZeroHexAbiInt192
  | BytesAbiInt192

export namespace AbiInt192 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt192.From
    | BytesAbiInt192.From

  export function create(value: AbiInt192.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt192.create(value)
    return ZeroHexAbiInt192.create(value)
  }

  export function from(value: AbiInt192.From) {
    return AbiInt192.create(value)
  }

  export function codegen() {
    return `Abi.Int192`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt192.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt192.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt192 {
  export type From = Uint8Array
}

export class BytesAbiInt192 {
  readonly #class = BytesAbiInt192
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt192.From) {
    return new BytesAbiInt192(value)
  }

  static from(value: BytesAbiInt192.From) {
    return BytesAbiInt192.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt192(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt192(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int192`
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
    cursor.offset += 64 - BytesAbiInt192.nibbles

    const content = cursor.readOrThrow(BytesAbiInt192.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt192(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt192.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt192.bytes

    const content = cursor.readOrThrow(BytesAbiInt192.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt192(value)
  }

}

export namespace ZeroHexAbiInt192 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt192 {
  readonly #class = ZeroHexAbiInt192
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
    return ZeroHexAbiInt192.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt192(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt192(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt192.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt192.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt192.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt192(value.slice(2))
    return ZeroHexAbiInt192.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt192.From) {
    return ZeroHexAbiInt192.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int192`
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
    return new ZeroHexAbiInt192(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt192.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt192.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt192(value)
  }

}

export { AbiInt200 as Int200 };

export type AbiInt200 =
  | ZeroHexAbiInt200
  | BytesAbiInt200

export namespace AbiInt200 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt200.From
    | BytesAbiInt200.From

  export function create(value: AbiInt200.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt200.create(value)
    return ZeroHexAbiInt200.create(value)
  }

  export function from(value: AbiInt200.From) {
    return AbiInt200.create(value)
  }

  export function codegen() {
    return `Abi.Int200`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt200.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt200.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt200 {
  export type From = Uint8Array
}

export class BytesAbiInt200 {
  readonly #class = BytesAbiInt200
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt200.From) {
    return new BytesAbiInt200(value)
  }

  static from(value: BytesAbiInt200.From) {
    return BytesAbiInt200.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt200(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt200(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int200`
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
    cursor.offset += 64 - BytesAbiInt200.nibbles

    const content = cursor.readOrThrow(BytesAbiInt200.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt200(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt200.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt200.bytes

    const content = cursor.readOrThrow(BytesAbiInt200.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt200(value)
  }

}

export namespace ZeroHexAbiInt200 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt200 {
  readonly #class = ZeroHexAbiInt200
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
    return ZeroHexAbiInt200.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt200(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt200(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt200.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt200.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt200.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt200(value.slice(2))
    return ZeroHexAbiInt200.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt200.From) {
    return ZeroHexAbiInt200.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int200`
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
    return new ZeroHexAbiInt200(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt200.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt200.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt200(value)
  }

}

export { AbiInt208 as Int208 };

export type AbiInt208 =
  | ZeroHexAbiInt208
  | BytesAbiInt208

export namespace AbiInt208 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt208.From
    | BytesAbiInt208.From

  export function create(value: AbiInt208.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt208.create(value)
    return ZeroHexAbiInt208.create(value)
  }

  export function from(value: AbiInt208.From) {
    return AbiInt208.create(value)
  }

  export function codegen() {
    return `Abi.Int208`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt208.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt208.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt208 {
  export type From = Uint8Array
}

export class BytesAbiInt208 {
  readonly #class = BytesAbiInt208
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt208.From) {
    return new BytesAbiInt208(value)
  }

  static from(value: BytesAbiInt208.From) {
    return BytesAbiInt208.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt208(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt208(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int208`
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
    cursor.offset += 64 - BytesAbiInt208.nibbles

    const content = cursor.readOrThrow(BytesAbiInt208.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt208(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt208.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt208.bytes

    const content = cursor.readOrThrow(BytesAbiInt208.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt208(value)
  }

}

export namespace ZeroHexAbiInt208 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt208 {
  readonly #class = ZeroHexAbiInt208
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
    return ZeroHexAbiInt208.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt208(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt208(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt208.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt208.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt208.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt208(value.slice(2))
    return ZeroHexAbiInt208.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt208.From) {
    return ZeroHexAbiInt208.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int208`
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
    return new ZeroHexAbiInt208(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt208.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt208.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt208(value)
  }

}

export { AbiInt216 as Int216 };

export type AbiInt216 =
  | ZeroHexAbiInt216
  | BytesAbiInt216

export namespace AbiInt216 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt216.From
    | BytesAbiInt216.From

  export function create(value: AbiInt216.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt216.create(value)
    return ZeroHexAbiInt216.create(value)
  }

  export function from(value: AbiInt216.From) {
    return AbiInt216.create(value)
  }

  export function codegen() {
    return `Abi.Int216`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt216.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt216.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt216 {
  export type From = Uint8Array
}

export class BytesAbiInt216 {
  readonly #class = BytesAbiInt216
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt216.From) {
    return new BytesAbiInt216(value)
  }

  static from(value: BytesAbiInt216.From) {
    return BytesAbiInt216.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt216(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt216(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int216`
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
    cursor.offset += 64 - BytesAbiInt216.nibbles

    const content = cursor.readOrThrow(BytesAbiInt216.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt216(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt216.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt216.bytes

    const content = cursor.readOrThrow(BytesAbiInt216.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt216(value)
  }

}

export namespace ZeroHexAbiInt216 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt216 {
  readonly #class = ZeroHexAbiInt216
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
    return ZeroHexAbiInt216.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt216(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt216(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt216.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt216.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt216.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt216(value.slice(2))
    return ZeroHexAbiInt216.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt216.From) {
    return ZeroHexAbiInt216.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int216`
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
    return new ZeroHexAbiInt216(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt216.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt216.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt216(value)
  }

}

export { AbiInt224 as Int224 };

export type AbiInt224 =
  | ZeroHexAbiInt224
  | BytesAbiInt224

export namespace AbiInt224 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt224.From
    | BytesAbiInt224.From

  export function create(value: AbiInt224.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt224.create(value)
    return ZeroHexAbiInt224.create(value)
  }

  export function from(value: AbiInt224.From) {
    return AbiInt224.create(value)
  }

  export function codegen() {
    return `Abi.Int224`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt224.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt224.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt224 {
  export type From = Uint8Array
}

export class BytesAbiInt224 {
  readonly #class = BytesAbiInt224
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt224.From) {
    return new BytesAbiInt224(value)
  }

  static from(value: BytesAbiInt224.From) {
    return BytesAbiInt224.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt224(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt224(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int224`
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
    cursor.offset += 64 - BytesAbiInt224.nibbles

    const content = cursor.readOrThrow(BytesAbiInt224.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt224(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt224.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt224.bytes

    const content = cursor.readOrThrow(BytesAbiInt224.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt224(value)
  }

}

export namespace ZeroHexAbiInt224 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt224 {
  readonly #class = ZeroHexAbiInt224
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
    return ZeroHexAbiInt224.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt224(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt224(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt224.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt224.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt224.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt224(value.slice(2))
    return ZeroHexAbiInt224.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt224.From) {
    return ZeroHexAbiInt224.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int224`
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
    return new ZeroHexAbiInt224(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt224.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt224.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt224(value)
  }

}

export { AbiInt232 as Int232 };

export type AbiInt232 =
  | ZeroHexAbiInt232
  | BytesAbiInt232

export namespace AbiInt232 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt232.From
    | BytesAbiInt232.From

  export function create(value: AbiInt232.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt232.create(value)
    return ZeroHexAbiInt232.create(value)
  }

  export function from(value: AbiInt232.From) {
    return AbiInt232.create(value)
  }

  export function codegen() {
    return `Abi.Int232`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt232.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt232.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt232 {
  export type From = Uint8Array
}

export class BytesAbiInt232 {
  readonly #class = BytesAbiInt232
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt232.From) {
    return new BytesAbiInt232(value)
  }

  static from(value: BytesAbiInt232.From) {
    return BytesAbiInt232.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt232(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt232(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int232`
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
    cursor.offset += 64 - BytesAbiInt232.nibbles

    const content = cursor.readOrThrow(BytesAbiInt232.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt232(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt232.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt232.bytes

    const content = cursor.readOrThrow(BytesAbiInt232.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt232(value)
  }

}

export namespace ZeroHexAbiInt232 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt232 {
  readonly #class = ZeroHexAbiInt232
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
    return ZeroHexAbiInt232.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt232(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt232(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt232.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt232.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt232.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt232(value.slice(2))
    return ZeroHexAbiInt232.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt232.From) {
    return ZeroHexAbiInt232.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int232`
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
    return new ZeroHexAbiInt232(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt232.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt232.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt232(value)
  }

}

export { AbiInt240 as Int240 };

export type AbiInt240 =
  | ZeroHexAbiInt240
  | BytesAbiInt240

export namespace AbiInt240 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt240.From
    | BytesAbiInt240.From

  export function create(value: AbiInt240.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt240.create(value)
    return ZeroHexAbiInt240.create(value)
  }

  export function from(value: AbiInt240.From) {
    return AbiInt240.create(value)
  }

  export function codegen() {
    return `Abi.Int240`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt240.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt240.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt240 {
  export type From = Uint8Array
}

export class BytesAbiInt240 {
  readonly #class = BytesAbiInt240
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt240.From) {
    return new BytesAbiInt240(value)
  }

  static from(value: BytesAbiInt240.From) {
    return BytesAbiInt240.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt240(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt240(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int240`
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
    cursor.offset += 64 - BytesAbiInt240.nibbles

    const content = cursor.readOrThrow(BytesAbiInt240.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt240(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt240.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt240.bytes

    const content = cursor.readOrThrow(BytesAbiInt240.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt240(value)
  }

}

export namespace ZeroHexAbiInt240 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt240 {
  readonly #class = ZeroHexAbiInt240
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
    return ZeroHexAbiInt240.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt240(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt240(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt240.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt240.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt240.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt240(value.slice(2))
    return ZeroHexAbiInt240.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt240.From) {
    return ZeroHexAbiInt240.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int240`
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
    return new ZeroHexAbiInt240(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt240.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt240.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt240(value)
  }

}

export { AbiInt248 as Int248 };

export type AbiInt248 =
  | ZeroHexAbiInt248
  | BytesAbiInt248

export namespace AbiInt248 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt248.From
    | BytesAbiInt248.From

  export function create(value: AbiInt248.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt248.create(value)
    return ZeroHexAbiInt248.create(value)
  }

  export function from(value: AbiInt248.From) {
    return AbiInt248.create(value)
  }

  export function codegen() {
    return `Abi.Int248`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt248.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt248.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt248 {
  export type From = Uint8Array
}

export class BytesAbiInt248 {
  readonly #class = BytesAbiInt248
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt248.From) {
    return new BytesAbiInt248(value)
  }

  static from(value: BytesAbiInt248.From) {
    return BytesAbiInt248.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt248(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt248(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int248`
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
    cursor.offset += 64 - BytesAbiInt248.nibbles

    const content = cursor.readOrThrow(BytesAbiInt248.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt248(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt248.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt248.bytes

    const content = cursor.readOrThrow(BytesAbiInt248.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt248(value)
  }

}

export namespace ZeroHexAbiInt248 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt248 {
  readonly #class = ZeroHexAbiInt248
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
    return ZeroHexAbiInt248.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt248(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt248(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt248.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt248.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt248.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt248(value.slice(2))
    return ZeroHexAbiInt248.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt248.From) {
    return ZeroHexAbiInt248.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int248`
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
    return new ZeroHexAbiInt248(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt248.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt248.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt248(value)
  }

}

export { AbiInt256 as Int256 };

export type AbiInt256 =
  | ZeroHexAbiInt256
  | BytesAbiInt256

export namespace AbiInt256 {
  export const dynamic = false
  export const size = 32

  export type From =
    | ZeroHexAbiInt256.From
    | BytesAbiInt256.From

  export function create(value: AbiInt256.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt256.create(value)
    return ZeroHexAbiInt256.create(value)
  }

  export function from(value: AbiInt256.From) {
    return AbiInt256.create(value)
  }

  export function codegen() {
    return `Abi.Int256`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt256.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt256.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt256 {
  export type From = Uint8Array
}

export class BytesAbiInt256 {
  readonly #class = BytesAbiInt256
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
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt256.From) {
    return new BytesAbiInt256(value)
  }

  static from(value: BytesAbiInt256.From) {
    return BytesAbiInt256.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt256(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt256(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int256`
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
    cursor.offset += 64 - BytesAbiInt256.nibbles

    const content = cursor.readOrThrow(BytesAbiInt256.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new BytesAbiInt256(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt256.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt256.bytes

    const content = cursor.readOrThrow(BytesAbiInt256.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt256(value)
  }

}

export namespace ZeroHexAbiInt256 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt256 {
  readonly #class = ZeroHexAbiInt256
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
    return ZeroHexAbiInt256.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0)
      return new ZeroHexAbiInt256(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt256(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt256.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt256.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt256.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt256(value.slice(2))
    return ZeroHexAbiInt256.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt256.From) {
    return ZeroHexAbiInt256.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decode(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int256`
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
    return new ZeroHexAbiInt256(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt256.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt256.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt256(value)
  }

}

export type IntByName = {
  int8: typeof AbiInt8,
  int16: typeof AbiInt16,
  int24: typeof AbiInt24,
  int32: typeof AbiInt32,
  int40: typeof AbiInt40,
  int48: typeof AbiInt48,
  int56: typeof AbiInt56,
  int64: typeof AbiInt64,
  int72: typeof AbiInt72,
  int80: typeof AbiInt80,
  int88: typeof AbiInt88,
  int96: typeof AbiInt96,
  int104: typeof AbiInt104,
  int112: typeof AbiInt112,
  int120: typeof AbiInt120,
  int128: typeof AbiInt128,
  int136: typeof AbiInt136,
  int144: typeof AbiInt144,
  int152: typeof AbiInt152,
  int160: typeof AbiInt160,
  int168: typeof AbiInt168,
  int176: typeof AbiInt176,
  int184: typeof AbiInt184,
  int192: typeof AbiInt192,
  int200: typeof AbiInt200,
  int208: typeof AbiInt208,
  int216: typeof AbiInt216,
  int224: typeof AbiInt224,
  int232: typeof AbiInt232,
  int240: typeof AbiInt240,
  int248: typeof AbiInt248,
  int256: typeof AbiInt256,
}

export const intByName: IntByName = {
  int8: AbiInt8,
  int16: AbiInt16,
  int24: AbiInt24,
  int32: AbiInt32,
  int40: AbiInt40,
  int48: AbiInt48,
  int56: AbiInt56,
  int64: AbiInt64,
  int72: AbiInt72,
  int80: AbiInt80,
  int88: AbiInt88,
  int96: AbiInt96,
  int104: AbiInt104,
  int112: AbiInt112,
  int120: AbiInt120,
  int128: AbiInt128,
  int136: AbiInt136,
  int144: AbiInt144,
  int152: AbiInt152,
  int160: AbiInt160,
  int168: AbiInt168,
  int176: AbiInt176,
  int184: AbiInt184,
  int192: AbiInt192,
  int200: AbiInt200,
  int208: AbiInt208,
  int216: AbiInt216,
  int224: AbiInt224,
  int232: AbiInt232,
  int240: AbiInt240,
  int248: AbiInt248,
  int256: AbiInt256,
}