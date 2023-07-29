import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "../abi.js";

const BN_0 = 0n
const BN_1 = 1n

export interface IntN<N extends number = number> extends Writable<never, BinaryWriteError> {
  readonly class: Factory<IntN<N>>
  readonly value: bigint
  readonly bytes: N
}

export const IntN = <N extends number = number>(bytes: N) => class Int {
  readonly #class = Int

  static readonly bits = bytes * 8

  static readonly bytes = bytes

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Int(value)
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

  static tryRead(cursor: Cursor): Result<IntN<N>, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Int.bytes

      const bytes = cursor.tryRead(Int.bytes).throw(t)
      const value = Bytes.toBigInt(bytes)

      const bits = BigInt(Int.bits)
      const mask = (BN_1 << bits) - BN_1
      const masked = value & mask

      if (masked >> (bits - BN_1)) {
        const signed = -(((~value) & mask) + BN_1)

        return new Ok(new Int(signed))
      }

      return new Ok(new Int(value))
    })
  }
}

export const Int8 = IntN(1)
export const Int16 = IntN(2)
export const Int32 = IntN(4)
export const Int64 = IntN(8)
export const Int128 = IntN(16)
export const Int160 = IntN(20)
export const Int256 = IntN(32)
