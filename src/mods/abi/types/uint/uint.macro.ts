function $pre$() {
  return `import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesAsInteger, NumberAsInteger, RawHexAsInteger } from "mods/types/helpers/generic.js";
import { RawHexString } from "@hazae41/hex";`
}

$pre$()

function $createUint$(bytes: number) {
  const nibbles = bytes * 2
  const bits = bytes * 8

  const numberable = bits <= 32

  return `export { AbiUint${bits} as Uint${bits}, BytesAbiUint${bits} as BytesUint${bits}, RawHexAbiUint${bits} as RawHexUint${bits}${numberable ? `, NumberAbiUint${bits} as NumberUint${bits}` : ``} }
  
export type AbiUint${bits} =
  | RawHexAbiUint${bits}
  | BytesAbiUint${bits}
  ${numberable ? `| NumberAbiUint${bits}` : ``}

export namespace AbiUint${bits} {
  export const dynamic = false
  export const size = 32

  export type Create =
    | RawHexAbiUint${bits}.Create
    | BytesAbiUint${bits}.Create
    ${numberable ? `| NumberAbiUint${bits}.Create` : ``}  

  export type From = 
    | RawHexAbiUint${bits}.From
    | BytesAbiUint${bits}.From
    ${numberable ? `| NumberAbiUint${bits}.From` : ``}

  export function create(value: AbiUint${bits}.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiUint${bits}.create(value)
    ${numberable ? `if (typeof value === "number")
      return NumberAbiUint${bits}.create(value)
    if (typeof value === "bigint")
      return NumberAbiUint${bits}.create(value)` : ``}
    return RawHexAbiUint${bits}.create(value)
  }

  export function fromOrThrow(value: AbiUint${bits}.From) {
    if (value instanceof Uint8Array)
      return BytesAbiUint${bits}.fromOrThrow(value)
    ${numberable ? `if (typeof value === "number")
      return NumberAbiUint${bits}.fromOrThrow(value)
    if (typeof value === "bigint")
      return NumberAbiUint${bits}.fromOrThrow(value)` : ``}
    return RawHexAbiUint${bits}.fromOrThrow(value)
  }

  export function codegen() {
    return \`Abi.Int${bits}\`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    ${numberable
      ? `return NumberAbiUint${bits}.decodeOrThrow(cursor)`
      : `return RawHexAbiUint${bits}.decodeOrThrow(cursor)`}
  }

  export function readOrThrow(cursor: Cursor) {
    ${numberable
      ? `return NumberAbiUint${bits}.readOrThrow(cursor)`
      : `return BytesAbiUint${bits}.readOrThrow(cursor)`}
  }

}

export namespace BytesAbiUint${bits} {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiUint${bits} {
  readonly #class = BytesAbiUint${bits}

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

  static create(value: BytesAbiUint${bits}.Create) {
    return new BytesAbiUint${bits}(value)
  }

  static fromOrThrow(value: BytesAbiUint${bits}.From) {
    return new BytesAbiUint${bits}(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): bigint {
    return new RawHexAbiUint${bits}(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiUint${bits}(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return \`Abi.Int${bits}\`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiUint${bits}.nibbles

    const content = cursor.readOrThrow(BytesAbiUint${bits}.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)
    
    return new BytesAbiUint${bits}(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiUint${bits}.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiUint${bits}.bytes)

    return new BytesAbiUint${bits}(content)
  }

}

${numberable ? `export namespace NumberAbiUint${bits} {

  export type Create = number

  export type From = NumberAsInteger.From

}

export class NumberAbiUint${bits} {
  readonly #class = NumberAbiUint${bits}

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
    readonly value: number
  ) { }

  static create(value: NumberAbiUint${bits}.Create) {
    return new NumberAbiUint${bits}(value)
  }

  static fromOrThrow(value: NumberAbiUint${bits}.From) {
    return new NumberAbiUint${bits}(NumberAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): bigint {
    return BigInt(this.value)
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.value.toString()
  }

  static codegen() {
    return \`Abi.Int${bits}\`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - NumberAbiUint${bits}.nibbles

    const content = cursor.readOrThrow(NumberAbiUint${bits}.nibbles)
    const value = parseInt(content, 16)
    
    return new NumberAbiUint${bits}(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - 4)
    cursor.writeUint32OrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - 4

    const value = cursor.readUint32OrThrow()

    return new NumberAbiUint${bits}(value)
  }

}` : ``}

export namespace RawHexAbiUint${bits} {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiUint${bits} {
  readonly #class = RawHexAbiUint${bits}

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

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiUint${bits}.Create) {
    return new RawHexAbiUint${bits}(value)
  }

  static fromOrThrow(value: RawHexAbiUint${bits}.From) {
    return new RawHexAbiUint${bits}(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): bigint {
    return this.value.length ? BigInt("0x" + this.value) : 0n
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
    cursor.offset += 64 - RawHexAbiUint${bits}.nibbles

    const content = cursor.readOrThrow(RawHexAbiUint${bits}.nibbles)

    return new RawHexAbiUint${bits}(content)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiUint${bits}.bytes

    const content = cursor.readOrThrow(RawHexAbiUint${bits}.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiUint${bits}(value as RawHexString)
  }

}`
}

$createUint$(1)

$createUint$(2)

$createUint$(3)

$createUint$(4)

$createUint$(5)

$createUint$(6)

$createUint$(7)

$createUint$(8)

$createUint$(9)

$createUint$(10)

$createUint$(11)

$createUint$(12)

$createUint$(13)

$createUint$(14)

$createUint$(15)

$createUint$(16)

$createUint$(17)

$createUint$(18)

$createUint$(19)

$createUint$(20)

$createUint$(21)

$createUint$(22)

$createUint$(23)

$createUint$(24)

$createUint$(25)

$createUint$(26)

$createUint$(27)

$createUint$(28)

$createUint$(29)

$createUint$(30)

$createUint$(31)

$createUint$(32)

function $post$() {
  return `export type UintByName = {
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
  }`
}

$post$()