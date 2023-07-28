import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Uint256 } from "../uint/uint.js";

export interface BytesN<N extends number = number> extends Writable<never, BinaryWriteError> {
  readonly value: Uint8Array
  readonly bytes: N
}

export const BytesN = <N extends number = number>(bytes: N) => {
  const Bytes = class {
    get #class() { return Bytes }

    static readonly bytes = bytes

    static readonly bits = bytes * 8

    private constructor(
      readonly value: Uint8Array & { length: N }
    ) { }

    static new(value: Uint8Array & { length: N }) {
      return new Bytes(value)
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
        cursor.tryWrite(this.value).throw(t)
        cursor.fill(0, 32 - this.value.length)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<BytesN<N>, BinaryReadError> {
      return Result.unthrowSync(t => {
        const bytes = cursor.tryRead(Bytes.bytes).throw(t)

        cursor.offset += 32 - Bytes.bytes

        return new Ok(new Bytes(bytes))
      })
    }

  }

  return Bytes
}

export const Bytes8 = BytesN(1)
export const Bytes16 = BytesN(2)
export const Bytes32 = BytesN(4)
export const Bytes64 = BytesN(8)
export const Bytes128 = BytesN(16)
export const Bytes160 = BytesN(20)
export const Bytes256 = BytesN(32)

export class Bytes<N extends number = number> {
  readonly #class = Bytes

  static readonly dynamic = true as const

  private constructor(
    readonly value: Uint8Array & { length: N }
  ) { }

  static new<N extends number>(value: Uint8Array & { length: N }) {
    return new Bytes(value)
  }

  get dynamic() {
    return this.#class.dynamic
  }

  trySize(): Result<number, never> {
    return new Ok(32 + (Math.ceil(this.value.length / 32) * 32))
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      const length = Uint256.new(BigInt(this.value.length))
      const size = 32 + (Math.ceil(this.value.length / 32) * 32)

      length.tryWrite(cursor).throw(t)
      cursor.tryWrite(this.value).throw(t)
      cursor.fill(0, size - 32 - this.value.length)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Bytes<number>, BinaryReadError> {
    return Result.unthrowSync(t => {
      const length = Uint256.tryRead(cursor).throw(t)
      const bytes = cursor.tryRead(Number(length.value)).throw(t)
      const size = 32 + (Math.ceil(bytes.length / 32) * 32)

      cursor.offset += size - 32 - bytes.length

      return new Ok(new Bytes(bytes))
    })
  }

}