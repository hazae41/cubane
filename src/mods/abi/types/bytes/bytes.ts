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

export const Bytes1 = createStaticBytes(1)
export const Bytes2 = createStaticBytes(2)
export const Bytes3 = createStaticBytes(3)
export const Bytes4 = createStaticBytes(4)
export const Bytes5 = createStaticBytes(5)
export const Bytes6 = createStaticBytes(6)
export const Bytes7 = createStaticBytes(7)
export const Bytes8 = createStaticBytes(8)
export const Bytes9 = createStaticBytes(9)
export const Bytes10 = createStaticBytes(10)
export const Bytes11 = createStaticBytes(11)
export const Bytes12 = createStaticBytes(12)
export const Bytes13 = createStaticBytes(13)
export const Bytes14 = createStaticBytes(14)
export const Bytes15 = createStaticBytes(15)
export const Bytes16 = createStaticBytes(16)
export const Bytes17 = createStaticBytes(17)
export const Bytes18 = createStaticBytes(18)
export const Bytes19 = createStaticBytes(19)
export const Bytes20 = createStaticBytes(20)
export const Bytes21 = createStaticBytes(21)
export const Bytes22 = createStaticBytes(22)
export const Bytes23 = createStaticBytes(23)
export const Bytes24 = createStaticBytes(24)
export const Bytes25 = createStaticBytes(25)
export const Bytes26 = createStaticBytes(26)
export const Bytes27 = createStaticBytes(27)
export const Bytes28 = createStaticBytes(28)
export const Bytes29 = createStaticBytes(29)
export const Bytes30 = createStaticBytes(30)
export const Bytes31 = createStaticBytes(31)
export const Bytes32 = createStaticBytes(32)

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