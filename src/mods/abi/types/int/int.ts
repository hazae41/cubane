import { Base16 } from "@hazae41/base16";
import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";

const BN_0 = 0n
const BN_1 = 1n

export type StaticBigIntInstance<N extends number> =
  Readable.ReadOutput<StaticBigIntFactory<N>>

export type StaticBigIntFactory<N extends number> =
  ReturnType<typeof createStaticBigInt<N>> & { readonly name: string }

export namespace StaticBigInt {
  export const name = "StaticBigInt"

  export function isInstance<N extends number>(x: Skeleton<StaticBigIntInstance<N>>): x is StaticBigIntInstance<N> {
    return x.name === name && x.class != null
  }

  export function isFactory<N extends number>(x: Skeleton<StaticBigIntFactory<N>>): x is StaticBigIntFactory<N> {
    return x.name === name && x.prototype != null
  }

}

export const createStaticBigInt = <N extends number = number>(bytes: N) => {
  return class StaticBigInt {
    readonly #class = StaticBigInt
    readonly name = this.#class.name

    static readonly bits = bytes * 8
    static readonly bitsn = BigInt(this.bits)

    static readonly bytes = bytes

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new StaticBigInt(value)
    }

    static from(value: bigint) {
      return new StaticBigInt(value)
    }

    static codegen() {
      return `Cubane.Abi.createStaticBigInt(${bytes})`
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

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new StaticBigInt(-(((~value) & mask) + BN_1))
      return new StaticBigInt(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<StaticBigInt, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - StaticBigInt.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(StaticBigInt.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new StaticBigInt(-(((~value) & mask) + BN_1)))
        return new Ok(new StaticBigInt(value))
      })
    }
  }
}

export const Int8 = createStaticBigInt(1)
export const Int16 = createStaticBigInt(2)
export const Int24 = createStaticBigInt(3)
export const Int32 = createStaticBigInt(4)
export const Int40 = createStaticBigInt(5)
export const Int48 = createStaticBigInt(6)
export const Int56 = createStaticBigInt(7)
export const Int64 = createStaticBigInt(8)
export const Int72 = createStaticBigInt(9)
export const Int80 = createStaticBigInt(10)
export const Int88 = createStaticBigInt(11)
export const Int96 = createStaticBigInt(12)
export const Int104 = createStaticBigInt(13)
export const Int112 = createStaticBigInt(14)
export const Int120 = createStaticBigInt(15)
export const Int128 = createStaticBigInt(16)
export const Int136 = createStaticBigInt(17)
export const Int144 = createStaticBigInt(18)
export const Int152 = createStaticBigInt(19)
export const Int160 = createStaticBigInt(20)
export const Int168 = createStaticBigInt(21)
export const Int176 = createStaticBigInt(22)
export const Int184 = createStaticBigInt(23)
export const Int192 = createStaticBigInt(24)
export const Int200 = createStaticBigInt(25)
export const Int208 = createStaticBigInt(26)
export const Int216 = createStaticBigInt(27)
export const Int224 = createStaticBigInt(28)
export const Int232 = createStaticBigInt(29)
export const Int240 = createStaticBigInt(30)
export const Int248 = createStaticBigInt(31)
export const Int256 = createStaticBigInt(32)

export type IntByName = {
  int8: typeof Int8,
  int16: typeof Int16,
  int24: typeof Int24,
  int32: typeof Int32,
  int40: typeof Int40,
  int48: typeof Int48,
  int56: typeof Int56,
  int64: typeof Int64,
  int72: typeof Int72,
  int80: typeof Int80,
  int88: typeof Int88,
  int96: typeof Int96,
  int104: typeof Int104,
  int112: typeof Int112,
  int120: typeof Int120,
  int128: typeof Int128,
  int136: typeof Int136,
  int144: typeof Int144,
  int152: typeof Int152,
  int160: typeof Int160,
  int168: typeof Int168,
  int176: typeof Int176,
  int184: typeof Int184,
  int192: typeof Int192,
  int200: typeof Int200,
  int208: typeof Int208,
  int216: typeof Int216,
  int224: typeof Int224,
  int232: typeof Int232,
  int240: typeof Int240,
  int248: typeof Int248,
  int256: typeof Int256,
}

export const intByName: IntByName = {
  int8: Int8,
  int16: Int16,
  int24: Int24,
  int32: Int32,
  int40: Int40,
  int48: Int48,
  int56: Int56,
  int64: Int64,
  int72: Int72,
  int80: Int80,
  int88: Int88,
  int96: Int96,
  int104: Int104,
  int112: Int112,
  int120: Int120,
  int128: Int128,
  int136: Int136,
  int144: Int144,
  int152: Int152,
  int160: Int160,
  int168: Int168,
  int176: Int176,
  int184: Int184,
  int192: Int192,
  int200: Int200,
  int208: Int208,
  int216: Int216,
  int224: Int224,
  int232: Int232,
  int240: Int240,
  int248: Int248,
  int256: Int256,
}