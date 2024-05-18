function $pre$() {
  return `import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { RawHexAsInteger } from "mods/types/helpers/generic.js";
import { RawHexString, ZeroHexString } from "mods/types/string/index.js";
  
const BN_0 = 0n
const BN_1 = 1n`
}

$pre$()

function $createInt$(bytes: number) {
  const nibbles = bytes * 2
  const bits = bytes * 8

  return `export { AbiInt${bits} as Int${bits}, BytesAbiInt${bits} as BytesInt${bits}, RawHexAbiInt${bits} as RawHexInt${bits} }
  
export type AbiInt${bits} =
  | RawHexAbiInt${bits}
  | BytesAbiInt${bits}

export namespace AbiInt${bits} {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt${bits}.Create
    | RawHexAbiInt${bits}.Create

  export type From = 
    | BytesAbiInt${bits}.From
    | RawHexAbiInt${bits}.From

  export function create(value: AbiInt${bits}.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt${bits}.create(value)
    return RawHexAbiInt${bits}.create(value)
  }

  export function fromOrThrow(value: AbiInt${bits}.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt${bits}.fromOrThrow(value)
    return RawHexAbiInt${bits}.fromOrThrow(value)
  }

  export function codegen() {
    return \`Abi.Int${bits}\`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt${bits}.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt${bits}.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt${bits} {

  export type Create = Uint8Array

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

  static create(value: BytesAbiInt${bits}.Create) {
    return new BytesAbiInt${bits}(value)
  }

  static fromOrThrow(value: BytesAbiInt${bits}.From) {
    return new BytesAbiInt${bits}(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt${bits}(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt${bits}(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return \`Abi.Int${bits}\`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().encodeOrThrow(this.value) as RawHexString
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

    const content = cursor.readAndCopyOrThrow(BytesAbiInt${bits}.bytes)

    return new BytesAbiInt${bits}(content)
  }

}

export namespace RawHexAbiInt${bits} {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt${bits} {
  readonly #class = RawHexAbiInt${bits}

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

  static create(value: RawHexAbiInt${bits}.Create) {
    return new RawHexAbiInt${bits}(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0) 
      return new RawHexAbiInt${bits}(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt${bits}(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt${bits}.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt${bits}.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt${bits}(Base16.get().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt${bits}.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt${bits}.fromNumberOrThrow(value)
    if (ZeroHexString.String.is(value))
      return new RawHexAbiInt${bits}(value.slice(2) as RawHexString)
    return RawHexAbiInt${bits}.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
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
    return new RawHexAbiInt${bits}(cursor.readOrThrow(64))
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
    cursor.offset += 32 - RawHexAbiInt${bits}.bytes

    const content = cursor.readOrThrow(RawHexAbiInt${bits}.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new RawHexAbiInt${bits}(value as RawHexString)
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