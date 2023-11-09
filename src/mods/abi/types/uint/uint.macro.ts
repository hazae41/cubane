function $pre$() {
  return `import { Cursor } from "@hazae41/cursor";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { Bytes } from "@hazae41/bytes";
import { Base16 } from "@hazae41/base16";
import { ZeroHexString } from "mods/types/zerohex/index.js";
import { RawHexString } from "mods/types/rawhex/index.js";`
}

$pre$()

function $createStaticUint$(bytes: number) {
  const nibbles = bytes * 2
  const bits = bytes * 8

  return `export type StaticUint${bits} =
  | ZeroHexStaticUint${bits}
  | BytesStaticUint${bits}

export namespace StaticUint${bits} {
  export const dynamic = false
  export const size = 32

  export type From = 
    | ZeroHexStaticUint${bits}.From
    | BytesStaticUint${bits}.From

  export function create(value: StaticUint${bits}.From) {
    if (value instanceof Uint8Array)
      return BytesStaticUint${bits}.create(value)
    return ZeroHexStaticUint${bits}.create(value)
  }

  export function from(value: StaticUint${bits}.From) {
    return StaticUint${bits}.create(value)
  }

  export function codegen() {
    return \`Cubane.Abi.Int${bits}\`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticUint${bits}.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticUint${bits}.readOrThrow(cursor)
  }

}

export namespace BytesStaticUint${bits} {
  export type From = Bytes<${bytes}>
}

export class BytesStaticUint${bits} {
  readonly #class = BytesStaticUint${bits}
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
    readonly value: BytesStaticUint${bits}.From
  ) { }

  toNumber() {
    return new ZeroHexStaticUint${bits}(this.encodePackedOrThrow()).toNumber()
  }

  toBigInt() {
    return new ZeroHexStaticUint${bits}(this.encodePackedOrThrow()).toBigInt()
  }

  static create(value: BytesStaticUint${bits}.From) {
    return new BytesStaticUint${bits}(value)
  }

  static from(value: BytesStaticUint${bits}.From) {
    return BytesStaticUint${bits}.create(value)
  }

  intoOrThrow() {
    return new ZeroHexStaticUint${bits}(this.encodePackedOrThrow()).intoOrThrow()
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
    cursor.offset += 64 - BytesStaticUint${bits}.nibbles

    const content = cursor.readOrThrow(BytesStaticUint${bits}.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()
    
    return new BytesStaticUint${bits}(value as Bytes<${bytes}>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesStaticUint${bits}.bytes

    const content = cursor.readOrThrow(BytesStaticUint${bits}.bytes)
    const value = Bytes.from(content)

    return new BytesStaticUint${bits}(value)
  }

}

export namespace ZeroHexStaticUint${bits} {
  export type From =
    | ZeroHexString
    | bigint
    | number
}

export class ZeroHexStaticUint${bits} {
  readonly #class = ZeroHexStaticUint${bits}
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

  constructor(
    readonly value: RawHexString
  ) { }

  static #fromBigInt(value: bigint) {
    return new ZeroHexStaticUint${bits}(value.toString(16))
  }

  toNumber() {
    return this.value.length ? Number("0x" + this.value) : 0
  }

  toBigInt() {
    return this.value.length ? BigInt("0x" + this.value) : 0n
  }

  static create(value: ZeroHexStaticUint${bits}.From) {
    if (typeof value === "bigint")
      return ZeroHexStaticUint${bits}.#fromBigInt(value)
    if (typeof value === "number")
      return ZeroHexStaticUint${bits}.#fromBigInt(BigInt(value))
    return new ZeroHexStaticUint${bits}(value.slice(2))
  }

  static from(value: ZeroHexStaticUint${bits}.From) {
    return ZeroHexStaticUint${bits}.create(value)
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
    return new ZeroHexStaticUint${bits}(cursor.readOrThrow(ZeroHexStaticUint${bits}.nibbles))
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
    cursor.offset += 32 - ZeroHexStaticUint${bits}.bytes

    const content = cursor.readOrThrow(ZeroHexStaticUint${bits}.bytes)
    const value = Base16.get().encodeOrThrow(content)

    return new ZeroHexStaticUint${bits}(value)
  }

}`
}

$createStaticUint$(1)

$createStaticUint$(2)

$createStaticUint$(3)

$createStaticUint$(4)

$createStaticUint$(5)

$createStaticUint$(6)

$createStaticUint$(7)

$createStaticUint$(8)

$createStaticUint$(9)

$createStaticUint$(10)

$createStaticUint$(11)

$createStaticUint$(12)

$createStaticUint$(13)

$createStaticUint$(14)

$createStaticUint$(15)

$createStaticUint$(16)

$createStaticUint$(17)

$createStaticUint$(18)

$createStaticUint$(19)

$createStaticUint$(20)

$createStaticUint$(21)

$createStaticUint$(22)

$createStaticUint$(23)

$createStaticUint$(24)

$createStaticUint$(25)

$createStaticUint$(26)

$createStaticUint$(27)

$createStaticUint$(28)

$createStaticUint$(29)

$createStaticUint$(30)

$createStaticUint$(31)

$createStaticUint$(32)

function $post$() {
  return `export type UintByName = {
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
  }`
}

$post$()