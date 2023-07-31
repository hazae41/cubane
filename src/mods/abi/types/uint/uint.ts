import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Skeleton } from "libs/typescript/skeleton.js";

export type StaticUintInstance<N extends number> =
  Readable.ReadOutput<StaticUintFactory<N>>

export type StaticUintFactory<N extends number> =
  ReturnType<typeof createStaticUint<N>> & { readonly name: string }

export namespace StaticUint {
  export const name = "StaticUint"

  export function isInstance<N extends number>(x: Skeleton<StaticUintInstance<N>>): x is StaticUintInstance<N> {
    return x.name === name && x.class != null
  }

  export function isFactory<N extends number>(x: Skeleton<StaticUintFactory<N>>): x is StaticUintFactory<N> {
    return x.name === name && x.prototype != null
  }

}

export const createStaticUint = <N extends number = number>(bytes: N) => {
  return class StaticUint {
    readonly #class = StaticUint
    readonly name = this.#class.name

    static readonly bits = bytes * 8

    static readonly bytes = bytes

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new StaticUint(value)
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

    encode() {
      return this.value.toString(16).padStart(64, "0")
    }

    encodePacked() {
      return this.value.toString(16)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
      return Result.unthrowSync(t => {
        const bytes = Bytes.fromBigInt(this.value)

        cursor.fill(0, 32 - bytes.length)
        cursor.tryWrite(bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<StaticUint, BinaryReadError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - StaticUint.bytes

        const bytes = cursor.tryRead(StaticUint.bytes).throw(t)
        const value = Bytes.toBigInt(bytes)

        return new Ok(new StaticUint(value))
      })
    }
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