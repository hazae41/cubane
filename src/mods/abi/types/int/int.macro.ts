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

function $createInt$(bytes: number) {
  const nibbles = bytes * 2
  const bits = bytes * 8

  return `export { AbiInt${bits} as Int${bits} }
  
export type AbiInt${bits} =
  | ZeroHexAbiInt${bits}
  | BytesAbiInt${bits}

export namespace AbiInt${bits} {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexAbiInt${bits}.From
    | BytesAbiInt${bits}.From

  export function create(value: AbiInt${bits}.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt${bits}.create(value)
    return ZeroHexAbiInt${bits}.create(value)
  }

  export function from(value: AbiInt${bits}.From) {
    return AbiInt${bits}.create(value)
  }

  export function codegen() {
    return \`Abi.Int${bits}\`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiInt${bits}.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt${bits}.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt${bits} {
  export type From = Uint8Array
}

export class BytesAbiInt${bits} {
  readonly #class = BytesAbiInt${bits}

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

  static create(value: BytesAbiInt${bits}.From) {
    return new BytesAbiInt${bits}(value)
  }

  static from(value: BytesAbiInt${bits}.From) {
    return BytesAbiInt${bits}.create(value)
  }

  intoOrThrow(): bigint {
    return new ZeroHexAbiInt${bits}(this.encodePackedOrThrow()).intoOrThrow()
  }

  toJSON(): string {
    return new ZeroHexAbiInt${bits}(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return \`Abi.Int${bits}\`
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
    cursor.offset += 64 - BytesAbiInt${bits}.nibbles

    const content = cursor.readOrThrow(BytesAbiInt${bits}.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesAbiInt${bits}(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt${bits}.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt${bits}.bytes

    const content = cursor.readOrThrow(BytesAbiInt${bits}.bytes)
    const value = Bytes.from(content)

    return new BytesAbiInt${bits}(value)
  }

}

export namespace ZeroHexAbiInt${bits} {
  export type From =
    | ZeroHexString
    | bigint
    | number
    | string
}

export class ZeroHexAbiInt${bits} {
  readonly #class = ZeroHexAbiInt${bits}

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
    return ZeroHexAbiInt${bits}.fromBigInt(BigInt(value))
  }

  static fromBigInt(value: bigint) {
    if (value >= BN_0) 
      return new ZeroHexAbiInt${bits}(value.toString(16))

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new ZeroHexAbiInt${bits}(value2.toString(16))
  }

  static create(value: ZeroHexAbiInt${bits}.From) {
    if (typeof value === "bigint")
      return ZeroHexAbiInt${bits}.fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexAbiInt${bits}.fromNumber(value)
    if (value.startsWith("0x"))
      return new ZeroHexAbiInt${bits}(value.slice(2))
    return ZeroHexAbiInt${bits}.fromBigInt(BigInt(value))
  }

  static from(value: ZeroHexAbiInt${bits}.From) {
    return ZeroHexAbiInt${bits}.create(value)
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRaw(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return \`Abi.Int${bits}\`
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
    return new ZeroHexAbiInt${bits}(cursor.readOrThrow(64))
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
    cursor.offset += 32 - ZeroHexAbiInt${bits}.bytes

    const content = cursor.readOrThrow(ZeroHexAbiInt${bits}.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexAbiInt${bits}(value)
  }

}`
}

$createInt$(1)

$createInt$(2)

$createInt$(3)

$createInt$(4)

$createInt$(5)

$createInt$(6)

$createInt$(7)

$createInt$(8)

$createInt$(9)

$createInt$(10)

$createInt$(11)

$createInt$(12)

$createInt$(13)

$createInt$(14)

$createInt$(15)

$createInt$(16)

$createInt$(17)

$createInt$(18)

$createInt$(19)

$createInt$(20)

$createInt$(21)

$createInt$(22)

$createInt$(23)

$createInt$(24)

$createInt$(25)

$createInt$(26)

$createInt$(27)

$createInt$(28)

$createInt$(29)

$createInt$(30)

$createInt$(31)

$createInt$(32)

function $post$() {
  return `export type IntByName = {
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
  }`
}

$post$()