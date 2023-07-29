import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "../abi.js";

export interface UintN<N extends number = number> extends Writable<never, BinaryWriteError> {
  readonly class: Factory<UintN<N>>
  readonly value: bigint
  readonly bytes: N
}

export const UintN = <N extends number = number>(bytes: N) => class Uint {
  readonly #class = Uint

  static readonly bits = bytes * 8

  static readonly bytes = bytes

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint(value)
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
      const bytes = Bytes.fromBigInt(this.value)

      cursor.fill(0, 32 - bytes.length)
      cursor.tryWrite(bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<UintN<N>, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint.bytes

      const bytes = cursor.tryRead(Uint.bytes).throw(t)
      const value = Bytes.toBigInt(bytes)

      return new Ok(new Uint(value))
    })
  }
}

export const Uint8 = UintN(1)
export const Uint16 = UintN(2)
export const Uint32 = UintN(4)
export const Uint64 = UintN(8)
export const Uint128 = UintN(16)
export const Uint160 = UintN(20)
export const Uint256 = UintN(32)