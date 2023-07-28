import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";

export interface Uint<N extends number> {
  readonly value: bigint
  readonly bits: N
}

export const Uint = <N extends number>(bits: N) => {
  const Uint = class {
    get #class() { return Uint }

    static readonly bits = bits

    static readonly bytes = bits / 8

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Uint(value)
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
        const bytes = Bytes.fromBigInt(this.value)

        cursor.fill(0, 32 - bytes.length)
        cursor.tryWrite(bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Uint<N>, BinaryReadError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Uint.bytes

        const bytes = cursor.tryRead(Uint.bytes).throw(t)
        const value = Bytes.toBigInt(bytes)

        return new Ok(new Uint(value))
      })
    }
  }

  return Uint
}

export const Uint8 = Uint(8)
export const Uint16 = Uint(16)
export const Uint32 = Uint(32)
export const Uint64 = Uint(64)
export const Uint128 = Uint(128)
export const Uint160 = Uint(160)
export const Uint256 = Uint(256)