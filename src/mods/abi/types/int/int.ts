import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";

const BN_0 = 0n
const BN_1 = 1n

export type StaticInt8 =
  | BigIntStaticInt8
  | NumberStaticInt8
  | BytesStaticInt8

export namespace StaticInt8 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt8.From
    | NumberStaticInt8.From
    | BytesStaticInt8.From

  export function create(value: StaticInt8.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt8.create(value)
    if (typeof value === "number")
      return NumberStaticInt8.create(value)
    return BytesStaticInt8.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt8`
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

export namespace BigIntStaticInt8 {
  export type From = bigint
}

export class BigIntStaticInt8 {
  readonly #class = BigIntStaticInt8
  readonly name = this.#class.name

  static readonly bytes = 1
  static readonly bits = 8
  static readonly bitsn = BigInt(8)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt8.From
  ) { }

  static create(value: BigIntStaticInt8.From) {
    return new BigIntStaticInt8(value)
  }

  static from(value: BigIntStaticInt8.From) {
    return BigIntStaticInt8.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt8(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt8(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt8.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt8.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt8(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt8(value)
  }

}

export namespace NumberStaticInt8 {
  export type From = number
}

export class NumberStaticInt8 {
  readonly #class = NumberStaticInt8
  readonly name = this.#class.name

  static readonly bytes = 1
  static readonly bits = 8
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt8
  ) { }

  static create(value: NumberStaticInt8.From) {
    const inner = BigIntStaticInt8.create(BigInt(value))

    return new NumberStaticInt8(inner)
  }

  static from(value: NumberStaticInt8.From) {
    return NumberStaticInt8.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt8(BigIntStaticInt8.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt8(BigIntStaticInt8.readOrThrow(cursor))
  }

}

export type StaticInt16 =
  | BigIntStaticInt16
  | NumberStaticInt16
  | BytesStaticInt16

export namespace StaticInt16 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt16.From
    | NumberStaticInt16.From
    | BytesStaticInt16.From

  export function create(value: StaticInt16.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt16.create(value)
    if (typeof value === "number")
      return NumberStaticInt16.create(value)
    return BytesStaticInt16.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt16`
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

export namespace BigIntStaticInt16 {
  export type From = bigint
}

export class BigIntStaticInt16 {
  readonly #class = BigIntStaticInt16
  readonly name = this.#class.name

  static readonly bytes = 2
  static readonly bits = 16
  static readonly bitsn = BigInt(16)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt16.From
  ) { }

  static create(value: BigIntStaticInt16.From) {
    return new BigIntStaticInt16(value)
  }

  static from(value: BigIntStaticInt16.From) {
    return BigIntStaticInt16.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt16(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt16(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt16.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt16.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt16(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt16(value)
  }

}

export namespace NumberStaticInt16 {
  export type From = number
}

export class NumberStaticInt16 {
  readonly #class = NumberStaticInt16
  readonly name = this.#class.name

  static readonly bytes = 2
  static readonly bits = 16
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt16
  ) { }

  static create(value: NumberStaticInt16.From) {
    const inner = BigIntStaticInt16.create(BigInt(value))

    return new NumberStaticInt16(inner)
  }

  static from(value: NumberStaticInt16.From) {
    return NumberStaticInt16.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt16(BigIntStaticInt16.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt16(BigIntStaticInt16.readOrThrow(cursor))
  }

}

export type StaticInt24 =
  | BigIntStaticInt24
  | NumberStaticInt24
  | BytesStaticInt24

export namespace StaticInt24 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt24.From
    | NumberStaticInt24.From
    | BytesStaticInt24.From

  export function create(value: StaticInt24.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt24.create(value)
    if (typeof value === "number")
      return NumberStaticInt24.create(value)
    return BytesStaticInt24.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt24`
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

export namespace BigIntStaticInt24 {
  export type From = bigint
}

export class BigIntStaticInt24 {
  readonly #class = BigIntStaticInt24
  readonly name = this.#class.name

  static readonly bytes = 3
  static readonly bits = 24
  static readonly bitsn = BigInt(24)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt24.From
  ) { }

  static create(value: BigIntStaticInt24.From) {
    return new BigIntStaticInt24(value)
  }

  static from(value: BigIntStaticInt24.From) {
    return BigIntStaticInt24.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt24(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt24(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt24.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt24.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt24(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt24(value)
  }

}

export namespace NumberStaticInt24 {
  export type From = number
}

export class NumberStaticInt24 {
  readonly #class = NumberStaticInt24
  readonly name = this.#class.name

  static readonly bytes = 3
  static readonly bits = 24
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt24
  ) { }

  static create(value: NumberStaticInt24.From) {
    const inner = BigIntStaticInt24.create(BigInt(value))

    return new NumberStaticInt24(inner)
  }

  static from(value: NumberStaticInt24.From) {
    return NumberStaticInt24.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt24(BigIntStaticInt24.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt24(BigIntStaticInt24.readOrThrow(cursor))
  }

}

export type StaticInt32 =
  | BigIntStaticInt32
  | NumberStaticInt32
  | BytesStaticInt32

export namespace StaticInt32 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt32.From
    | NumberStaticInt32.From
    | BytesStaticInt32.From

  export function create(value: StaticInt32.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt32.create(value)
    if (typeof value === "number")
      return NumberStaticInt32.create(value)
    return BytesStaticInt32.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt32`
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

export namespace BigIntStaticInt32 {
  export type From = bigint
}

export class BigIntStaticInt32 {
  readonly #class = BigIntStaticInt32
  readonly name = this.#class.name

  static readonly bytes = 4
  static readonly bits = 32
  static readonly bitsn = BigInt(32)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt32.From
  ) { }

  static create(value: BigIntStaticInt32.From) {
    return new BigIntStaticInt32(value)
  }

  static from(value: BigIntStaticInt32.From) {
    return BigIntStaticInt32.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt32(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt32(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt32.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt32.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt32(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt32(value)
  }

}

export namespace NumberStaticInt32 {
  export type From = number
}

export class NumberStaticInt32 {
  readonly #class = NumberStaticInt32
  readonly name = this.#class.name

  static readonly bytes = 4
  static readonly bits = 32
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt32
  ) { }

  static create(value: NumberStaticInt32.From) {
    const inner = BigIntStaticInt32.create(BigInt(value))

    return new NumberStaticInt32(inner)
  }

  static from(value: NumberStaticInt32.From) {
    return NumberStaticInt32.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt32(BigIntStaticInt32.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt32(BigIntStaticInt32.readOrThrow(cursor))
  }

}

export type StaticInt40 =
  | BigIntStaticInt40
  | NumberStaticInt40
  | BytesStaticInt40

export namespace StaticInt40 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt40.From
    | NumberStaticInt40.From
    | BytesStaticInt40.From

  export function create(value: StaticInt40.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt40.create(value)
    if (typeof value === "number")
      return NumberStaticInt40.create(value)
    return BytesStaticInt40.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt40`
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

export namespace BigIntStaticInt40 {
  export type From = bigint
}

export class BigIntStaticInt40 {
  readonly #class = BigIntStaticInt40
  readonly name = this.#class.name

  static readonly bytes = 5
  static readonly bits = 40
  static readonly bitsn = BigInt(40)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt40.From
  ) { }

  static create(value: BigIntStaticInt40.From) {
    return new BigIntStaticInt40(value)
  }

  static from(value: BigIntStaticInt40.From) {
    return BigIntStaticInt40.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt40`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt40(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt40(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt40.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt40.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt40(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt40(value)
  }

}

export namespace NumberStaticInt40 {
  export type From = number
}

export class NumberStaticInt40 {
  readonly #class = NumberStaticInt40
  readonly name = this.#class.name

  static readonly bytes = 5
  static readonly bits = 40
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt40
  ) { }

  static create(value: NumberStaticInt40.From) {
    const inner = BigIntStaticInt40.create(BigInt(value))

    return new NumberStaticInt40(inner)
  }

  static from(value: NumberStaticInt40.From) {
    return NumberStaticInt40.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt40`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt40(BigIntStaticInt40.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt40(BigIntStaticInt40.readOrThrow(cursor))
  }

}

export type StaticInt48 =
  | BigIntStaticInt48
  | NumberStaticInt48
  | BytesStaticInt48

export namespace StaticInt48 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt48.From
    | NumberStaticInt48.From
    | BytesStaticInt48.From

  export function create(value: StaticInt48.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt48.create(value)
    if (typeof value === "number")
      return NumberStaticInt48.create(value)
    return BytesStaticInt48.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt48`
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

export namespace BigIntStaticInt48 {
  export type From = bigint
}

export class BigIntStaticInt48 {
  readonly #class = BigIntStaticInt48
  readonly name = this.#class.name

  static readonly bytes = 6
  static readonly bits = 48
  static readonly bitsn = BigInt(48)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt48.From
  ) { }

  static create(value: BigIntStaticInt48.From) {
    return new BigIntStaticInt48(value)
  }

  static from(value: BigIntStaticInt48.From) {
    return BigIntStaticInt48.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt48`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt48(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt48(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt48.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt48.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt48(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt48(value)
  }

}

export namespace NumberStaticInt48 {
  export type From = number
}

export class NumberStaticInt48 {
  readonly #class = NumberStaticInt48
  readonly name = this.#class.name

  static readonly bytes = 6
  static readonly bits = 48
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt48
  ) { }

  static create(value: NumberStaticInt48.From) {
    const inner = BigIntStaticInt48.create(BigInt(value))

    return new NumberStaticInt48(inner)
  }

  static from(value: NumberStaticInt48.From) {
    return NumberStaticInt48.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt48`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt48(BigIntStaticInt48.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt48(BigIntStaticInt48.readOrThrow(cursor))
  }

}

export type StaticInt56 =
  | BigIntStaticInt56
  | NumberStaticInt56
  | BytesStaticInt56

export namespace StaticInt56 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt56.From
    | NumberStaticInt56.From
    | BytesStaticInt56.From

  export function create(value: StaticInt56.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt56.create(value)
    if (typeof value === "number")
      return NumberStaticInt56.create(value)
    return BytesStaticInt56.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt56`
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

export namespace BigIntStaticInt56 {
  export type From = bigint
}

export class BigIntStaticInt56 {
  readonly #class = BigIntStaticInt56
  readonly name = this.#class.name

  static readonly bytes = 7
  static readonly bits = 56
  static readonly bitsn = BigInt(56)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt56.From
  ) { }

  static create(value: BigIntStaticInt56.From) {
    return new BigIntStaticInt56(value)
  }

  static from(value: BigIntStaticInt56.From) {
    return BigIntStaticInt56.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt56`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt56(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt56(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt56.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt56.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt56(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt56(value)
  }

}

export namespace NumberStaticInt56 {
  export type From = number
}

export class NumberStaticInt56 {
  readonly #class = NumberStaticInt56
  readonly name = this.#class.name

  static readonly bytes = 7
  static readonly bits = 56
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt56
  ) { }

  static create(value: NumberStaticInt56.From) {
    const inner = BigIntStaticInt56.create(BigInt(value))

    return new NumberStaticInt56(inner)
  }

  static from(value: NumberStaticInt56.From) {
    return NumberStaticInt56.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt56`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt56(BigIntStaticInt56.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt56(BigIntStaticInt56.readOrThrow(cursor))
  }

}

export type StaticInt64 =
  | BigIntStaticInt64
  | NumberStaticInt64
  | BytesStaticInt64

export namespace StaticInt64 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt64.From
    | NumberStaticInt64.From
    | BytesStaticInt64.From

  export function create(value: StaticInt64.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt64.create(value)
    if (typeof value === "number")
      return NumberStaticInt64.create(value)
    return BytesStaticInt64.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt64`
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

export namespace BigIntStaticInt64 {
  export type From = bigint
}

export class BigIntStaticInt64 {
  readonly #class = BigIntStaticInt64
  readonly name = this.#class.name

  static readonly bytes = 8
  static readonly bits = 64
  static readonly bitsn = BigInt(64)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt64.From
  ) { }

  static create(value: BigIntStaticInt64.From) {
    return new BigIntStaticInt64(value)
  }

  static from(value: BigIntStaticInt64.From) {
    return BigIntStaticInt64.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt64`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt64(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt64(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt64.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt64.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt64(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt64(value)
  }

}

export namespace NumberStaticInt64 {
  export type From = number
}

export class NumberStaticInt64 {
  readonly #class = NumberStaticInt64
  readonly name = this.#class.name

  static readonly bytes = 8
  static readonly bits = 64
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt64
  ) { }

  static create(value: NumberStaticInt64.From) {
    const inner = BigIntStaticInt64.create(BigInt(value))

    return new NumberStaticInt64(inner)
  }

  static from(value: NumberStaticInt64.From) {
    return NumberStaticInt64.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt64`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt64(BigIntStaticInt64.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt64(BigIntStaticInt64.readOrThrow(cursor))
  }

}

export type StaticInt72 =
  | BigIntStaticInt72
  | NumberStaticInt72
  | BytesStaticInt72

export namespace StaticInt72 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt72.From
    | NumberStaticInt72.From
    | BytesStaticInt72.From

  export function create(value: StaticInt72.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt72.create(value)
    if (typeof value === "number")
      return NumberStaticInt72.create(value)
    return BytesStaticInt72.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt72`
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

export namespace BigIntStaticInt72 {
  export type From = bigint
}

export class BigIntStaticInt72 {
  readonly #class = BigIntStaticInt72
  readonly name = this.#class.name

  static readonly bytes = 9
  static readonly bits = 72
  static readonly bitsn = BigInt(72)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt72.From
  ) { }

  static create(value: BigIntStaticInt72.From) {
    return new BigIntStaticInt72(value)
  }

  static from(value: BigIntStaticInt72.From) {
    return BigIntStaticInt72.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt72`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt72(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt72(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt72.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt72.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt72(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt72(value)
  }

}

export namespace NumberStaticInt72 {
  export type From = number
}

export class NumberStaticInt72 {
  readonly #class = NumberStaticInt72
  readonly name = this.#class.name

  static readonly bytes = 9
  static readonly bits = 72
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt72
  ) { }

  static create(value: NumberStaticInt72.From) {
    const inner = BigIntStaticInt72.create(BigInt(value))

    return new NumberStaticInt72(inner)
  }

  static from(value: NumberStaticInt72.From) {
    return NumberStaticInt72.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt72`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt72(BigIntStaticInt72.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt72(BigIntStaticInt72.readOrThrow(cursor))
  }

}

export type StaticInt80 =
  | BigIntStaticInt80
  | NumberStaticInt80
  | BytesStaticInt80

export namespace StaticInt80 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt80.From
    | NumberStaticInt80.From
    | BytesStaticInt80.From

  export function create(value: StaticInt80.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt80.create(value)
    if (typeof value === "number")
      return NumberStaticInt80.create(value)
    return BytesStaticInt80.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt80`
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

export namespace BigIntStaticInt80 {
  export type From = bigint
}

export class BigIntStaticInt80 {
  readonly #class = BigIntStaticInt80
  readonly name = this.#class.name

  static readonly bytes = 10
  static readonly bits = 80
  static readonly bitsn = BigInt(80)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt80.From
  ) { }

  static create(value: BigIntStaticInt80.From) {
    return new BigIntStaticInt80(value)
  }

  static from(value: BigIntStaticInt80.From) {
    return BigIntStaticInt80.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt80`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt80(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt80(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt80.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt80.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt80(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt80(value)
  }

}

export namespace NumberStaticInt80 {
  export type From = number
}

export class NumberStaticInt80 {
  readonly #class = NumberStaticInt80
  readonly name = this.#class.name

  static readonly bytes = 10
  static readonly bits = 80
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt80
  ) { }

  static create(value: NumberStaticInt80.From) {
    const inner = BigIntStaticInt80.create(BigInt(value))

    return new NumberStaticInt80(inner)
  }

  static from(value: NumberStaticInt80.From) {
    return NumberStaticInt80.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt80`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt80(BigIntStaticInt80.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt80(BigIntStaticInt80.readOrThrow(cursor))
  }

}

export type StaticInt88 =
  | BigIntStaticInt88
  | NumberStaticInt88
  | BytesStaticInt88

export namespace StaticInt88 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt88.From
    | NumberStaticInt88.From
    | BytesStaticInt88.From

  export function create(value: StaticInt88.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt88.create(value)
    if (typeof value === "number")
      return NumberStaticInt88.create(value)
    return BytesStaticInt88.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt88`
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

export namespace BigIntStaticInt88 {
  export type From = bigint
}

export class BigIntStaticInt88 {
  readonly #class = BigIntStaticInt88
  readonly name = this.#class.name

  static readonly bytes = 11
  static readonly bits = 88
  static readonly bitsn = BigInt(88)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt88.From
  ) { }

  static create(value: BigIntStaticInt88.From) {
    return new BigIntStaticInt88(value)
  }

  static from(value: BigIntStaticInt88.From) {
    return BigIntStaticInt88.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt88`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt88(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt88(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt88.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt88.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt88(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt88(value)
  }

}

export namespace NumberStaticInt88 {
  export type From = number
}

export class NumberStaticInt88 {
  readonly #class = NumberStaticInt88
  readonly name = this.#class.name

  static readonly bytes = 11
  static readonly bits = 88
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt88
  ) { }

  static create(value: NumberStaticInt88.From) {
    const inner = BigIntStaticInt88.create(BigInt(value))

    return new NumberStaticInt88(inner)
  }

  static from(value: NumberStaticInt88.From) {
    return NumberStaticInt88.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt88`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt88(BigIntStaticInt88.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt88(BigIntStaticInt88.readOrThrow(cursor))
  }

}

export type StaticInt96 =
  | BigIntStaticInt96
  | NumberStaticInt96
  | BytesStaticInt96

export namespace StaticInt96 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt96.From
    | NumberStaticInt96.From
    | BytesStaticInt96.From

  export function create(value: StaticInt96.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt96.create(value)
    if (typeof value === "number")
      return NumberStaticInt96.create(value)
    return BytesStaticInt96.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt96`
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

export namespace BigIntStaticInt96 {
  export type From = bigint
}

export class BigIntStaticInt96 {
  readonly #class = BigIntStaticInt96
  readonly name = this.#class.name

  static readonly bytes = 12
  static readonly bits = 96
  static readonly bitsn = BigInt(96)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt96.From
  ) { }

  static create(value: BigIntStaticInt96.From) {
    return new BigIntStaticInt96(value)
  }

  static from(value: BigIntStaticInt96.From) {
    return BigIntStaticInt96.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt96`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt96(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt96(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt96.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt96.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt96(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt96(value)
  }

}

export namespace NumberStaticInt96 {
  export type From = number
}

export class NumberStaticInt96 {
  readonly #class = NumberStaticInt96
  readonly name = this.#class.name

  static readonly bytes = 12
  static readonly bits = 96
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt96
  ) { }

  static create(value: NumberStaticInt96.From) {
    const inner = BigIntStaticInt96.create(BigInt(value))

    return new NumberStaticInt96(inner)
  }

  static from(value: NumberStaticInt96.From) {
    return NumberStaticInt96.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt96`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt96(BigIntStaticInt96.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt96(BigIntStaticInt96.readOrThrow(cursor))
  }

}

export type StaticInt104 =
  | BigIntStaticInt104
  | NumberStaticInt104
  | BytesStaticInt104

export namespace StaticInt104 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt104.From
    | NumberStaticInt104.From
    | BytesStaticInt104.From

  export function create(value: StaticInt104.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt104.create(value)
    if (typeof value === "number")
      return NumberStaticInt104.create(value)
    return BytesStaticInt104.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt104`
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

export namespace BigIntStaticInt104 {
  export type From = bigint
}

export class BigIntStaticInt104 {
  readonly #class = BigIntStaticInt104
  readonly name = this.#class.name

  static readonly bytes = 13
  static readonly bits = 104
  static readonly bitsn = BigInt(104)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt104.From
  ) { }

  static create(value: BigIntStaticInt104.From) {
    return new BigIntStaticInt104(value)
  }

  static from(value: BigIntStaticInt104.From) {
    return BigIntStaticInt104.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt104`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt104(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt104(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt104.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt104.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt104(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt104(value)
  }

}

export namespace NumberStaticInt104 {
  export type From = number
}

export class NumberStaticInt104 {
  readonly #class = NumberStaticInt104
  readonly name = this.#class.name

  static readonly bytes = 13
  static readonly bits = 104
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt104
  ) { }

  static create(value: NumberStaticInt104.From) {
    const inner = BigIntStaticInt104.create(BigInt(value))

    return new NumberStaticInt104(inner)
  }

  static from(value: NumberStaticInt104.From) {
    return NumberStaticInt104.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt104`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt104(BigIntStaticInt104.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt104(BigIntStaticInt104.readOrThrow(cursor))
  }

}

export type StaticInt112 =
  | BigIntStaticInt112
  | NumberStaticInt112
  | BytesStaticInt112

export namespace StaticInt112 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt112.From
    | NumberStaticInt112.From
    | BytesStaticInt112.From

  export function create(value: StaticInt112.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt112.create(value)
    if (typeof value === "number")
      return NumberStaticInt112.create(value)
    return BytesStaticInt112.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt112`
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

export namespace BigIntStaticInt112 {
  export type From = bigint
}

export class BigIntStaticInt112 {
  readonly #class = BigIntStaticInt112
  readonly name = this.#class.name

  static readonly bytes = 14
  static readonly bits = 112
  static readonly bitsn = BigInt(112)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt112.From
  ) { }

  static create(value: BigIntStaticInt112.From) {
    return new BigIntStaticInt112(value)
  }

  static from(value: BigIntStaticInt112.From) {
    return BigIntStaticInt112.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt112`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt112(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt112(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt112.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt112.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt112(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt112(value)
  }

}

export namespace NumberStaticInt112 {
  export type From = number
}

export class NumberStaticInt112 {
  readonly #class = NumberStaticInt112
  readonly name = this.#class.name

  static readonly bytes = 14
  static readonly bits = 112
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt112
  ) { }

  static create(value: NumberStaticInt112.From) {
    const inner = BigIntStaticInt112.create(BigInt(value))

    return new NumberStaticInt112(inner)
  }

  static from(value: NumberStaticInt112.From) {
    return NumberStaticInt112.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt112`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt112(BigIntStaticInt112.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt112(BigIntStaticInt112.readOrThrow(cursor))
  }

}

export type StaticInt120 =
  | BigIntStaticInt120
  | NumberStaticInt120
  | BytesStaticInt120

export namespace StaticInt120 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt120.From
    | NumberStaticInt120.From
    | BytesStaticInt120.From

  export function create(value: StaticInt120.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt120.create(value)
    if (typeof value === "number")
      return NumberStaticInt120.create(value)
    return BytesStaticInt120.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt120`
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

export namespace BigIntStaticInt120 {
  export type From = bigint
}

export class BigIntStaticInt120 {
  readonly #class = BigIntStaticInt120
  readonly name = this.#class.name

  static readonly bytes = 15
  static readonly bits = 120
  static readonly bitsn = BigInt(120)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt120.From
  ) { }

  static create(value: BigIntStaticInt120.From) {
    return new BigIntStaticInt120(value)
  }

  static from(value: BigIntStaticInt120.From) {
    return BigIntStaticInt120.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt120`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt120(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt120(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt120.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt120.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt120(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt120(value)
  }

}

export namespace NumberStaticInt120 {
  export type From = number
}

export class NumberStaticInt120 {
  readonly #class = NumberStaticInt120
  readonly name = this.#class.name

  static readonly bytes = 15
  static readonly bits = 120
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt120
  ) { }

  static create(value: NumberStaticInt120.From) {
    const inner = BigIntStaticInt120.create(BigInt(value))

    return new NumberStaticInt120(inner)
  }

  static from(value: NumberStaticInt120.From) {
    return NumberStaticInt120.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt120`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt120(BigIntStaticInt120.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt120(BigIntStaticInt120.readOrThrow(cursor))
  }

}

export type StaticInt128 =
  | BigIntStaticInt128
  | NumberStaticInt128
  | BytesStaticInt128

export namespace StaticInt128 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt128.From
    | NumberStaticInt128.From
    | BytesStaticInt128.From

  export function create(value: StaticInt128.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt128.create(value)
    if (typeof value === "number")
      return NumberStaticInt128.create(value)
    return BytesStaticInt128.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt128`
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

export namespace BigIntStaticInt128 {
  export type From = bigint
}

export class BigIntStaticInt128 {
  readonly #class = BigIntStaticInt128
  readonly name = this.#class.name

  static readonly bytes = 16
  static readonly bits = 128
  static readonly bitsn = BigInt(128)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt128.From
  ) { }

  static create(value: BigIntStaticInt128.From) {
    return new BigIntStaticInt128(value)
  }

  static from(value: BigIntStaticInt128.From) {
    return BigIntStaticInt128.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt128`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt128(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt128(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt128.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt128.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt128(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt128(value)
  }

}

export namespace NumberStaticInt128 {
  export type From = number
}

export class NumberStaticInt128 {
  readonly #class = NumberStaticInt128
  readonly name = this.#class.name

  static readonly bytes = 16
  static readonly bits = 128
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt128
  ) { }

  static create(value: NumberStaticInt128.From) {
    const inner = BigIntStaticInt128.create(BigInt(value))

    return new NumberStaticInt128(inner)
  }

  static from(value: NumberStaticInt128.From) {
    return NumberStaticInt128.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt128`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt128(BigIntStaticInt128.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt128(BigIntStaticInt128.readOrThrow(cursor))
  }

}

export type StaticInt136 =
  | BigIntStaticInt136
  | NumberStaticInt136
  | BytesStaticInt136

export namespace StaticInt136 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt136.From
    | NumberStaticInt136.From
    | BytesStaticInt136.From

  export function create(value: StaticInt136.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt136.create(value)
    if (typeof value === "number")
      return NumberStaticInt136.create(value)
    return BytesStaticInt136.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt136`
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

export namespace BigIntStaticInt136 {
  export type From = bigint
}

export class BigIntStaticInt136 {
  readonly #class = BigIntStaticInt136
  readonly name = this.#class.name

  static readonly bytes = 17
  static readonly bits = 136
  static readonly bitsn = BigInt(136)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt136.From
  ) { }

  static create(value: BigIntStaticInt136.From) {
    return new BigIntStaticInt136(value)
  }

  static from(value: BigIntStaticInt136.From) {
    return BigIntStaticInt136.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt136`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt136(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt136(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt136.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt136.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt136(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt136(value)
  }

}

export namespace NumberStaticInt136 {
  export type From = number
}

export class NumberStaticInt136 {
  readonly #class = NumberStaticInt136
  readonly name = this.#class.name

  static readonly bytes = 17
  static readonly bits = 136
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt136
  ) { }

  static create(value: NumberStaticInt136.From) {
    const inner = BigIntStaticInt136.create(BigInt(value))

    return new NumberStaticInt136(inner)
  }

  static from(value: NumberStaticInt136.From) {
    return NumberStaticInt136.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt136`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt136(BigIntStaticInt136.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt136(BigIntStaticInt136.readOrThrow(cursor))
  }

}

export type StaticInt144 =
  | BigIntStaticInt144
  | NumberStaticInt144
  | BytesStaticInt144

export namespace StaticInt144 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt144.From
    | NumberStaticInt144.From
    | BytesStaticInt144.From

  export function create(value: StaticInt144.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt144.create(value)
    if (typeof value === "number")
      return NumberStaticInt144.create(value)
    return BytesStaticInt144.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt144`
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

export namespace BigIntStaticInt144 {
  export type From = bigint
}

export class BigIntStaticInt144 {
  readonly #class = BigIntStaticInt144
  readonly name = this.#class.name

  static readonly bytes = 18
  static readonly bits = 144
  static readonly bitsn = BigInt(144)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt144.From
  ) { }

  static create(value: BigIntStaticInt144.From) {
    return new BigIntStaticInt144(value)
  }

  static from(value: BigIntStaticInt144.From) {
    return BigIntStaticInt144.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt144`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt144(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt144(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt144.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt144.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt144(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt144(value)
  }

}

export namespace NumberStaticInt144 {
  export type From = number
}

export class NumberStaticInt144 {
  readonly #class = NumberStaticInt144
  readonly name = this.#class.name

  static readonly bytes = 18
  static readonly bits = 144
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt144
  ) { }

  static create(value: NumberStaticInt144.From) {
    const inner = BigIntStaticInt144.create(BigInt(value))

    return new NumberStaticInt144(inner)
  }

  static from(value: NumberStaticInt144.From) {
    return NumberStaticInt144.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt144`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt144(BigIntStaticInt144.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt144(BigIntStaticInt144.readOrThrow(cursor))
  }

}

export type StaticInt152 =
  | BigIntStaticInt152
  | NumberStaticInt152
  | BytesStaticInt152

export namespace StaticInt152 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt152.From
    | NumberStaticInt152.From
    | BytesStaticInt152.From

  export function create(value: StaticInt152.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt152.create(value)
    if (typeof value === "number")
      return NumberStaticInt152.create(value)
    return BytesStaticInt152.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt152`
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

export namespace BigIntStaticInt152 {
  export type From = bigint
}

export class BigIntStaticInt152 {
  readonly #class = BigIntStaticInt152
  readonly name = this.#class.name

  static readonly bytes = 19
  static readonly bits = 152
  static readonly bitsn = BigInt(152)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt152.From
  ) { }

  static create(value: BigIntStaticInt152.From) {
    return new BigIntStaticInt152(value)
  }

  static from(value: BigIntStaticInt152.From) {
    return BigIntStaticInt152.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt152`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt152(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt152(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt152.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt152.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt152(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt152(value)
  }

}

export namespace NumberStaticInt152 {
  export type From = number
}

export class NumberStaticInt152 {
  readonly #class = NumberStaticInt152
  readonly name = this.#class.name

  static readonly bytes = 19
  static readonly bits = 152
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt152
  ) { }

  static create(value: NumberStaticInt152.From) {
    const inner = BigIntStaticInt152.create(BigInt(value))

    return new NumberStaticInt152(inner)
  }

  static from(value: NumberStaticInt152.From) {
    return NumberStaticInt152.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt152`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt152(BigIntStaticInt152.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt152(BigIntStaticInt152.readOrThrow(cursor))
  }

}

export type StaticInt160 =
  | BigIntStaticInt160
  | NumberStaticInt160
  | BytesStaticInt160

export namespace StaticInt160 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt160.From
    | NumberStaticInt160.From
    | BytesStaticInt160.From

  export function create(value: StaticInt160.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt160.create(value)
    if (typeof value === "number")
      return NumberStaticInt160.create(value)
    return BytesStaticInt160.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt160`
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

export namespace BigIntStaticInt160 {
  export type From = bigint
}

export class BigIntStaticInt160 {
  readonly #class = BigIntStaticInt160
  readonly name = this.#class.name

  static readonly bytes = 20
  static readonly bits = 160
  static readonly bitsn = BigInt(160)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt160.From
  ) { }

  static create(value: BigIntStaticInt160.From) {
    return new BigIntStaticInt160(value)
  }

  static from(value: BigIntStaticInt160.From) {
    return BigIntStaticInt160.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt160`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt160(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt160(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt160.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt160.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt160(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt160(value)
  }

}

export namespace NumberStaticInt160 {
  export type From = number
}

export class NumberStaticInt160 {
  readonly #class = NumberStaticInt160
  readonly name = this.#class.name

  static readonly bytes = 20
  static readonly bits = 160
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt160
  ) { }

  static create(value: NumberStaticInt160.From) {
    const inner = BigIntStaticInt160.create(BigInt(value))

    return new NumberStaticInt160(inner)
  }

  static from(value: NumberStaticInt160.From) {
    return NumberStaticInt160.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt160`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt160(BigIntStaticInt160.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt160(BigIntStaticInt160.readOrThrow(cursor))
  }

}

export type StaticInt168 =
  | BigIntStaticInt168
  | NumberStaticInt168
  | BytesStaticInt168

export namespace StaticInt168 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt168.From
    | NumberStaticInt168.From
    | BytesStaticInt168.From

  export function create(value: StaticInt168.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt168.create(value)
    if (typeof value === "number")
      return NumberStaticInt168.create(value)
    return BytesStaticInt168.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt168`
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

export namespace BigIntStaticInt168 {
  export type From = bigint
}

export class BigIntStaticInt168 {
  readonly #class = BigIntStaticInt168
  readonly name = this.#class.name

  static readonly bytes = 21
  static readonly bits = 168
  static readonly bitsn = BigInt(168)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt168.From
  ) { }

  static create(value: BigIntStaticInt168.From) {
    return new BigIntStaticInt168(value)
  }

  static from(value: BigIntStaticInt168.From) {
    return BigIntStaticInt168.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt168`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt168(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt168(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt168.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt168.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt168(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt168(value)
  }

}

export namespace NumberStaticInt168 {
  export type From = number
}

export class NumberStaticInt168 {
  readonly #class = NumberStaticInt168
  readonly name = this.#class.name

  static readonly bytes = 21
  static readonly bits = 168
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt168
  ) { }

  static create(value: NumberStaticInt168.From) {
    const inner = BigIntStaticInt168.create(BigInt(value))

    return new NumberStaticInt168(inner)
  }

  static from(value: NumberStaticInt168.From) {
    return NumberStaticInt168.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt168`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt168(BigIntStaticInt168.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt168(BigIntStaticInt168.readOrThrow(cursor))
  }

}

export type StaticInt176 =
  | BigIntStaticInt176
  | NumberStaticInt176
  | BytesStaticInt176

export namespace StaticInt176 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt176.From
    | NumberStaticInt176.From
    | BytesStaticInt176.From

  export function create(value: StaticInt176.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt176.create(value)
    if (typeof value === "number")
      return NumberStaticInt176.create(value)
    return BytesStaticInt176.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt176`
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

export namespace BigIntStaticInt176 {
  export type From = bigint
}

export class BigIntStaticInt176 {
  readonly #class = BigIntStaticInt176
  readonly name = this.#class.name

  static readonly bytes = 22
  static readonly bits = 176
  static readonly bitsn = BigInt(176)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt176.From
  ) { }

  static create(value: BigIntStaticInt176.From) {
    return new BigIntStaticInt176(value)
  }

  static from(value: BigIntStaticInt176.From) {
    return BigIntStaticInt176.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt176`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt176(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt176(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt176.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt176.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt176(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt176(value)
  }

}

export namespace NumberStaticInt176 {
  export type From = number
}

export class NumberStaticInt176 {
  readonly #class = NumberStaticInt176
  readonly name = this.#class.name

  static readonly bytes = 22
  static readonly bits = 176
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt176
  ) { }

  static create(value: NumberStaticInt176.From) {
    const inner = BigIntStaticInt176.create(BigInt(value))

    return new NumberStaticInt176(inner)
  }

  static from(value: NumberStaticInt176.From) {
    return NumberStaticInt176.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt176`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt176(BigIntStaticInt176.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt176(BigIntStaticInt176.readOrThrow(cursor))
  }

}

export type StaticInt184 =
  | BigIntStaticInt184
  | NumberStaticInt184
  | BytesStaticInt184

export namespace StaticInt184 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt184.From
    | NumberStaticInt184.From
    | BytesStaticInt184.From

  export function create(value: StaticInt184.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt184.create(value)
    if (typeof value === "number")
      return NumberStaticInt184.create(value)
    return BytesStaticInt184.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt184`
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

export namespace BigIntStaticInt184 {
  export type From = bigint
}

export class BigIntStaticInt184 {
  readonly #class = BigIntStaticInt184
  readonly name = this.#class.name

  static readonly bytes = 23
  static readonly bits = 184
  static readonly bitsn = BigInt(184)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt184.From
  ) { }

  static create(value: BigIntStaticInt184.From) {
    return new BigIntStaticInt184(value)
  }

  static from(value: BigIntStaticInt184.From) {
    return BigIntStaticInt184.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt184`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt184(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt184(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt184.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt184.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt184(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt184(value)
  }

}

export namespace NumberStaticInt184 {
  export type From = number
}

export class NumberStaticInt184 {
  readonly #class = NumberStaticInt184
  readonly name = this.#class.name

  static readonly bytes = 23
  static readonly bits = 184
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt184
  ) { }

  static create(value: NumberStaticInt184.From) {
    const inner = BigIntStaticInt184.create(BigInt(value))

    return new NumberStaticInt184(inner)
  }

  static from(value: NumberStaticInt184.From) {
    return NumberStaticInt184.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt184`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt184(BigIntStaticInt184.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt184(BigIntStaticInt184.readOrThrow(cursor))
  }

}

export type StaticInt192 =
  | BigIntStaticInt192
  | NumberStaticInt192
  | BytesStaticInt192

export namespace StaticInt192 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt192.From
    | NumberStaticInt192.From
    | BytesStaticInt192.From

  export function create(value: StaticInt192.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt192.create(value)
    if (typeof value === "number")
      return NumberStaticInt192.create(value)
    return BytesStaticInt192.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt192`
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

export namespace BigIntStaticInt192 {
  export type From = bigint
}

export class BigIntStaticInt192 {
  readonly #class = BigIntStaticInt192
  readonly name = this.#class.name

  static readonly bytes = 24
  static readonly bits = 192
  static readonly bitsn = BigInt(192)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt192.From
  ) { }

  static create(value: BigIntStaticInt192.From) {
    return new BigIntStaticInt192(value)
  }

  static from(value: BigIntStaticInt192.From) {
    return BigIntStaticInt192.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt192`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt192(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt192(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt192.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt192.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt192(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt192(value)
  }

}

export namespace NumberStaticInt192 {
  export type From = number
}

export class NumberStaticInt192 {
  readonly #class = NumberStaticInt192
  readonly name = this.#class.name

  static readonly bytes = 24
  static readonly bits = 192
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt192
  ) { }

  static create(value: NumberStaticInt192.From) {
    const inner = BigIntStaticInt192.create(BigInt(value))

    return new NumberStaticInt192(inner)
  }

  static from(value: NumberStaticInt192.From) {
    return NumberStaticInt192.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt192`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt192(BigIntStaticInt192.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt192(BigIntStaticInt192.readOrThrow(cursor))
  }

}

export type StaticInt200 =
  | BigIntStaticInt200
  | NumberStaticInt200
  | BytesStaticInt200

export namespace StaticInt200 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt200.From
    | NumberStaticInt200.From
    | BytesStaticInt200.From

  export function create(value: StaticInt200.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt200.create(value)
    if (typeof value === "number")
      return NumberStaticInt200.create(value)
    return BytesStaticInt200.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt200`
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

export namespace BigIntStaticInt200 {
  export type From = bigint
}

export class BigIntStaticInt200 {
  readonly #class = BigIntStaticInt200
  readonly name = this.#class.name

  static readonly bytes = 25
  static readonly bits = 200
  static readonly bitsn = BigInt(200)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt200.From
  ) { }

  static create(value: BigIntStaticInt200.From) {
    return new BigIntStaticInt200(value)
  }

  static from(value: BigIntStaticInt200.From) {
    return BigIntStaticInt200.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt200`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt200(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt200(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt200.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt200.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt200(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt200(value)
  }

}

export namespace NumberStaticInt200 {
  export type From = number
}

export class NumberStaticInt200 {
  readonly #class = NumberStaticInt200
  readonly name = this.#class.name

  static readonly bytes = 25
  static readonly bits = 200
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt200
  ) { }

  static create(value: NumberStaticInt200.From) {
    const inner = BigIntStaticInt200.create(BigInt(value))

    return new NumberStaticInt200(inner)
  }

  static from(value: NumberStaticInt200.From) {
    return NumberStaticInt200.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt200`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt200(BigIntStaticInt200.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt200(BigIntStaticInt200.readOrThrow(cursor))
  }

}

export type StaticInt208 =
  | BigIntStaticInt208
  | NumberStaticInt208
  | BytesStaticInt208

export namespace StaticInt208 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt208.From
    | NumberStaticInt208.From
    | BytesStaticInt208.From

  export function create(value: StaticInt208.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt208.create(value)
    if (typeof value === "number")
      return NumberStaticInt208.create(value)
    return BytesStaticInt208.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt208`
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

export namespace BigIntStaticInt208 {
  export type From = bigint
}

export class BigIntStaticInt208 {
  readonly #class = BigIntStaticInt208
  readonly name = this.#class.name

  static readonly bytes = 26
  static readonly bits = 208
  static readonly bitsn = BigInt(208)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt208.From
  ) { }

  static create(value: BigIntStaticInt208.From) {
    return new BigIntStaticInt208(value)
  }

  static from(value: BigIntStaticInt208.From) {
    return BigIntStaticInt208.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt208`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt208(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt208(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt208.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt208.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt208(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt208(value)
  }

}

export namespace NumberStaticInt208 {
  export type From = number
}

export class NumberStaticInt208 {
  readonly #class = NumberStaticInt208
  readonly name = this.#class.name

  static readonly bytes = 26
  static readonly bits = 208
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt208
  ) { }

  static create(value: NumberStaticInt208.From) {
    const inner = BigIntStaticInt208.create(BigInt(value))

    return new NumberStaticInt208(inner)
  }

  static from(value: NumberStaticInt208.From) {
    return NumberStaticInt208.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt208`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt208(BigIntStaticInt208.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt208(BigIntStaticInt208.readOrThrow(cursor))
  }

}

export type StaticInt216 =
  | BigIntStaticInt216
  | NumberStaticInt216
  | BytesStaticInt216

export namespace StaticInt216 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt216.From
    | NumberStaticInt216.From
    | BytesStaticInt216.From

  export function create(value: StaticInt216.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt216.create(value)
    if (typeof value === "number")
      return NumberStaticInt216.create(value)
    return BytesStaticInt216.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt216`
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

export namespace BigIntStaticInt216 {
  export type From = bigint
}

export class BigIntStaticInt216 {
  readonly #class = BigIntStaticInt216
  readonly name = this.#class.name

  static readonly bytes = 27
  static readonly bits = 216
  static readonly bitsn = BigInt(216)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt216.From
  ) { }

  static create(value: BigIntStaticInt216.From) {
    return new BigIntStaticInt216(value)
  }

  static from(value: BigIntStaticInt216.From) {
    return BigIntStaticInt216.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt216`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt216(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt216(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt216.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt216.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt216(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt216(value)
  }

}

export namespace NumberStaticInt216 {
  export type From = number
}

export class NumberStaticInt216 {
  readonly #class = NumberStaticInt216
  readonly name = this.#class.name

  static readonly bytes = 27
  static readonly bits = 216
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt216
  ) { }

  static create(value: NumberStaticInt216.From) {
    const inner = BigIntStaticInt216.create(BigInt(value))

    return new NumberStaticInt216(inner)
  }

  static from(value: NumberStaticInt216.From) {
    return NumberStaticInt216.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt216`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt216(BigIntStaticInt216.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt216(BigIntStaticInt216.readOrThrow(cursor))
  }

}

export type StaticInt224 =
  | BigIntStaticInt224
  | NumberStaticInt224
  | BytesStaticInt224

export namespace StaticInt224 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt224.From
    | NumberStaticInt224.From
    | BytesStaticInt224.From

  export function create(value: StaticInt224.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt224.create(value)
    if (typeof value === "number")
      return NumberStaticInt224.create(value)
    return BytesStaticInt224.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt224`
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

export namespace BigIntStaticInt224 {
  export type From = bigint
}

export class BigIntStaticInt224 {
  readonly #class = BigIntStaticInt224
  readonly name = this.#class.name

  static readonly bytes = 28
  static readonly bits = 224
  static readonly bitsn = BigInt(224)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt224.From
  ) { }

  static create(value: BigIntStaticInt224.From) {
    return new BigIntStaticInt224(value)
  }

  static from(value: BigIntStaticInt224.From) {
    return BigIntStaticInt224.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt224`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt224(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt224(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt224.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt224.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt224(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt224(value)
  }

}

export namespace NumberStaticInt224 {
  export type From = number
}

export class NumberStaticInt224 {
  readonly #class = NumberStaticInt224
  readonly name = this.#class.name

  static readonly bytes = 28
  static readonly bits = 224
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt224
  ) { }

  static create(value: NumberStaticInt224.From) {
    const inner = BigIntStaticInt224.create(BigInt(value))

    return new NumberStaticInt224(inner)
  }

  static from(value: NumberStaticInt224.From) {
    return NumberStaticInt224.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt224`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt224(BigIntStaticInt224.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt224(BigIntStaticInt224.readOrThrow(cursor))
  }

}

export type StaticInt232 =
  | BigIntStaticInt232
  | NumberStaticInt232
  | BytesStaticInt232

export namespace StaticInt232 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt232.From
    | NumberStaticInt232.From
    | BytesStaticInt232.From

  export function create(value: StaticInt232.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt232.create(value)
    if (typeof value === "number")
      return NumberStaticInt232.create(value)
    return BytesStaticInt232.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt232`
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

export namespace BigIntStaticInt232 {
  export type From = bigint
}

export class BigIntStaticInt232 {
  readonly #class = BigIntStaticInt232
  readonly name = this.#class.name

  static readonly bytes = 29
  static readonly bits = 232
  static readonly bitsn = BigInt(232)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt232.From
  ) { }

  static create(value: BigIntStaticInt232.From) {
    return new BigIntStaticInt232(value)
  }

  static from(value: BigIntStaticInt232.From) {
    return BigIntStaticInt232.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt232`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt232(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt232(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt232.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt232.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt232(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt232(value)
  }

}

export namespace NumberStaticInt232 {
  export type From = number
}

export class NumberStaticInt232 {
  readonly #class = NumberStaticInt232
  readonly name = this.#class.name

  static readonly bytes = 29
  static readonly bits = 232
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt232
  ) { }

  static create(value: NumberStaticInt232.From) {
    const inner = BigIntStaticInt232.create(BigInt(value))

    return new NumberStaticInt232(inner)
  }

  static from(value: NumberStaticInt232.From) {
    return NumberStaticInt232.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt232`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt232(BigIntStaticInt232.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt232(BigIntStaticInt232.readOrThrow(cursor))
  }

}

export type StaticInt240 =
  | BigIntStaticInt240
  | NumberStaticInt240
  | BytesStaticInt240

export namespace StaticInt240 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt240.From
    | NumberStaticInt240.From
    | BytesStaticInt240.From

  export function create(value: StaticInt240.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt240.create(value)
    if (typeof value === "number")
      return NumberStaticInt240.create(value)
    return BytesStaticInt240.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt240`
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

export namespace BigIntStaticInt240 {
  export type From = bigint
}

export class BigIntStaticInt240 {
  readonly #class = BigIntStaticInt240
  readonly name = this.#class.name

  static readonly bytes = 30
  static readonly bits = 240
  static readonly bitsn = BigInt(240)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt240.From
  ) { }

  static create(value: BigIntStaticInt240.From) {
    return new BigIntStaticInt240(value)
  }

  static from(value: BigIntStaticInt240.From) {
    return BigIntStaticInt240.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt240`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt240(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt240(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt240.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt240.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt240(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt240(value)
  }

}

export namespace NumberStaticInt240 {
  export type From = number
}

export class NumberStaticInt240 {
  readonly #class = NumberStaticInt240
  readonly name = this.#class.name

  static readonly bytes = 30
  static readonly bits = 240
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt240
  ) { }

  static create(value: NumberStaticInt240.From) {
    const inner = BigIntStaticInt240.create(BigInt(value))

    return new NumberStaticInt240(inner)
  }

  static from(value: NumberStaticInt240.From) {
    return NumberStaticInt240.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt240`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt240(BigIntStaticInt240.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt240(BigIntStaticInt240.readOrThrow(cursor))
  }

}

export type StaticInt248 =
  | BigIntStaticInt248
  | NumberStaticInt248
  | BytesStaticInt248

export namespace StaticInt248 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt248.From
    | NumberStaticInt248.From
    | BytesStaticInt248.From

  export function create(value: StaticInt248.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt248.create(value)
    if (typeof value === "number")
      return NumberStaticInt248.create(value)
    return BytesStaticInt248.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt248`
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

export namespace BigIntStaticInt248 {
  export type From = bigint
}

export class BigIntStaticInt248 {
  readonly #class = BigIntStaticInt248
  readonly name = this.#class.name

  static readonly bytes = 31
  static readonly bits = 248
  static readonly bitsn = BigInt(248)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt248.From
  ) { }

  static create(value: BigIntStaticInt248.From) {
    return new BigIntStaticInt248(value)
  }

  static from(value: BigIntStaticInt248.From) {
    return BigIntStaticInt248.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt248`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt248(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt248(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt248.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt248.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt248(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt248(value)
  }

}

export namespace NumberStaticInt248 {
  export type From = number
}

export class NumberStaticInt248 {
  readonly #class = NumberStaticInt248
  readonly name = this.#class.name

  static readonly bytes = 31
  static readonly bits = 248
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt248
  ) { }

  static create(value: NumberStaticInt248.From) {
    const inner = BigIntStaticInt248.create(BigInt(value))

    return new NumberStaticInt248(inner)
  }

  static from(value: NumberStaticInt248.From) {
    return NumberStaticInt248.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt248`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt248(BigIntStaticInt248.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt248(BigIntStaticInt248.readOrThrow(cursor))
  }

}

export type StaticInt256 =
  | BigIntStaticInt256
  | NumberStaticInt256
  | BytesStaticInt256

export namespace StaticInt256 {
  export const dynamic = false
  export const size = 32

  export type From =
    | BigIntStaticInt256.From
    | NumberStaticInt256.From
    | BytesStaticInt256.From

  export function create(value: StaticInt256.From) {
    if (typeof value === "bigint")
      return BigIntStaticInt256.create(value)
    if (typeof value === "number")
      return NumberStaticInt256.create(value)
    return BytesStaticInt256.create(value)
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

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
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
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt256`
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

export namespace BigIntStaticInt256 {
  export type From = bigint
}

export class BigIntStaticInt256 {
  readonly #class = BigIntStaticInt256
  readonly name = this.#class.name

  static readonly bytes = 32
  static readonly bits = 256
  static readonly bitsn = BigInt(256)
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: BigIntStaticInt256.From
  ) { }

  static create(value: BigIntStaticInt256.From) {
    return new BigIntStaticInt256(value)
  }

  static from(value: BigIntStaticInt256.From) {
    return BigIntStaticInt256.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticInt256`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16).padStart(64, "0")
    }

    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      return value.toString(16)
    }

    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const mask = (BN_1 << this.bitsn) - BN_1

    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(64))

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt256(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt256(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    if (this.value < BN_0) {
      const mask = (BN_1 << 256n) - BN_1
      const value = ((~(-this.value)) & mask) + BN_1

      using slice = BigInts.exportOrThrow(value)

      cursor.writeOrThrow(slice.bytes)

      return
    }

    using slice = BigInts.exportOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BigIntStaticInt256.bytes

    const mask = (BN_1 << this.bitsn) - BN_1

    const bytes = cursor.readOrThrow(BigIntStaticInt256.bytes)
    const value = BigInts.importOrThrow(bytes)

    if ((value & mask) >> (this.bitsn - BN_1))
      return new BigIntStaticInt256(-(((~value) & mask) + BN_1))
    return new BigIntStaticInt256(value)
  }

}

export namespace NumberStaticInt256 {
  export type From = number
}

export class NumberStaticInt256 {
  readonly #class = NumberStaticInt256
  readonly name = this.#class.name

  static readonly bytes = 32
  static readonly bits = 256
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly inner: BigIntStaticInt256
  ) { }

  static create(value: NumberStaticInt256.From) {
    const inner = BigIntStaticInt256.create(BigInt(value))

    return new NumberStaticInt256(inner)
  }

  static from(value: NumberStaticInt256.From) {
    return NumberStaticInt256.create(value)
  }

  intoOrThrow() {
    return Number(this.inner.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticInt256`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new NumberStaticInt256(BigIntStaticInt256.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new NumberStaticInt256(BigIntStaticInt256.readOrThrow(cursor))
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