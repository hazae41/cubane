import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";

export type StaticBigUintInstance<N extends number> =
  Readable.ReadOutput<StaticBigUintFactory<N>>

export type StaticBigUintFactory<N extends number> =
  ReturnType<typeof createStaticBigUint<N>> & { readonly name: string }

export namespace StaticBigUint {
  export const name = "StaticBigUint"

  export function isInstance<N extends number>(x: Skeleton<StaticBigUintInstance<N>>): x is StaticBigUintInstance<N> {
    return x.name === name && x.class != null
  }

  export function isFactory<N extends number>(x: Skeleton<StaticBigUintFactory<N>>): x is StaticBigUintFactory<N> {
    return x.name === name && x.prototype != null
  }

}

export const createStaticBigUint = <N extends number = number>(bytes: N) => {
  return class StaticBigUint {
    readonly #class = StaticBigUint
    readonly name = this.#class.name

    static readonly bytes = bytes
    static readonly bits = bytes * 8
    static readonly nibbles = bytes * 2

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new StaticBigUint(value)
    }

    static from(value: bigint) {
      return new StaticBigUint(value)
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

    static decode(cursor: TextCursor) {
      cursor.offset += 64 - StaticBigUint.nibbles

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(StaticBigUint.nibbles))

      return new StaticBigUint(value)
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

    static tryRead(cursor: Cursor): Result<StaticBigUint, BinaryReadError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - StaticBigUint.bytes

        const bytes = cursor.tryRead(StaticBigUint.bytes).throw(t)
        const value = Bytes.toBigInt(bytes)

        return new Ok(new StaticBigUint(value))
      })
    }
  }
}

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

    static readonly bytes = bytes
    static readonly bits = bytes * 8

    readonly size = 32 as const

    private constructor(
      readonly value: number
    ) { }

    static new(value: number) {
      return new StaticUint(value)
    }

    static from(value: number) {
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

    static decode(cursor: TextCursor) {
      cursor.offset += 64 - 8

      const value = parseInt(cursor.read(8), 16)

      return new StaticUint(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
      return Result.unthrowSync(t => {
        cursor.fill(0, 32 - 4)
        cursor.tryWriteUint32(this.value).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<StaticUint, BinaryReadError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - 4

        const value = cursor.tryReadUint32().throw(t)

        return new Ok(new StaticUint(value))
      })
    }
  }
}

export const Uint8 = createStaticUint(1)
export const Uint16 = createStaticUint(2)
export const Uint24 = createStaticUint(3)
export const Uint32 = createStaticUint(4)
export const Uint40 = createStaticBigUint(5)
export const Uint48 = createStaticBigUint(6)
export const Uint56 = createStaticBigUint(7)
export const Uint64 = createStaticBigUint(8)
export const Uint72 = createStaticBigUint(9)
export const Uint80 = createStaticBigUint(10)
export const Uint88 = createStaticBigUint(11)
export const Uint96 = createStaticBigUint(12)
export const Uint104 = createStaticBigUint(13)
export const Uint112 = createStaticBigUint(14)
export const Uint120 = createStaticBigUint(15)
export const Uint128 = createStaticBigUint(16)
export const Uint136 = createStaticBigUint(17)
export const Uint144 = createStaticBigUint(18)
export const Uint152 = createStaticBigUint(19)
export const Uint160 = createStaticBigUint(20)
export const Uint168 = createStaticBigUint(21)
export const Uint176 = createStaticBigUint(22)
export const Uint184 = createStaticBigUint(23)
export const Uint192 = createStaticBigUint(24)
export const Uint200 = createStaticBigUint(25)
export const Uint208 = createStaticBigUint(26)
export const Uint216 = createStaticBigUint(27)
export const Uint224 = createStaticBigUint(28)
export const Uint232 = createStaticBigUint(29)
export const Uint240 = createStaticBigUint(30)
export const Uint248 = createStaticBigUint(31)
export const Uint256 = createStaticBigUint(32)