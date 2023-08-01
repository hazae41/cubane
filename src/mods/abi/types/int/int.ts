import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
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

    get class() {
      return this.#class
    }

    get bits() {
      return this.#class.bits
    }

    get bytes() {
      return this.#class.bytes
    }

    encode() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePacked() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decode(cursor: TextCursor) {
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

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          const bytes = Bytes.fromBigInt(value)

          cursor.tryWrite(bytes).throw(t)

          return Ok.void()
        }

        const bytes = Bytes.fromBigInt(this.value)

        cursor.fill(0, 32 - bytes.length)
        cursor.tryWrite(bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<StaticBigInt, BinaryReadError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - StaticBigInt.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(StaticBigInt.bytes).throw(t)
        const value = Bytes.toBigInt(bytes)

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