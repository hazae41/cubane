import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";

export type BigUintInstance<N extends number> =
  Readable.ReadOutput<BigUintFactory<N>>

export type BigUintFactory<N extends number> =
  ReturnType<typeof createBigUint<N>> & { readonly name: string }

export namespace BigUint {
  export const name = "BigUint"

  export function isInstance<N extends number>(x: Skeleton<BigUintInstance<N>>): x is BigUintInstance<N> {
    return x.name === name && x.class != null
  }

  export function isFactory<N extends number>(x: Skeleton<BigUintFactory<N>>): x is BigUintFactory<N> {
    return x.name === name && x.prototype != null
  }

}

export const createBigUint = <N extends number = number>(bytes: N) => {
  return class BigUint {
    readonly #class = BigUint
    readonly name = this.#class.name

    static readonly bytes = bytes
    static readonly bits = bytes * 8
    static readonly nibbles = bytes * 2

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new BigUint(value)
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
      cursor.offset += 64 - BigUint.nibbles

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(BigUint.nibbles))

      return new BigUint(value)
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

    static tryRead(cursor: Cursor): Result<BigUint, BinaryReadError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - BigUint.bytes

        const bytes = cursor.tryRead(BigUint.bytes).throw(t)
        const value = Bytes.toBigInt(bytes)

        return new Ok(new BigUint(value))
      })
    }
  }
}

export type UintInstance<N extends number> =
  Readable.ReadOutput<UintFactory<N>>

export type UintFactory<N extends number> =
  ReturnType<typeof createUint<N>> & { readonly name: string }

export namespace Uint {
  export const name = "Uint"

  export function isInstance<N extends number>(x: Skeleton<UintInstance<N>>): x is UintInstance<N> {
    return x.name === name && x.class != null
  }

  export function isFactory<N extends number>(x: Skeleton<UintFactory<N>>): x is UintFactory<N> {
    return x.name === name && x.prototype != null
  }

}

export const createUint = <N extends number = number>(bytes: N) => {
  return class Uint {
    readonly #class = Uint
    readonly name = this.#class.name

    static readonly bytes = bytes
    static readonly bits = bytes * 8

    readonly size = 32 as const

    private constructor(
      readonly value: number
    ) { }

    static new(value: number) {
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

    encode() {
      return this.value.toString(16).padStart(64, "0")
    }

    encodePacked() {
      return this.value.toString(16)
    }

    static decode(cursor: TextCursor) {
      cursor.offset += 64 - 8

      const value = parseInt(cursor.read(8), 16)

      return new Uint(value)
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

    static tryRead(cursor: Cursor): Result<Uint, BinaryReadError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - 4

        const value = cursor.tryReadUint32().throw(t)

        return new Ok(new Uint(value))
      })
    }
  }
}

export const Uint8 = createUint(1)
export const Uint16 = createUint(2)
export const Uint24 = createUint(3)
export const Uint32 = createUint(4)
export const Uint40 = createBigUint(5)
export const Uint48 = createBigUint(6)
export const Uint56 = createBigUint(7)
export const Uint64 = createBigUint(8)
export const Uint72 = createBigUint(9)
export const Uint80 = createBigUint(10)
export const Uint88 = createBigUint(11)
export const Uint96 = createBigUint(12)
export const Uint104 = createBigUint(13)
export const Uint112 = createBigUint(14)
export const Uint120 = createBigUint(15)
export const Uint128 = createBigUint(16)
export const Uint136 = createBigUint(17)
export const Uint144 = createBigUint(18)
export const Uint152 = createBigUint(19)
export const Uint160 = createBigUint(20)
export const Uint168 = createBigUint(21)
export const Uint176 = createBigUint(22)
export const Uint184 = createBigUint(23)
export const Uint192 = createBigUint(24)
export const Uint200 = createBigUint(25)
export const Uint208 = createBigUint(26)
export const Uint216 = createBigUint(27)
export const Uint224 = createBigUint(28)
export const Uint232 = createBigUint(29)
export const Uint240 = createBigUint(30)
export const Uint248 = createBigUint(31)
export const Uint256 = createBigUint(32)