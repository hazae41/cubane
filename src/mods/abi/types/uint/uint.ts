import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "mods/abi/abi.js";

export interface StaticUint<N extends number = number> extends Writable<never, BinaryWriteError> {
  readonly class: Factory<StaticUint<N>>
  readonly value: bigint
  readonly bytes: N
}

export const createStaticUint = <N extends number = number>(bytes: N) => class Class {
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

  static tryRead(cursor: Cursor): Result<StaticUint<N>, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Class.bytes

      const bytes = cursor.tryRead(Class.bytes).throw(t)
      const value = Bytes.toBigInt(bytes)

      return new Ok(new Class(value))
    })
  }
}

export const Uint8 = createStaticUint(1)
export const Uint16 = createStaticUint(2)
export const Uint24 = createStaticUint(3)
export const Uint32 = createStaticUint(4)
export const Uint40 = createStaticUint(5)
export const Uint48 = createStaticUint(6)
export const Uint56 = createStaticUint(7)
export const Uint64 = createStaticUint(8)
export const Uint72 = createStaticUint(9)
export const Uint80 = createStaticUint(10)
export const Uint88 = createStaticUint(11)
export const Uint96 = createStaticUint(12)
export const Uint104 = createStaticUint(13)
export const Uint112 = createStaticUint(14)
export const Uint120 = createStaticUint(15)
export const Uint128 = createStaticUint(16)
export const Uint136 = createStaticUint(17)
export const Uint144 = createStaticUint(18)
export const Uint152 = createStaticUint(19)
export const Uint160 = createStaticUint(20)
export const Uint168 = createStaticUint(21)
export const Uint176 = createStaticUint(22)
export const Uint184 = createStaticUint(23)
export const Uint192 = createStaticUint(24)
export const Uint200 = createStaticUint(25)
export const Uint208 = createStaticUint(26)
export const Uint216 = createStaticUint(27)
export const Uint224 = createStaticUint(28)
export const Uint232 = createStaticUint(29)
export const Uint240 = createStaticUint(30)
export const Uint248 = createStaticUint(31)
export const Uint256 = createStaticUint(32)