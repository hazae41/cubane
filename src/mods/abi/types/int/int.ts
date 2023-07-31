import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "mods/abi/abi.js";

const BN_0 = 0n
const BN_1 = 1n

export interface StaticInt<N extends number = number> extends Writable<never, BinaryWriteError> {
  readonly class: Factory<StaticInt<N>>
  readonly value: bigint
  readonly bytes: N
}

export const createStaticInt = <N extends number = number>(bytes: N) => class Class {
  readonly #class = Class

  static readonly bits = bytes * 8

  static readonly bytes = bytes

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Class(value)
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

  trySize(): Result<number, never> {
    return new Ok(32)
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

  static tryRead(cursor: Cursor): Result<StaticInt<N>, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Class.bytes

      const bytes = cursor.tryRead(Class.bytes).throw(t)
      const value = Bytes.toBigInt(bytes)

      const bits = BigInt(Class.bits)
      const mask = (BN_1 << bits) - BN_1
      const masked = value & mask

      if (masked >> (bits - BN_1)) {
        const signed = -(((~value) & mask) + BN_1)

        return new Ok(new Class(signed))
      }

      return new Ok(new Class(value))
    })
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