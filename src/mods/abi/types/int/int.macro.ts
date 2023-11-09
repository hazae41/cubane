function $pre$() {
  return `import { Cursor } from "@hazae41/cursor";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { Bytes } from "@hazae41/bytes";
import { Base16 } from "@hazae41/base16";
import { ZeroHexString } from "mods/types/zerohex/index.js";
import { RawHexString } from "mods/types/rawhex/index.js";
  
const BN_0 = 0n
const BN_1 = 1n`
}

$pre$()

function $createStaticBigInt$(bytes: number) {
  const nibbles = bytes * 2
  const bits = bytes * 8

  return `export type StaticInt${bits} =
  | ZeroHexStaticInt${bits}
  | BytesStaticInt${bits}

export namespace StaticInt${bits} {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticInt${bits}.From
    | BytesStaticInt${bits}.From

  export function create(value: StaticInt${bits}.From) {
    if (value instanceof Uint8Array)
      return BytesStaticInt${bits}.create(value)
    return ZeroHexStaticInt${bits}.create(value)
  }

  export function from(value: StaticInt${bits}.From) {
    return StaticInt${bits}.create(value)
  }

  export function codegen() {
    return \`Cubane.Abi.Int${bits}\`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticInt${bits}.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticInt${bits}.readOrThrow(cursor)
  }

}

export namespace BytesStaticInt${bits} {
  export type From = Uint8Array
}

export class BytesStaticInt${bits} {
  readonly #class = BytesStaticInt${bits}
  readonly name = this.#class.name

  static readonly bytes = ${bytes}
  static readonly nibbles = ${nibbles}
  static readonly bits = ${bits}
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

  static create(value: BytesStaticInt${bits}.From) {
    return new BytesStaticInt${bits}(value)
  }

  static from(value: BytesStaticInt${bits}.From) {
    return BytesStaticInt${bits}.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticInt${bits}(this.encodePackedOrThrow()).intoOrThrow()
  }

  static codegen() {
    return \`Cubane.Abi.Int${bits}\`
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
    cursor.offset += 64 - BytesStaticInt${bits}.nibbles

    const content = cursor.readOrThrow(BytesStaticInt${bits}.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticInt${bits}(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesStaticInt${bits}.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticInt${bits}.bytes

    const content = cursor.readOrThrow(BytesStaticInt${bits}.bytes)
    const value = Bytes.from(content)

    return new BytesStaticInt${bits}(value)
  }

}

export namespace ZeroHexStaticInt${bits} {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexStaticInt${bits} {
  readonly #class = ZeroHexStaticInt${bits}
  readonly name = this.#class.name

  static readonly bytes = ${bytes}
  static readonly nibbles = ${nibbles}
  static readonly bits = ${bits}
  static readonly bitsn = BigInt(${bits})
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
    return ZeroHexStaticInt${bits}.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexStaticInt${bits}(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexStaticInt${bits}(value2.toString(16))
  }

  toBigInt() {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHexSafe(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  static create(value: ZeroHexStaticInt${bits}.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticInt${bits}.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticInt${bits}.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexStaticInt${bits}(value.slice(2))
    return ZeroHexStaticInt${bits}.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexStaticInt${bits}.From) {
    return ZeroHexStaticInt${bits}.create(value)
  }

  intoOrThrow() {
    return this.toBigInt()
  }

  static codegen() {
    return \`Cubane.Abi.Int${bits}\`
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
    return new ZeroHexStaticInt${bits}(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexStaticInt${bits}.bytes

    const content = cursor.readOrThrow(ZeroHexStaticInt${bits}.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticInt${bits}(value)
  }

}`
}

$createStaticBigInt$(1)

$createStaticBigInt$(2)

$createStaticBigInt$(3)

$createStaticBigInt$(4)

$createStaticBigInt$(5)

$createStaticBigInt$(6)

$createStaticBigInt$(7)

$createStaticBigInt$(8)

$createStaticBigInt$(9)

$createStaticBigInt$(10)

$createStaticBigInt$(11)

$createStaticBigInt$(12)

$createStaticBigInt$(13)

$createStaticBigInt$(14)

$createStaticBigInt$(15)

$createStaticBigInt$(16)

$createStaticBigInt$(17)

$createStaticBigInt$(18)

$createStaticBigInt$(19)

$createStaticBigInt$(20)

$createStaticBigInt$(21)

$createStaticBigInt$(22)

$createStaticBigInt$(23)

$createStaticBigInt$(24)

$createStaticBigInt$(25)

$createStaticBigInt$(26)

$createStaticBigInt$(27)

$createStaticBigInt$(28)

$createStaticBigInt$(29)

$createStaticBigInt$(30)

$createStaticBigInt$(31)

$createStaticBigInt$(32)

function $post$() {
  return `export type IntByName = {
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
  }`
}

$post$()