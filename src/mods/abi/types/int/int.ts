import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "mods/abi/abi.js";

const BN_0 = 0n
const BN_1 = 1n

export interface Int<N extends number = number> extends Writable<never, BinaryWriteError> {
  readonly class: Factory<Int<N>>
  readonly value: bigint
  readonly bytes: N
}

export const createInt = <N extends number = number>(bytes: N) => class Class {
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

  static tryRead(cursor: Cursor): Result<Int<N>, BinaryReadError> {
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

export const Int8 = createInt(1)
export const Int16 = createInt(2)
export const Int24 = createInt(3)
export const Int32 = createInt(4)
export const Int40 = createInt(5)
export const Int48 = createInt(6)
export const Int56 = createInt(7)
export const Int64 = createInt(8)
export const Int72 = createInt(9)
export const Int80 = createInt(10)
export const Int88 = createInt(11)
export const Int96 = createInt(12)
export const Int104 = createInt(13)
export const Int112 = createInt(14)
export const Int120 = createInt(15)
export const Int128 = createInt(16)
export const Int136 = createInt(17)
export const Int144 = createInt(18)
export const Int152 = createInt(19)
export const Int160 = createInt(20)
export const Int168 = createInt(21)
export const Int176 = createInt(22)
export const Int184 = createInt(23)
export const Int192 = createInt(24)
export const Int200 = createInt(25)
export const Int208 = createInt(26)
export const Int216 = createInt(27)
export const Int224 = createInt(28)
export const Int232 = createInt(29)
export const Int240 = createInt(30)
export const Int248 = createInt(31)
export const Int256 = createInt(32)