import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "mods/abi/abi.js";

export interface Uint<N extends number = number> extends Writable<never, BinaryWriteError> {
  readonly class: Factory<Uint<N>>
  readonly value: bigint
  readonly bytes: N
}

export const createUint = <N extends number = number>(bytes: N) => class Class {
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
      const bytes = Bytes.fromBigInt(this.value)

      cursor.fill(0, 32 - bytes.length)
      cursor.tryWrite(bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint<N>, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Class.bytes

      const bytes = cursor.tryRead(Class.bytes).throw(t)
      const value = Bytes.toBigInt(bytes)

      return new Ok(new Class(value))
    })
  }
}

export const Uint8 = createUint(1)
export const Uint16 = createUint(2)
export const Uint24 = createUint(3)
export const Uint32 = createUint(4)
export const Uint40 = createUint(5)
export const Uint48 = createUint(6)
export const Uint56 = createUint(7)
export const Uint64 = createUint(8)
export const Uint72 = createUint(9)
export const Uint80 = createUint(10)
export const Uint88 = createUint(11)
export const Uint96 = createUint(12)
export const Uint104 = createUint(13)
export const Uint112 = createUint(14)
export const Uint120 = createUint(15)
export const Uint128 = createUint(16)
export const Uint136 = createUint(17)
export const Uint144 = createUint(18)
export const Uint152 = createUint(19)
export const Uint160 = createUint(20)
export const Uint168 = createUint(21)
export const Uint176 = createUint(22)
export const Uint184 = createUint(23)
export const Uint192 = createUint(24)
export const Uint200 = createUint(25)
export const Uint208 = createUint(26)
export const Uint216 = createUint(27)
export const Uint224 = createUint(28)
export const Uint232 = createUint(29)
export const Uint240 = createUint(30)
export const Uint248 = createUint(31)
export const Uint256 = createUint(32)