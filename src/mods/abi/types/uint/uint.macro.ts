function $pre$() {
  return `import { Cursor } from "@hazae41/cursor";
  import { BigInts } from "libs/bigint/bigint.js";
  import { TextCursor } from "libs/cursor/cursor.js";`
}

$pre$()

function $createStaticBigUint$(bytes: number) {
  const bits = bytes * 8
  const nibbles = bytes * 2

  return `export class Uint${bits} {
    readonly #class = Uint${bits}
    readonly name = this.#class.name

    static readonly bytes = ${bytes}
    static readonly bits = ${bits}
    static readonly nibbles = ${nibbles}

    static readonly dynamic = false
    static readonly size = 32

    readonly dynamic = this.#class.dynamic
    readonly size = this.#class.size

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Uint${bits}(value)
    }

    static from(value: bigint) {
      return new Uint${bits}(value)
    }

    intoOrThrow() {
      return this.value
    }

    static codegen() {
      return \`Cubane.Abi.Uint${bits}\`
    }

    get class() {
      return this.#class
    }

    get bits() {
      return this.#class.bits
    }

    get bytes() {
      return this.#class.bytes
    }

    encodeOrThrow() {
      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      cursor.offset += 64 - Uint${bits}.nibbles

      // p42:ignore-next-statement
      const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint${bits}.nibbles))

      return new Uint${bits}(value)
    }

    sizeOrThrow() {
      return this.size
    }

    writeOrThrow(cursor: Cursor) {
      using slice = BigInts.exportOrThrow(this.value)

      cursor.fillOrThrow(0, 32 - slice.bytes.length)
      cursor.writeOrThrow(slice.bytes)
    }

    static readOrThrow(cursor: Cursor) {
      cursor.offset += 32 - Uint${bits}.bytes

      const bytes = cursor.readOrThrow(Uint${bits}.bytes)
      const value = BigInts.importOrThrow(bytes)

      return new Uint${bits}(value)
    }

  }`
}

function $createStaticUint$(bytes: number) {
  const bits = bytes * 8

  return `export class Uint${bits} {
  readonly #class = Uint${bits}
  readonly name = this.#class.name

  static readonly bytes = ${bytes}
  static readonly bits = ${bits}

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: number
  ) { }

  static new(value: number) {
    return new Uint${bits}(value)
  }

  static from(value: number) {
    return new Uint${bits}(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return \`Cubane.Abi.Uint${bits}\`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - 8

    const value = parseInt(cursor.readOrThrow(8), 16)

    return new Uint${bits}(value)
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

    return new Uint${bits}(value)
  }

}`
}

$createStaticUint$(1)
$createStaticUint$(2)
$createStaticUint$(3)
$createStaticUint$(4)
$createStaticBigUint$(5)
$createStaticBigUint$(6)
$createStaticBigUint$(7)
$createStaticBigUint$(8)
$createStaticBigUint$(9)
$createStaticBigUint$(10)
$createStaticBigUint$(11)
$createStaticBigUint$(12)
$createStaticBigUint$(13)
$createStaticBigUint$(14)
$createStaticBigUint$(15)
$createStaticBigUint$(16)
$createStaticBigUint$(17)
$createStaticBigUint$(18)
$createStaticBigUint$(19)
$createStaticBigUint$(20)
$createStaticBigUint$(21)
$createStaticBigUint$(22)
$createStaticBigUint$(23)
$createStaticBigUint$(24)
$createStaticBigUint$(25)
$createStaticBigUint$(26)
$createStaticBigUint$(27)
$createStaticBigUint$(28)
$createStaticBigUint$(29)
$createStaticBigUint$(30)
$createStaticBigUint$(31)
$createStaticBigUint$(32)

function $post$() {
  return `export type UintByName = {
    uint8: typeof Uint8,
    uint16: typeof Uint16,
    uint24: typeof Uint24,
    uint32: typeof Uint32,
    uint40: typeof Uint40,
    uint48: typeof Uint48,
    uint56: typeof Uint56,
    uint64: typeof Uint64,
    uint72: typeof Uint72,
    uint80: typeof Uint80,
    uint88: typeof Uint88,
    uint96: typeof Uint96,
    uint104: typeof Uint104,
    uint112: typeof Uint112,
    uint120: typeof Uint120,
    uint128: typeof Uint128,
    uint136: typeof Uint136,
    uint144: typeof Uint144,
    uint152: typeof Uint152,
    uint160: typeof Uint160,
    uint168: typeof Uint168,
    uint176: typeof Uint176,
    uint184: typeof Uint184,
    uint192: typeof Uint192,
    uint200: typeof Uint200,
    uint208: typeof Uint208,
    uint216: typeof Uint216,
    uint224: typeof Uint224,
    uint232: typeof Uint232,
    uint240: typeof Uint240,
    uint248: typeof Uint248,
    uint256: typeof Uint256,
  }
  
  export const uintByName: UintByName = {
    uint8: Uint8,
    uint16: Uint16,
    uint24: Uint24,
    uint32: Uint32,
    uint40: Uint40,
    uint48: Uint48,
    uint56: Uint56,
    uint64: Uint64,
    uint72: Uint72,
    uint80: Uint80,
    uint88: Uint88,
    uint96: Uint96,
    uint104: Uint104,
    uint112: Uint112,
    uint120: Uint120,
    uint128: Uint128,
    uint136: Uint136,
    uint144: Uint144,
    uint152: Uint152,
    uint160: Uint160,
    uint168: Uint168,
    uint176: Uint176,
    uint184: Uint184,
    uint192: Uint192,
    uint200: Uint200,
    uint208: Uint208,
    uint216: Uint216,
    uint224: Uint224,
    uint232: Uint232,
    uint240: Uint240,
    uint248: Uint248,
    uint256: Uint256,
  } as const`
}

$post$()