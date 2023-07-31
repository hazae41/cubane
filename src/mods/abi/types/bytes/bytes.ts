import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Skeleton } from "libs/typescript/skeleton.js";
import { Uint256 } from "../uint/uint.js";

export type StaticBytesInstance<N extends number> =
  Readable.ReadOutput<StaticBytesFactory<N>>

export type StaticBytesFactory<N extends number> =
  ReturnType<typeof createStaticBytes<N>> & { readonly name: string }

export namespace StaticBytes {
  export const name = "StaticBytes"

  export function isInstance<N extends number>(x: Skeleton<StaticBytesInstance<N>>): x is StaticBytesInstance<N> {
    return x.name === name && x.class != null
  }

  export function isFactory<N extends number>(x: Skeleton<StaticBytesFactory<N>>): x is StaticBytesFactory<N> {
    return x.name === name && x.prototype != null
  }

}

export const createStaticBytes = <N extends number = number>(bytes: N) => {
  return class StaticBytes {
    readonly #class = StaticBytes
    readonly name = this.#class.name

    static readonly bytes = bytes

    static readonly bits = bytes * 8

    private constructor(
      readonly value: Uint8Array & { readonly length: N }
    ) { }

    static new(value: Uint8Array & { readonly length: N }) {
      return new StaticBytes(value)
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
      return Bytes.toHex(this.value).padStart(32, "0")
    }

    encodePacked() {
      return Bytes.toHex(this.value)
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

    static tryRead(cursor: Cursor): Result<StaticBytes, BinaryReadError> {
      return Result.unthrowSync(t => {
        const bytes = cursor.tryRead(StaticBytes.bytes).throw(t)

        cursor.offset += 32 - StaticBytes.bytes

        return new Ok(new StaticBytes(bytes))
      })
    }

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

  private constructor(
    readonly value: Uint8Array & { readonly length: N }
  ) { }

  static new<N extends number>(value: Uint8Array & { readonly length: N }) {
    return new DynamicBytes(value)
  }

  get class() {
    return this.#class
  }

  static get dynamic() {
    return true as const
  }

  get dynamic() {
    return this.#class.dynamic
  }

  encode() {
    const size = 32 + (Math.ceil(this.value.length / 32) * 32)

    const length = this.value.length.toString(16).padStart(32, "0")
    const value = Bytes.toHex(this.value).padEnd(size, "0")

    return length + value
  }

  encodePacked() {
    const length = this.value.length.toString(16)
    const value = Bytes.toHex(this.value)

    return length + value
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