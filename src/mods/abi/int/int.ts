import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";

const BN_0 = 0n
const BN_1 = 1n

export interface Int<N extends number> {
  readonly value: bigint
  readonly bits: N
}

export const Int = <N extends number>(bits: N) => class {
  readonly #class = Int(bits)

  static readonly bits = bits

  static readonly bytes = bits / 8

  constructor(
    readonly value: bigint
  ) { }

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
      cursor.offset += 32 - this.bytes

      const bytes = cursor.tryRead(this.bytes).throw(t)
      const value = Bytes.toBigInt(bytes)

      const bitsn = BigInt(bits)

      const mask = (BN_1 << bitsn) - BN_1
      const masked = value & mask

      if (masked >> (bitsn - BN_1)) {
        const signed = -(((~value) & mask) + BN_1)

        return new Ok(new this(signed))
      }

      return new Ok(new this(value))
    })
  }

}