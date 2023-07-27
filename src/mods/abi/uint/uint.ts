import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";

export interface Uint<N extends number> {
  readonly value: bigint
  readonly bits: N
}

export const Uint = <N extends number>(bits: N) => class {
  readonly #class = Uint(bits)

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

  trySize() {
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
      cursor.offset += 32 - this.bytes
      const bytes = cursor.tryRead(this.bytes).throw(t)
      const value = Bytes.toBigInt(bytes)

      return new Ok(new this(value))
    })
  }
}