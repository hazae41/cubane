import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Uint256 } from "../uint/uint.js";

export interface StaticBytes<N extends number = number> extends Writable<never, BinaryWriteError> {
  readonly value: Uint8Array
  readonly bytes: N
}

export const createStaticBytes = <N extends number = number>(bytes: N) => class Class {
  readonly #class = Class

  static readonly bytes = bytes

  static readonly bits = bytes * 8

  private constructor(
    readonly value: Uint8Array & { length: N }
  ) { }

  static new(value: Uint8Array & { length: N }) {
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
      cursor.tryWrite(this.value).throw(t)
      cursor.fill(0, 32 - this.value.length)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<StaticBytes<N>, BinaryReadError> {
    return Result.unthrowSync(t => {
      const bytes = cursor.tryRead(Class.bytes).throw(t)

      cursor.offset += 32 - Class.bytes

      return new Ok(new Class(bytes))
    })
  }

}

export const Bytes8 = createStaticBytes(1)
export const Bytes16 = createStaticBytes(2)
export const Bytes32 = createStaticBytes(4)
export const Bytes64 = createStaticBytes(8)
export const Bytes128 = createStaticBytes(16)
export const Bytes160 = createStaticBytes(20)
export const Bytes256 = createStaticBytes(32)

export class DynamicBytes<N extends number = number> {
  readonly #class = DynamicBytes

  static readonly dynamic = true as const

  private constructor(
    readonly value: Uint8Array & { length: N }
  ) { }

  static new<N extends number>(value: Uint8Array & { length: N }) {
    return new DynamicBytes(value)
  }

  get class() {
    return this.#class
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

  static tryRead(cursor: Cursor): Result<DynamicBytes<number>, BinaryReadError> {
    return Result.unthrowSync(t => {
      const length = Uint256.tryRead(cursor).throw(t)
      const bytes = cursor.tryRead(Number(length.value)).throw(t)
      const size = 32 + (Math.ceil(bytes.length / 32) * 32)

      cursor.offset += size - 32 - bytes.length

      return new Ok(new DynamicBytes(bytes))
    })
  }

}