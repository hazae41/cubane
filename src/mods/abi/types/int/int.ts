import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";

const BN_0 = 0n
const BN_1 = 1n

export type StaticIntInstance<N extends number> =
  Readable.ReadOutput<StaticIntFactory<N>>

export type StaticIntFactory<N extends number> =
  ReturnType<typeof createStaticInt<N>> & { readonly name: string }

export namespace StaticInt {
  export const name = "StaticInt"

  export function isInstance<N extends number>(x: Skeleton<StaticIntInstance<N>>): x is StaticIntInstance<N> {
    return x.name === name && x.class != null
  }

  export function isFactory<N extends number>(x: Skeleton<StaticIntFactory<N>>): x is StaticIntFactory<N> {
    return x.name === name && x.prototype != null
  }

}

export const createStaticInt = <N extends number = number>(bytes: N) => {
  return class StaticInt {
    readonly #class = StaticInt
    readonly name = this.#class.name

    static readonly bits = bytes * 8
    static readonly bitsn = BigInt(this.bits)

    static readonly bytes = bytes

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new StaticInt(value)
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
        let value = -this.value
        const mask = (BN_1 << 256n) - BN_1
        value = ((~value) & mask) + BN_1

        return this.value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePacked() {
      if (this.value < BN_0) {
        let value = -this.value
        const mask = (BN_1 << 256n) - BN_1
        value = ((~value) & mask) + BN_1

        return this.value.toString(16)
      }

      return this.value.toString(16)
    }

    static decode(cursor: TextCursor) {
      const value = BigInt("0x" + cursor.read(64))

      const mask = (BN_1 << this.bitsn) - BN_1
      const masked = value & mask

      if (masked >> (this.bitsn - BN_1))
        return new StaticInt(-(((~value) & mask) + BN_1))
      return new StaticInt(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          let value = -this.value
          const mask = (BN_1 << 256n) - BN_1
          value = ((~value) & mask) + BN_1

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

    static tryRead(cursor: Cursor): Result<StaticInt, BinaryReadError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - StaticInt.bytes

        const bytes = cursor.tryRead(StaticInt.bytes).throw(t)
        const value = Bytes.toBigInt(bytes)

        const mask = (BN_1 << this.bitsn) - BN_1
        const masked = value & mask

        if (masked >> (this.bitsn - BN_1))
          return new Ok(new StaticInt(-(((~value) & mask) + BN_1)))
        return new Ok(new StaticInt(value))
      })
    }
  }
}

export const Int8 = createStaticInt(1)
export const Int16 = createStaticInt(2)
export const Int24 = createStaticInt(3)
export const Int32 = createStaticInt(4)
export const Int40 = createStaticInt(5)
export const Int48 = createStaticInt(6)
export const Int56 = createStaticInt(7)
export const Int64 = createStaticInt(8)
export const Int72 = createStaticInt(9)
export const Int80 = createStaticInt(10)
export const Int88 = createStaticInt(11)
export const Int96 = createStaticInt(12)
export const Int104 = createStaticInt(13)
export const Int112 = createStaticInt(14)
export const Int120 = createStaticInt(15)
export const Int128 = createStaticInt(16)
export const Int136 = createStaticInt(17)
export const Int144 = createStaticInt(18)
export const Int152 = createStaticInt(19)
export const Int160 = createStaticInt(20)
export const Int168 = createStaticInt(21)
export const Int176 = createStaticInt(22)
export const Int184 = createStaticInt(23)
export const Int192 = createStaticInt(24)
export const Int200 = createStaticInt(25)
export const Int208 = createStaticInt(26)
export const Int216 = createStaticInt(27)
export const Int224 = createStaticInt(28)
export const Int232 = createStaticInt(29)
export const Int240 = createStaticInt(30)
export const Int248 = createStaticInt(31)
export const Int256 = createStaticInt(32)