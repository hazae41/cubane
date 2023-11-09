import { Cursor } from "@hazae41/cursor";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { Bytes } from "@hazae41/bytes";
import { Base16 } from "@hazae41/base16";
import { ZeroHexString } from "mods/types/zerohex/index.js";
import { RawHexString } from "mods/types/rawhex/index.js";

export { AbiUint8 as Uint8 }
  
export type AbiUint8 =
  | ZeroHexAbiUint8
  | BytesAbiUint8

export namespace AbiUint8 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint8.From
    | BytesAbiUint8.From

  export function create(value: AbiUint8.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint8.create(value)
    return ZeroHexAbiUint8.create(value)
  }

  export function from(value: AbiUint8.From) {
    return AbiUint8.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint8.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint8.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int8`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint8.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint8.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint8 {
  export type From = Uint8Array
}

export class BytesAbiUint8 {
  readonly #class = BytesAbiUint8
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

  toNumber() {
    return new ZeroHexAbiUint8(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint8(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint8.From) {
    return new BytesAbiUint8(value)
  }

  static from(value: BytesAbiUint8.From) {
    return BytesAbiUint8.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint8(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint8.nibbles

    const content = cursor.readOrThrow(BytesAbiUint8.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint8(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint8.bytes

    const content = cursor.readOrThrow(BytesAbiUint8.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint8(value)
  }

}

export namespace ZeroHexAbiUint8 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint8 {
  readonly #class = ZeroHexAbiUint8
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint8(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint8(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint8.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint8.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint8.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint8(value.slice(2))
    return ZeroHexAbiUint8.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint8.From) {
    return ZeroHexAbiUint8.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint8(cursor.readOrThrow(ZeroHexAbiUint8.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint8.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint8.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint8(value)
  }

}

export { AbiUint16 as Uint16 }
  
export type AbiUint16 =
  | ZeroHexAbiUint16
  | BytesAbiUint16

export namespace AbiUint16 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint16.From
    | BytesAbiUint16.From

  export function create(value: AbiUint16.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint16.create(value)
    return ZeroHexAbiUint16.create(value)
  }

  export function from(value: AbiUint16.From) {
    return AbiUint16.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint16.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint16.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int16`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint16.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint16.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint16 {
  export type From = Uint8Array
}

export class BytesAbiUint16 {
  readonly #class = BytesAbiUint16
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

  toNumber() {
    return new ZeroHexAbiUint16(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint16(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint16.From) {
    return new BytesAbiUint16(value)
  }

  static from(value: BytesAbiUint16.From) {
    return BytesAbiUint16.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint16(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint16.nibbles

    const content = cursor.readOrThrow(BytesAbiUint16.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint16(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint16.bytes

    const content = cursor.readOrThrow(BytesAbiUint16.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint16(value)
  }

}

export namespace ZeroHexAbiUint16 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint16 {
  readonly #class = ZeroHexAbiUint16
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint16(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint16(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint16.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint16.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint16.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint16(value.slice(2))
    return ZeroHexAbiUint16.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint16.From) {
    return ZeroHexAbiUint16.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint16(cursor.readOrThrow(ZeroHexAbiUint16.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint16.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint16.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint16(value)
  }

}

export { AbiUint24 as Uint24 }
  
export type AbiUint24 =
  | ZeroHexAbiUint24
  | BytesAbiUint24

export namespace AbiUint24 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint24.From
    | BytesAbiUint24.From

  export function create(value: AbiUint24.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint24.create(value)
    return ZeroHexAbiUint24.create(value)
  }

  export function from(value: AbiUint24.From) {
    return AbiUint24.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint24.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint24.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int24`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint24.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint24.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint24 {
  export type From = Uint8Array
}

export class BytesAbiUint24 {
  readonly #class = BytesAbiUint24
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

  toNumber() {
    return new ZeroHexAbiUint24(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint24(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint24.From) {
    return new BytesAbiUint24(value)
  }

  static from(value: BytesAbiUint24.From) {
    return BytesAbiUint24.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint24(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint24.nibbles

    const content = cursor.readOrThrow(BytesAbiUint24.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint24(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint24.bytes

    const content = cursor.readOrThrow(BytesAbiUint24.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint24(value)
  }

}

export namespace ZeroHexAbiUint24 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint24 {
  readonly #class = ZeroHexAbiUint24
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint24(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint24(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint24.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint24.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint24.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint24(value.slice(2))
    return ZeroHexAbiUint24.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint24.From) {
    return ZeroHexAbiUint24.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint24(cursor.readOrThrow(ZeroHexAbiUint24.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint24.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint24.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint24(value)
  }

}

export { AbiUint32 as Uint32 }
  
export type AbiUint32 =
  | ZeroHexAbiUint32
  | BytesAbiUint32

export namespace AbiUint32 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint32.From
    | BytesAbiUint32.From

  export function create(value: AbiUint32.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint32.create(value)
    return ZeroHexAbiUint32.create(value)
  }

  export function from(value: AbiUint32.From) {
    return AbiUint32.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint32.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint32.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int32`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint32.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint32.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint32 {
  export type From = Uint8Array
}

export class BytesAbiUint32 {
  readonly #class = BytesAbiUint32
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

  toNumber() {
    return new ZeroHexAbiUint32(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint32(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint32.From) {
    return new BytesAbiUint32(value)
  }

  static from(value: BytesAbiUint32.From) {
    return BytesAbiUint32.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint32(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint32.nibbles

    const content = cursor.readOrThrow(BytesAbiUint32.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint32(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint32.bytes

    const content = cursor.readOrThrow(BytesAbiUint32.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint32(value)
  }

}

export namespace ZeroHexAbiUint32 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint32 {
  readonly #class = ZeroHexAbiUint32
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint32(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint32(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint32.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint32.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint32.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint32(value.slice(2))
    return ZeroHexAbiUint32.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint32.From) {
    return ZeroHexAbiUint32.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint32(cursor.readOrThrow(ZeroHexAbiUint32.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint32.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint32.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint32(value)
  }

}

export { AbiUint40 as Uint40 }
  
export type AbiUint40 =
  | ZeroHexAbiUint40
  | BytesAbiUint40

export namespace AbiUint40 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint40.From
    | BytesAbiUint40.From

  export function create(value: AbiUint40.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint40.create(value)
    return ZeroHexAbiUint40.create(value)
  }

  export function from(value: AbiUint40.From) {
    return AbiUint40.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint40.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint40.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int40`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint40.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint40.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint40 {
  export type From = Uint8Array
}

export class BytesAbiUint40 {
  readonly #class = BytesAbiUint40
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

  toNumber() {
    return new ZeroHexAbiUint40(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint40(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint40.From) {
    return new BytesAbiUint40(value)
  }

  static from(value: BytesAbiUint40.From) {
    return BytesAbiUint40.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint40(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint40.nibbles

    const content = cursor.readOrThrow(BytesAbiUint40.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint40(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint40.bytes

    const content = cursor.readOrThrow(BytesAbiUint40.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint40(value)
  }

}

export namespace ZeroHexAbiUint40 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint40 {
  readonly #class = ZeroHexAbiUint40
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint40(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint40(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint40.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint40.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint40.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint40(value.slice(2))
    return ZeroHexAbiUint40.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint40.From) {
    return ZeroHexAbiUint40.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint40(cursor.readOrThrow(ZeroHexAbiUint40.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint40.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint40.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint40(value)
  }

}

export { AbiUint48 as Uint48 }
  
export type AbiUint48 =
  | ZeroHexAbiUint48
  | BytesAbiUint48

export namespace AbiUint48 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint48.From
    | BytesAbiUint48.From

  export function create(value: AbiUint48.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint48.create(value)
    return ZeroHexAbiUint48.create(value)
  }

  export function from(value: AbiUint48.From) {
    return AbiUint48.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint48.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint48.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int48`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint48.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint48.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint48 {
  export type From = Uint8Array
}

export class BytesAbiUint48 {
  readonly #class = BytesAbiUint48
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

  toNumber() {
    return new ZeroHexAbiUint48(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint48(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint48.From) {
    return new BytesAbiUint48(value)
  }

  static from(value: BytesAbiUint48.From) {
    return BytesAbiUint48.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint48(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint48.nibbles

    const content = cursor.readOrThrow(BytesAbiUint48.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint48(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint48.bytes

    const content = cursor.readOrThrow(BytesAbiUint48.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint48(value)
  }

}

export namespace ZeroHexAbiUint48 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint48 {
  readonly #class = ZeroHexAbiUint48
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint48(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint48(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint48.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint48.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint48.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint48(value.slice(2))
    return ZeroHexAbiUint48.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint48.From) {
    return ZeroHexAbiUint48.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint48(cursor.readOrThrow(ZeroHexAbiUint48.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint48.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint48.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint48(value)
  }

}

export { AbiUint56 as Uint56 }
  
export type AbiUint56 =
  | ZeroHexAbiUint56
  | BytesAbiUint56

export namespace AbiUint56 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint56.From
    | BytesAbiUint56.From

  export function create(value: AbiUint56.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint56.create(value)
    return ZeroHexAbiUint56.create(value)
  }

  export function from(value: AbiUint56.From) {
    return AbiUint56.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint56.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint56.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int56`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint56.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint56.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint56 {
  export type From = Uint8Array
}

export class BytesAbiUint56 {
  readonly #class = BytesAbiUint56
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

  toNumber() {
    return new ZeroHexAbiUint56(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint56(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint56.From) {
    return new BytesAbiUint56(value)
  }

  static from(value: BytesAbiUint56.From) {
    return BytesAbiUint56.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint56(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint56.nibbles

    const content = cursor.readOrThrow(BytesAbiUint56.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint56(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint56.bytes

    const content = cursor.readOrThrow(BytesAbiUint56.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint56(value)
  }

}

export namespace ZeroHexAbiUint56 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint56 {
  readonly #class = ZeroHexAbiUint56
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint56(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint56(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint56.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint56.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint56.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint56(value.slice(2))
    return ZeroHexAbiUint56.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint56.From) {
    return ZeroHexAbiUint56.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint56(cursor.readOrThrow(ZeroHexAbiUint56.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint56.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint56.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint56(value)
  }

}

export { AbiUint64 as Uint64 }
  
export type AbiUint64 =
  | ZeroHexAbiUint64
  | BytesAbiUint64

export namespace AbiUint64 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint64.From
    | BytesAbiUint64.From

  export function create(value: AbiUint64.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint64.create(value)
    return ZeroHexAbiUint64.create(value)
  }

  export function from(value: AbiUint64.From) {
    return AbiUint64.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint64.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint64.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int64`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint64.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint64.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint64 {
  export type From = Uint8Array
}

export class BytesAbiUint64 {
  readonly #class = BytesAbiUint64
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

  toNumber() {
    return new ZeroHexAbiUint64(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint64(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint64.From) {
    return new BytesAbiUint64(value)
  }

  static from(value: BytesAbiUint64.From) {
    return BytesAbiUint64.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint64(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint64.nibbles

    const content = cursor.readOrThrow(BytesAbiUint64.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint64(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint64.bytes

    const content = cursor.readOrThrow(BytesAbiUint64.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint64(value)
  }

}

export namespace ZeroHexAbiUint64 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint64 {
  readonly #class = ZeroHexAbiUint64
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint64(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint64(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint64.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint64.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint64.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint64(value.slice(2))
    return ZeroHexAbiUint64.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint64.From) {
    return ZeroHexAbiUint64.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint64(cursor.readOrThrow(ZeroHexAbiUint64.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint64.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint64.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint64(value)
  }

}

export { AbiUint72 as Uint72 }
  
export type AbiUint72 =
  | ZeroHexAbiUint72
  | BytesAbiUint72

export namespace AbiUint72 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint72.From
    | BytesAbiUint72.From

  export function create(value: AbiUint72.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint72.create(value)
    return ZeroHexAbiUint72.create(value)
  }

  export function from(value: AbiUint72.From) {
    return AbiUint72.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint72.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint72.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int72`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint72.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint72.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint72 {
  export type From = Uint8Array
}

export class BytesAbiUint72 {
  readonly #class = BytesAbiUint72
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

  toNumber() {
    return new ZeroHexAbiUint72(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint72(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint72.From) {
    return new BytesAbiUint72(value)
  }

  static from(value: BytesAbiUint72.From) {
    return BytesAbiUint72.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint72(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint72.nibbles

    const content = cursor.readOrThrow(BytesAbiUint72.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint72(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint72.bytes

    const content = cursor.readOrThrow(BytesAbiUint72.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint72(value)
  }

}

export namespace ZeroHexAbiUint72 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint72 {
  readonly #class = ZeroHexAbiUint72
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint72(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint72(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint72.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint72.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint72.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint72(value.slice(2))
    return ZeroHexAbiUint72.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint72.From) {
    return ZeroHexAbiUint72.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint72(cursor.readOrThrow(ZeroHexAbiUint72.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint72.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint72.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint72(value)
  }

}

export { AbiUint80 as Uint80 }
  
export type AbiUint80 =
  | ZeroHexAbiUint80
  | BytesAbiUint80

export namespace AbiUint80 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint80.From
    | BytesAbiUint80.From

  export function create(value: AbiUint80.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint80.create(value)
    return ZeroHexAbiUint80.create(value)
  }

  export function from(value: AbiUint80.From) {
    return AbiUint80.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint80.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint80.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int80`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint80.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint80.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint80 {
  export type From = Uint8Array
}

export class BytesAbiUint80 {
  readonly #class = BytesAbiUint80
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

  toNumber() {
    return new ZeroHexAbiUint80(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint80(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint80.From) {
    return new BytesAbiUint80(value)
  }

  static from(value: BytesAbiUint80.From) {
    return BytesAbiUint80.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint80(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint80.nibbles

    const content = cursor.readOrThrow(BytesAbiUint80.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint80(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint80.bytes

    const content = cursor.readOrThrow(BytesAbiUint80.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint80(value)
  }

}

export namespace ZeroHexAbiUint80 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint80 {
  readonly #class = ZeroHexAbiUint80
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint80(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint80(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint80.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint80.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint80.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint80(value.slice(2))
    return ZeroHexAbiUint80.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint80.From) {
    return ZeroHexAbiUint80.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint80(cursor.readOrThrow(ZeroHexAbiUint80.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint80.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint80.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint80(value)
  }

}

export { AbiUint88 as Uint88 }
  
export type AbiUint88 =
  | ZeroHexAbiUint88
  | BytesAbiUint88

export namespace AbiUint88 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint88.From
    | BytesAbiUint88.From

  export function create(value: AbiUint88.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint88.create(value)
    return ZeroHexAbiUint88.create(value)
  }

  export function from(value: AbiUint88.From) {
    return AbiUint88.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint88.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint88.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int88`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint88.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint88.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint88 {
  export type From = Uint8Array
}

export class BytesAbiUint88 {
  readonly #class = BytesAbiUint88
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

  toNumber() {
    return new ZeroHexAbiUint88(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint88(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint88.From) {
    return new BytesAbiUint88(value)
  }

  static from(value: BytesAbiUint88.From) {
    return BytesAbiUint88.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint88(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint88.nibbles

    const content = cursor.readOrThrow(BytesAbiUint88.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint88(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint88.bytes

    const content = cursor.readOrThrow(BytesAbiUint88.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint88(value)
  }

}

export namespace ZeroHexAbiUint88 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint88 {
  readonly #class = ZeroHexAbiUint88
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint88(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint88(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint88.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint88.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint88.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint88(value.slice(2))
    return ZeroHexAbiUint88.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint88.From) {
    return ZeroHexAbiUint88.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint88(cursor.readOrThrow(ZeroHexAbiUint88.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint88.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint88.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint88(value)
  }

}

export { AbiUint96 as Uint96 }
  
export type AbiUint96 =
  | ZeroHexAbiUint96
  | BytesAbiUint96

export namespace AbiUint96 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint96.From
    | BytesAbiUint96.From

  export function create(value: AbiUint96.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint96.create(value)
    return ZeroHexAbiUint96.create(value)
  }

  export function from(value: AbiUint96.From) {
    return AbiUint96.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint96.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint96.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int96`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint96.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint96.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint96 {
  export type From = Uint8Array
}

export class BytesAbiUint96 {
  readonly #class = BytesAbiUint96
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

  toNumber() {
    return new ZeroHexAbiUint96(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint96(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint96.From) {
    return new BytesAbiUint96(value)
  }

  static from(value: BytesAbiUint96.From) {
    return BytesAbiUint96.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint96(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint96.nibbles

    const content = cursor.readOrThrow(BytesAbiUint96.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint96(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint96.bytes

    const content = cursor.readOrThrow(BytesAbiUint96.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint96(value)
  }

}

export namespace ZeroHexAbiUint96 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint96 {
  readonly #class = ZeroHexAbiUint96
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint96(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint96(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint96.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint96.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint96.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint96(value.slice(2))
    return ZeroHexAbiUint96.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint96.From) {
    return ZeroHexAbiUint96.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint96(cursor.readOrThrow(ZeroHexAbiUint96.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint96.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint96.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint96(value)
  }

}

export { AbiUint104 as Uint104 }
  
export type AbiUint104 =
  | ZeroHexAbiUint104
  | BytesAbiUint104

export namespace AbiUint104 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint104.From
    | BytesAbiUint104.From

  export function create(value: AbiUint104.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint104.create(value)
    return ZeroHexAbiUint104.create(value)
  }

  export function from(value: AbiUint104.From) {
    return AbiUint104.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint104.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint104.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int104`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint104.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint104.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint104 {
  export type From = Uint8Array
}

export class BytesAbiUint104 {
  readonly #class = BytesAbiUint104
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

  toNumber() {
    return new ZeroHexAbiUint104(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint104(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint104.From) {
    return new BytesAbiUint104(value)
  }

  static from(value: BytesAbiUint104.From) {
    return BytesAbiUint104.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint104(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint104.nibbles

    const content = cursor.readOrThrow(BytesAbiUint104.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint104(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint104.bytes

    const content = cursor.readOrThrow(BytesAbiUint104.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint104(value)
  }

}

export namespace ZeroHexAbiUint104 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint104 {
  readonly #class = ZeroHexAbiUint104
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint104(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint104(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint104.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint104.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint104.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint104(value.slice(2))
    return ZeroHexAbiUint104.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint104.From) {
    return ZeroHexAbiUint104.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint104(cursor.readOrThrow(ZeroHexAbiUint104.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint104.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint104.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint104(value)
  }

}

export { AbiUint112 as Uint112 }
  
export type AbiUint112 =
  | ZeroHexAbiUint112
  | BytesAbiUint112

export namespace AbiUint112 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint112.From
    | BytesAbiUint112.From

  export function create(value: AbiUint112.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint112.create(value)
    return ZeroHexAbiUint112.create(value)
  }

  export function from(value: AbiUint112.From) {
    return AbiUint112.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint112.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint112.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int112`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint112.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint112.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint112 {
  export type From = Uint8Array
}

export class BytesAbiUint112 {
  readonly #class = BytesAbiUint112
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

  toNumber() {
    return new ZeroHexAbiUint112(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint112(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint112.From) {
    return new BytesAbiUint112(value)
  }

  static from(value: BytesAbiUint112.From) {
    return BytesAbiUint112.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint112(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint112.nibbles

    const content = cursor.readOrThrow(BytesAbiUint112.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint112(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint112.bytes

    const content = cursor.readOrThrow(BytesAbiUint112.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint112(value)
  }

}

export namespace ZeroHexAbiUint112 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint112 {
  readonly #class = ZeroHexAbiUint112
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint112(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint112(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint112.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint112.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint112.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint112(value.slice(2))
    return ZeroHexAbiUint112.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint112.From) {
    return ZeroHexAbiUint112.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint112(cursor.readOrThrow(ZeroHexAbiUint112.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint112.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint112.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint112(value)
  }

}

export { AbiUint120 as Uint120 }
  
export type AbiUint120 =
  | ZeroHexAbiUint120
  | BytesAbiUint120

export namespace AbiUint120 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint120.From
    | BytesAbiUint120.From

  export function create(value: AbiUint120.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint120.create(value)
    return ZeroHexAbiUint120.create(value)
  }

  export function from(value: AbiUint120.From) {
    return AbiUint120.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint120.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint120.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int120`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint120.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint120.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint120 {
  export type From = Uint8Array
}

export class BytesAbiUint120 {
  readonly #class = BytesAbiUint120
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

  toNumber() {
    return new ZeroHexAbiUint120(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint120(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint120.From) {
    return new BytesAbiUint120(value)
  }

  static from(value: BytesAbiUint120.From) {
    return BytesAbiUint120.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint120(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint120.nibbles

    const content = cursor.readOrThrow(BytesAbiUint120.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint120(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint120.bytes

    const content = cursor.readOrThrow(BytesAbiUint120.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint120(value)
  }

}

export namespace ZeroHexAbiUint120 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint120 {
  readonly #class = ZeroHexAbiUint120
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint120(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint120(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint120.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint120.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint120.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint120(value.slice(2))
    return ZeroHexAbiUint120.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint120.From) {
    return ZeroHexAbiUint120.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint120(cursor.readOrThrow(ZeroHexAbiUint120.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint120.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint120.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint120(value)
  }

}

export { AbiUint128 as Uint128 }
  
export type AbiUint128 =
  | ZeroHexAbiUint128
  | BytesAbiUint128

export namespace AbiUint128 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint128.From
    | BytesAbiUint128.From

  export function create(value: AbiUint128.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint128.create(value)
    return ZeroHexAbiUint128.create(value)
  }

  export function from(value: AbiUint128.From) {
    return AbiUint128.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint128.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint128.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int128`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint128.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint128.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint128 {
  export type From = Uint8Array
}

export class BytesAbiUint128 {
  readonly #class = BytesAbiUint128
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

  toNumber() {
    return new ZeroHexAbiUint128(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint128(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint128.From) {
    return new BytesAbiUint128(value)
  }

  static from(value: BytesAbiUint128.From) {
    return BytesAbiUint128.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint128(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint128.nibbles

    const content = cursor.readOrThrow(BytesAbiUint128.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint128(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint128.bytes

    const content = cursor.readOrThrow(BytesAbiUint128.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint128(value)
  }

}

export namespace ZeroHexAbiUint128 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint128 {
  readonly #class = ZeroHexAbiUint128
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint128(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint128(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint128.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint128.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint128.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint128(value.slice(2))
    return ZeroHexAbiUint128.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint128.From) {
    return ZeroHexAbiUint128.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint128(cursor.readOrThrow(ZeroHexAbiUint128.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint128.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint128.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint128(value)
  }

}

export { AbiUint136 as Uint136 }
  
export type AbiUint136 =
  | ZeroHexAbiUint136
  | BytesAbiUint136

export namespace AbiUint136 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint136.From
    | BytesAbiUint136.From

  export function create(value: AbiUint136.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint136.create(value)
    return ZeroHexAbiUint136.create(value)
  }

  export function from(value: AbiUint136.From) {
    return AbiUint136.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint136.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint136.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int136`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint136.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint136.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint136 {
  export type From = Uint8Array
}

export class BytesAbiUint136 {
  readonly #class = BytesAbiUint136
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

  toNumber() {
    return new ZeroHexAbiUint136(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint136(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint136.From) {
    return new BytesAbiUint136(value)
  }

  static from(value: BytesAbiUint136.From) {
    return BytesAbiUint136.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint136(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint136.nibbles

    const content = cursor.readOrThrow(BytesAbiUint136.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint136(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint136.bytes

    const content = cursor.readOrThrow(BytesAbiUint136.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint136(value)
  }

}

export namespace ZeroHexAbiUint136 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint136 {
  readonly #class = ZeroHexAbiUint136
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint136(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint136(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint136.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint136.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint136.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint136(value.slice(2))
    return ZeroHexAbiUint136.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint136.From) {
    return ZeroHexAbiUint136.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint136(cursor.readOrThrow(ZeroHexAbiUint136.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint136.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint136.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint136(value)
  }

}

export { AbiUint144 as Uint144 }
  
export type AbiUint144 =
  | ZeroHexAbiUint144
  | BytesAbiUint144

export namespace AbiUint144 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint144.From
    | BytesAbiUint144.From

  export function create(value: AbiUint144.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint144.create(value)
    return ZeroHexAbiUint144.create(value)
  }

  export function from(value: AbiUint144.From) {
    return AbiUint144.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint144.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint144.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int144`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint144.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint144.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint144 {
  export type From = Uint8Array
}

export class BytesAbiUint144 {
  readonly #class = BytesAbiUint144
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

  toNumber() {
    return new ZeroHexAbiUint144(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint144(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint144.From) {
    return new BytesAbiUint144(value)
  }

  static from(value: BytesAbiUint144.From) {
    return BytesAbiUint144.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint144(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint144.nibbles

    const content = cursor.readOrThrow(BytesAbiUint144.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint144(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint144.bytes

    const content = cursor.readOrThrow(BytesAbiUint144.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint144(value)
  }

}

export namespace ZeroHexAbiUint144 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint144 {
  readonly #class = ZeroHexAbiUint144
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint144(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint144(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint144.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint144.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint144.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint144(value.slice(2))
    return ZeroHexAbiUint144.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint144.From) {
    return ZeroHexAbiUint144.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint144(cursor.readOrThrow(ZeroHexAbiUint144.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint144.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint144.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint144(value)
  }

}

export { AbiUint152 as Uint152 }
  
export type AbiUint152 =
  | ZeroHexAbiUint152
  | BytesAbiUint152

export namespace AbiUint152 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint152.From
    | BytesAbiUint152.From

  export function create(value: AbiUint152.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint152.create(value)
    return ZeroHexAbiUint152.create(value)
  }

  export function from(value: AbiUint152.From) {
    return AbiUint152.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint152.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint152.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int152`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint152.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint152.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint152 {
  export type From = Uint8Array
}

export class BytesAbiUint152 {
  readonly #class = BytesAbiUint152
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

  toNumber() {
    return new ZeroHexAbiUint152(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint152(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint152.From) {
    return new BytesAbiUint152(value)
  }

  static from(value: BytesAbiUint152.From) {
    return BytesAbiUint152.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint152(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint152.nibbles

    const content = cursor.readOrThrow(BytesAbiUint152.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint152(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint152.bytes

    const content = cursor.readOrThrow(BytesAbiUint152.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint152(value)
  }

}

export namespace ZeroHexAbiUint152 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint152 {
  readonly #class = ZeroHexAbiUint152
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint152(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint152(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint152.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint152.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint152.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint152(value.slice(2))
    return ZeroHexAbiUint152.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint152.From) {
    return ZeroHexAbiUint152.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint152(cursor.readOrThrow(ZeroHexAbiUint152.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint152.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint152.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint152(value)
  }

}

export { AbiUint160 as Uint160 }
  
export type AbiUint160 =
  | ZeroHexAbiUint160
  | BytesAbiUint160

export namespace AbiUint160 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint160.From
    | BytesAbiUint160.From

  export function create(value: AbiUint160.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint160.create(value)
    return ZeroHexAbiUint160.create(value)
  }

  export function from(value: AbiUint160.From) {
    return AbiUint160.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint160.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint160.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int160`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint160.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint160.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint160 {
  export type From = Uint8Array
}

export class BytesAbiUint160 {
  readonly #class = BytesAbiUint160
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

  toNumber() {
    return new ZeroHexAbiUint160(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint160(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint160.From) {
    return new BytesAbiUint160(value)
  }

  static from(value: BytesAbiUint160.From) {
    return BytesAbiUint160.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint160(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint160.nibbles

    const content = cursor.readOrThrow(BytesAbiUint160.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint160(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint160.bytes

    const content = cursor.readOrThrow(BytesAbiUint160.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint160(value)
  }

}

export namespace ZeroHexAbiUint160 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint160 {
  readonly #class = ZeroHexAbiUint160
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint160(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint160(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint160.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint160.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint160.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint160(value.slice(2))
    return ZeroHexAbiUint160.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint160.From) {
    return ZeroHexAbiUint160.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint160(cursor.readOrThrow(ZeroHexAbiUint160.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint160.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint160.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint160(value)
  }

}

export { AbiUint168 as Uint168 }
  
export type AbiUint168 =
  | ZeroHexAbiUint168
  | BytesAbiUint168

export namespace AbiUint168 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint168.From
    | BytesAbiUint168.From

  export function create(value: AbiUint168.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint168.create(value)
    return ZeroHexAbiUint168.create(value)
  }

  export function from(value: AbiUint168.From) {
    return AbiUint168.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint168.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint168.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int168`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint168.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint168.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint168 {
  export type From = Uint8Array
}

export class BytesAbiUint168 {
  readonly #class = BytesAbiUint168
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

  toNumber() {
    return new ZeroHexAbiUint168(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint168(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint168.From) {
    return new BytesAbiUint168(value)
  }

  static from(value: BytesAbiUint168.From) {
    return BytesAbiUint168.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint168(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint168.nibbles

    const content = cursor.readOrThrow(BytesAbiUint168.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint168(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint168.bytes

    const content = cursor.readOrThrow(BytesAbiUint168.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint168(value)
  }

}

export namespace ZeroHexAbiUint168 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint168 {
  readonly #class = ZeroHexAbiUint168
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint168(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint168(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint168.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint168.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint168.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint168(value.slice(2))
    return ZeroHexAbiUint168.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint168.From) {
    return ZeroHexAbiUint168.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint168(cursor.readOrThrow(ZeroHexAbiUint168.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint168.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint168.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint168(value)
  }

}

export { AbiUint176 as Uint176 }
  
export type AbiUint176 =
  | ZeroHexAbiUint176
  | BytesAbiUint176

export namespace AbiUint176 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint176.From
    | BytesAbiUint176.From

  export function create(value: AbiUint176.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint176.create(value)
    return ZeroHexAbiUint176.create(value)
  }

  export function from(value: AbiUint176.From) {
    return AbiUint176.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint176.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint176.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int176`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint176.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint176.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint176 {
  export type From = Uint8Array
}

export class BytesAbiUint176 {
  readonly #class = BytesAbiUint176
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

  toNumber() {
    return new ZeroHexAbiUint176(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint176(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint176.From) {
    return new BytesAbiUint176(value)
  }

  static from(value: BytesAbiUint176.From) {
    return BytesAbiUint176.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint176(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint176.nibbles

    const content = cursor.readOrThrow(BytesAbiUint176.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint176(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint176.bytes

    const content = cursor.readOrThrow(BytesAbiUint176.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint176(value)
  }

}

export namespace ZeroHexAbiUint176 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint176 {
  readonly #class = ZeroHexAbiUint176
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint176(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint176(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint176.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint176.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint176.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint176(value.slice(2))
    return ZeroHexAbiUint176.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint176.From) {
    return ZeroHexAbiUint176.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint176(cursor.readOrThrow(ZeroHexAbiUint176.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint176.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint176.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint176(value)
  }

}

export { AbiUint184 as Uint184 }
  
export type AbiUint184 =
  | ZeroHexAbiUint184
  | BytesAbiUint184

export namespace AbiUint184 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint184.From
    | BytesAbiUint184.From

  export function create(value: AbiUint184.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint184.create(value)
    return ZeroHexAbiUint184.create(value)
  }

  export function from(value: AbiUint184.From) {
    return AbiUint184.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint184.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint184.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int184`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint184.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint184.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint184 {
  export type From = Uint8Array
}

export class BytesAbiUint184 {
  readonly #class = BytesAbiUint184
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

  toNumber() {
    return new ZeroHexAbiUint184(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint184(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint184.From) {
    return new BytesAbiUint184(value)
  }

  static from(value: BytesAbiUint184.From) {
    return BytesAbiUint184.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint184(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint184.nibbles

    const content = cursor.readOrThrow(BytesAbiUint184.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint184(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint184.bytes

    const content = cursor.readOrThrow(BytesAbiUint184.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint184(value)
  }

}

export namespace ZeroHexAbiUint184 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint184 {
  readonly #class = ZeroHexAbiUint184
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint184(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint184(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint184.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint184.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint184.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint184(value.slice(2))
    return ZeroHexAbiUint184.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint184.From) {
    return ZeroHexAbiUint184.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint184(cursor.readOrThrow(ZeroHexAbiUint184.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint184.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint184.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint184(value)
  }

}

export { AbiUint192 as Uint192 }
  
export type AbiUint192 =
  | ZeroHexAbiUint192
  | BytesAbiUint192

export namespace AbiUint192 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint192.From
    | BytesAbiUint192.From

  export function create(value: AbiUint192.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint192.create(value)
    return ZeroHexAbiUint192.create(value)
  }

  export function from(value: AbiUint192.From) {
    return AbiUint192.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint192.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint192.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int192`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint192.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint192.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint192 {
  export type From = Uint8Array
}

export class BytesAbiUint192 {
  readonly #class = BytesAbiUint192
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

  toNumber() {
    return new ZeroHexAbiUint192(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint192(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint192.From) {
    return new BytesAbiUint192(value)
  }

  static from(value: BytesAbiUint192.From) {
    return BytesAbiUint192.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint192(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint192.nibbles

    const content = cursor.readOrThrow(BytesAbiUint192.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint192(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint192.bytes

    const content = cursor.readOrThrow(BytesAbiUint192.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint192(value)
  }

}

export namespace ZeroHexAbiUint192 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint192 {
  readonly #class = ZeroHexAbiUint192
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint192(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint192(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint192.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint192.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint192.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint192(value.slice(2))
    return ZeroHexAbiUint192.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint192.From) {
    return ZeroHexAbiUint192.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint192(cursor.readOrThrow(ZeroHexAbiUint192.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint192.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint192.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint192(value)
  }

}

export { AbiUint200 as Uint200 }
  
export type AbiUint200 =
  | ZeroHexAbiUint200
  | BytesAbiUint200

export namespace AbiUint200 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint200.From
    | BytesAbiUint200.From

  export function create(value: AbiUint200.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint200.create(value)
    return ZeroHexAbiUint200.create(value)
  }

  export function from(value: AbiUint200.From) {
    return AbiUint200.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint200.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint200.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int200`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint200.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint200.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint200 {
  export type From = Uint8Array
}

export class BytesAbiUint200 {
  readonly #class = BytesAbiUint200
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

  toNumber() {
    return new ZeroHexAbiUint200(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint200(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint200.From) {
    return new BytesAbiUint200(value)
  }

  static from(value: BytesAbiUint200.From) {
    return BytesAbiUint200.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint200(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint200.nibbles

    const content = cursor.readOrThrow(BytesAbiUint200.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint200(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint200.bytes

    const content = cursor.readOrThrow(BytesAbiUint200.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint200(value)
  }

}

export namespace ZeroHexAbiUint200 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint200 {
  readonly #class = ZeroHexAbiUint200
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint200(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint200(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint200.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint200.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint200.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint200(value.slice(2))
    return ZeroHexAbiUint200.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint200.From) {
    return ZeroHexAbiUint200.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint200(cursor.readOrThrow(ZeroHexAbiUint200.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint200.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint200.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint200(value)
  }

}

export { AbiUint208 as Uint208 }
  
export type AbiUint208 =
  | ZeroHexAbiUint208
  | BytesAbiUint208

export namespace AbiUint208 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint208.From
    | BytesAbiUint208.From

  export function create(value: AbiUint208.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint208.create(value)
    return ZeroHexAbiUint208.create(value)
  }

  export function from(value: AbiUint208.From) {
    return AbiUint208.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint208.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint208.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int208`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint208.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint208.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint208 {
  export type From = Uint8Array
}

export class BytesAbiUint208 {
  readonly #class = BytesAbiUint208
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

  toNumber() {
    return new ZeroHexAbiUint208(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint208(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint208.From) {
    return new BytesAbiUint208(value)
  }

  static from(value: BytesAbiUint208.From) {
    return BytesAbiUint208.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint208(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint208.nibbles

    const content = cursor.readOrThrow(BytesAbiUint208.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint208(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint208.bytes

    const content = cursor.readOrThrow(BytesAbiUint208.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint208(value)
  }

}

export namespace ZeroHexAbiUint208 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint208 {
  readonly #class = ZeroHexAbiUint208
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint208(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint208(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint208.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint208.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint208.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint208(value.slice(2))
    return ZeroHexAbiUint208.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint208.From) {
    return ZeroHexAbiUint208.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint208(cursor.readOrThrow(ZeroHexAbiUint208.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint208.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint208.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint208(value)
  }

}

export { AbiUint216 as Uint216 }
  
export type AbiUint216 =
  | ZeroHexAbiUint216
  | BytesAbiUint216

export namespace AbiUint216 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint216.From
    | BytesAbiUint216.From

  export function create(value: AbiUint216.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint216.create(value)
    return ZeroHexAbiUint216.create(value)
  }

  export function from(value: AbiUint216.From) {
    return AbiUint216.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint216.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint216.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int216`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint216.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint216.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint216 {
  export type From = Uint8Array
}

export class BytesAbiUint216 {
  readonly #class = BytesAbiUint216
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

  toNumber() {
    return new ZeroHexAbiUint216(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint216(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint216.From) {
    return new BytesAbiUint216(value)
  }

  static from(value: BytesAbiUint216.From) {
    return BytesAbiUint216.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint216(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint216.nibbles

    const content = cursor.readOrThrow(BytesAbiUint216.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint216(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint216.bytes

    const content = cursor.readOrThrow(BytesAbiUint216.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint216(value)
  }

}

export namespace ZeroHexAbiUint216 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint216 {
  readonly #class = ZeroHexAbiUint216
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint216(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint216(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint216.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint216.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint216.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint216(value.slice(2))
    return ZeroHexAbiUint216.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint216.From) {
    return ZeroHexAbiUint216.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint216(cursor.readOrThrow(ZeroHexAbiUint216.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint216.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint216.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint216(value)
  }

}

export { AbiUint224 as Uint224 }
  
export type AbiUint224 =
  | ZeroHexAbiUint224
  | BytesAbiUint224

export namespace AbiUint224 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint224.From
    | BytesAbiUint224.From

  export function create(value: AbiUint224.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint224.create(value)
    return ZeroHexAbiUint224.create(value)
  }

  export function from(value: AbiUint224.From) {
    return AbiUint224.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint224.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint224.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int224`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint224.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint224.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint224 {
  export type From = Uint8Array
}

export class BytesAbiUint224 {
  readonly #class = BytesAbiUint224
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

  toNumber() {
    return new ZeroHexAbiUint224(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint224(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint224.From) {
    return new BytesAbiUint224(value)
  }

  static from(value: BytesAbiUint224.From) {
    return BytesAbiUint224.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint224(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint224.nibbles

    const content = cursor.readOrThrow(BytesAbiUint224.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint224(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint224.bytes

    const content = cursor.readOrThrow(BytesAbiUint224.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint224(value)
  }

}

export namespace ZeroHexAbiUint224 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint224 {
  readonly #class = ZeroHexAbiUint224
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint224(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint224(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint224.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint224.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint224.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint224(value.slice(2))
    return ZeroHexAbiUint224.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint224.From) {
    return ZeroHexAbiUint224.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint224(cursor.readOrThrow(ZeroHexAbiUint224.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint224.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint224.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint224(value)
  }

}

export { AbiUint232 as Uint232 }
  
export type AbiUint232 =
  | ZeroHexAbiUint232
  | BytesAbiUint232

export namespace AbiUint232 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint232.From
    | BytesAbiUint232.From

  export function create(value: AbiUint232.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint232.create(value)
    return ZeroHexAbiUint232.create(value)
  }

  export function from(value: AbiUint232.From) {
    return AbiUint232.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint232.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint232.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int232`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint232.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint232.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint232 {
  export type From = Uint8Array
}

export class BytesAbiUint232 {
  readonly #class = BytesAbiUint232
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

  toNumber() {
    return new ZeroHexAbiUint232(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint232(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint232.From) {
    return new BytesAbiUint232(value)
  }

  static from(value: BytesAbiUint232.From) {
    return BytesAbiUint232.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint232(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint232.nibbles

    const content = cursor.readOrThrow(BytesAbiUint232.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint232(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint232.bytes

    const content = cursor.readOrThrow(BytesAbiUint232.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint232(value)
  }

}

export namespace ZeroHexAbiUint232 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint232 {
  readonly #class = ZeroHexAbiUint232
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint232(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint232(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint232.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint232.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint232.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint232(value.slice(2))
    return ZeroHexAbiUint232.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint232.From) {
    return ZeroHexAbiUint232.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint232(cursor.readOrThrow(ZeroHexAbiUint232.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint232.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint232.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint232(value)
  }

}

export { AbiUint240 as Uint240 }
  
export type AbiUint240 =
  | ZeroHexAbiUint240
  | BytesAbiUint240

export namespace AbiUint240 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint240.From
    | BytesAbiUint240.From

  export function create(value: AbiUint240.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint240.create(value)
    return ZeroHexAbiUint240.create(value)
  }

  export function from(value: AbiUint240.From) {
    return AbiUint240.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint240.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint240.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int240`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint240.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint240.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint240 {
  export type From = Uint8Array
}

export class BytesAbiUint240 {
  readonly #class = BytesAbiUint240
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

  toNumber() {
    return new ZeroHexAbiUint240(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint240(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint240.From) {
    return new BytesAbiUint240(value)
  }

  static from(value: BytesAbiUint240.From) {
    return BytesAbiUint240.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint240(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint240.nibbles

    const content = cursor.readOrThrow(BytesAbiUint240.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint240(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint240.bytes

    const content = cursor.readOrThrow(BytesAbiUint240.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint240(value)
  }

}

export namespace ZeroHexAbiUint240 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint240 {
  readonly #class = ZeroHexAbiUint240
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint240(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint240(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint240.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint240.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint240.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint240(value.slice(2))
    return ZeroHexAbiUint240.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint240.From) {
    return ZeroHexAbiUint240.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint240(cursor.readOrThrow(ZeroHexAbiUint240.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint240.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint240.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint240(value)
  }

}

export { AbiUint248 as Uint248 }
  
export type AbiUint248 =
  | ZeroHexAbiUint248
  | BytesAbiUint248

export namespace AbiUint248 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint248.From
    | BytesAbiUint248.From

  export function create(value: AbiUint248.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint248.create(value)
    return ZeroHexAbiUint248.create(value)
  }

  export function from(value: AbiUint248.From) {
    return AbiUint248.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint248.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint248.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int248`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint248.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint248.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint248 {
  export type From = Uint8Array
}

export class BytesAbiUint248 {
  readonly #class = BytesAbiUint248
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

  toNumber() {
    return new ZeroHexAbiUint248(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint248(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint248.From) {
    return new BytesAbiUint248(value)
  }

  static from(value: BytesAbiUint248.From) {
    return BytesAbiUint248.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint248(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint248.nibbles

    const content = cursor.readOrThrow(BytesAbiUint248.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint248(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint248.bytes

    const content = cursor.readOrThrow(BytesAbiUint248.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint248(value)
  }

}

export namespace ZeroHexAbiUint248 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint248 {
  readonly #class = ZeroHexAbiUint248
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint248(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint248(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint248.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint248.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint248.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint248(value.slice(2))
    return ZeroHexAbiUint248.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint248.From) {
    return ZeroHexAbiUint248.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint248(cursor.readOrThrow(ZeroHexAbiUint248.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint248.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint248.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint248(value)
  }

}

export { AbiUint256 as Uint256 }
  
export type AbiUint256 =
  | ZeroHexAbiUint256
  | BytesAbiUint256

export namespace AbiUint256 {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiUint256.From
    | BytesAbiUint256.From

  export function create(value: AbiUint256.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint256.create(value)
    return ZeroHexAbiUint256.create(value)
  }

  export function from(value: AbiUint256.From) {
    return AbiUint256.create(value)
  }

  export function fromNumber(value: number) {
    return ZeroHexAbiUint256.fromNumber(value)
  }

  export function fromBigInt(value: bigint) {
    return ZeroHexAbiUint256.fromBigInt(value)
  }

  export function codegen() {
    return `Abi.Int256`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiUint256.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiUint256.readOrThrow(cursor)
  }

}

export namespace BytesAbiUint256 {
  export type From = Uint8Array
}

export class BytesAbiUint256 {
  readonly #class = BytesAbiUint256
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

  toNumber() {
    return new ZeroHexAbiUint256(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexAbiUint256(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesAbiUint256.From) {
    return new BytesAbiUint256(value)
  }

  static from(value: BytesAbiUint256.From) {
    return BytesAbiUint256.create(value)
  }

  intoOrThrow() {
    return new ZeroHexAbiUint256(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesAbiUint256.nibbles

    const content = cursor.readOrThrow(BytesAbiUint256.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiUint256(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint256.bytes

    const content = cursor.readOrThrow(BytesAbiUint256.bytes)
    const value = Bytes.from(content)

    return new BytesAbiUint256(value)
  }

}

export namespace ZeroHexAbiUint256 {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiUint256 {
  readonly #class = ZeroHexAbiUint256
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

  static fromNumber(value: number) {
    return new ZeroHexAbiUint256(value.toString(16))
  }

  static fromBigInt(value: bigint) {
    return new ZeroHexAbiUint256(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexAbiUint256.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiUint256.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiUint256.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiUint256(value.slice(2))
    return ZeroHexAbiUint256.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiUint256.From) {
    return ZeroHexAbiUint256.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
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
    return new ZeroHexAbiUint256(cursor.readOrThrow(ZeroHexAbiUint256.nibbles))
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
    cursor.offset += 32 - ZeroHexAbiUint256.bytes

    const content = cursor.readOrThrow(ZeroHexAbiUint256.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiUint256(value)
  }

}

export type UintByName = {
    uint8: typeof AbiUint8,
    uint16: typeof AbiUint16,
    uint24: typeof AbiUint24,
    uint32: typeof AbiUint32,
    uint40: typeof AbiUint40,
    uint48: typeof AbiUint48,
    uint56: typeof AbiUint56,
    uint64: typeof AbiUint64,
    uint72: typeof AbiUint72,
    uint80: typeof AbiUint80,
    uint88: typeof AbiUint88,
    uint96: typeof AbiUint96,
    uint104: typeof AbiUint104,
    uint112: typeof AbiUint112,
    uint120: typeof AbiUint120,
    uint128: typeof AbiUint128,
    uint136: typeof AbiUint136,
    uint144: typeof AbiUint144,
    uint152: typeof AbiUint152,
    uint160: typeof AbiUint160,
    uint168: typeof AbiUint168,
    uint176: typeof AbiUint176,
    uint184: typeof AbiUint184,
    uint192: typeof AbiUint192,
    uint200: typeof AbiUint200,
    uint208: typeof AbiUint208,
    uint216: typeof AbiUint216,
    uint224: typeof AbiUint224,
    uint232: typeof AbiUint232,
    uint240: typeof AbiUint240,
    uint248: typeof AbiUint248,
    uint256: typeof AbiUint256,
  }
  
  export const uintByName: UintByName = {
    uint8: AbiUint8,
    uint16: AbiUint16,
    uint24: AbiUint24,
    uint32: AbiUint32,
    uint40: AbiUint40,
    uint48: AbiUint48,
    uint56: AbiUint56,
    uint64: AbiUint64,
    uint72: AbiUint72,
    uint80: AbiUint80,
    uint88: AbiUint88,
    uint96: AbiUint96,
    uint104: AbiUint104,
    uint112: AbiUint112,
    uint120: AbiUint120,
    uint128: AbiUint128,
    uint136: AbiUint136,
    uint144: AbiUint144,
    uint152: AbiUint152,
    uint160: AbiUint160,
    uint168: AbiUint168,
    uint176: AbiUint176,
    uint184: AbiUint184,
    uint192: AbiUint192,
    uint200: AbiUint200,
    uint208: AbiUint208,
    uint216: AbiUint216,
    uint224: AbiUint224,
    uint232: AbiUint232,
    uint240: AbiUint240,
    uint248: AbiUint248,
    uint256: AbiUint256,
  }