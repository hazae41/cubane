import { Base16 } from "@hazae41/base16";
import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Box, Copied } from "@hazae41/box";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";
import { Uint32 } from "../uint/uint.js";

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
    static readonly nibbles = bytes * 2

    static readonly bits = bytes * 8

    readonly size = 32 as const

    private constructor(
      readonly value: Uint8Array & { readonly length: N }
    ) { }

    static new(value: Uint8Array & { readonly length: N }) {
      return new StaticBytes(value)
    }

    static from(value: Uint8Array & { readonly length: N }) {
      return new StaticBytes(value)
    }

    static codegen() {
      return `Cubane.Abi.createStaticBytes(${bytes})`
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

    encodeOrThrow() {
      const box = new Box(new Copied(this.value))
      const hex = Base16.get().tryEncode(box).unwrap()
      return hex.padStart(64, "0")
    }

    encodePackedOrThrow() {
      const box = new Box(new Copied(this.value))
      return Base16.get().tryEncode(box).unwrap()
    }

    static decodeOrThrow(cursor: TextCursor) {
      const text = cursor.read(StaticBytes.nibbles)

      const unsized = Base16.get().tryPadStartAndDecode(text).unwrap().copyAndDispose().bytes
      const sized = Bytes.tryCast(unsized, StaticBytes.bytes).unwrap()

      cursor.offset += 64 - StaticBytes.nibbles

      return new StaticBytes(sized)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
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

export type BytesByName = {
  bytes1: typeof Bytes1,
  bytes2: typeof Bytes2,
  bytes3: typeof Bytes3,
  bytes4: typeof Bytes4,
  bytes5: typeof Bytes5,
  bytes6: typeof Bytes6,
  bytes7: typeof Bytes7,
  bytes8: typeof Bytes8,
  bytes9: typeof Bytes9,
  bytes10: typeof Bytes10,
  bytes11: typeof Bytes11,
  bytes12: typeof Bytes12,
  bytes13: typeof Bytes13,
  bytes14: typeof Bytes14,
  bytes15: typeof Bytes15,
  bytes16: typeof Bytes16,
  bytes17: typeof Bytes17,
  bytes18: typeof Bytes18,
  bytes19: typeof Bytes19,
  bytes20: typeof Bytes20,
  bytes21: typeof Bytes21,
  bytes22: typeof Bytes22,
  bytes23: typeof Bytes23,
  bytes24: typeof Bytes24,
  bytes25: typeof Bytes25,
  bytes26: typeof Bytes26,
  bytes27: typeof Bytes27,
  bytes28: typeof Bytes28,
  bytes29: typeof Bytes29,
  bytes30: typeof Bytes30,
  bytes31: typeof Bytes31,
  bytes32: typeof Bytes32,
}

export const bytesByName: BytesByName = {
  bytes1: Bytes1,
  bytes2: Bytes2,
  bytes3: Bytes3,
  bytes4: Bytes4,
  bytes5: Bytes5,
  bytes6: Bytes6,
  bytes7: Bytes7,
  bytes8: Bytes8,
  bytes9: Bytes9,
  bytes10: Bytes10,
  bytes11: Bytes11,
  bytes12: Bytes12,
  bytes13: Bytes13,
  bytes14: Bytes14,
  bytes15: Bytes15,
  bytes16: Bytes16,
  bytes17: Bytes17,
  bytes18: Bytes18,
  bytes19: Bytes19,
  bytes20: Bytes20,
  bytes21: Bytes21,
  bytes22: Bytes22,
  bytes23: Bytes23,
  bytes24: Bytes24,
  bytes25: Bytes25,
  bytes26: Bytes26,
  bytes27: Bytes27,
  bytes28: Bytes28,
  bytes29: Bytes29,
  bytes30: Bytes30,
  bytes31: Bytes31,
  bytes32: Bytes32,
} as const

export class DynamicBytes<N extends number = number> {
  readonly #class = DynamicBytes

  constructor(
    readonly value: Uint8Array & { readonly length: N },
    readonly size: number
  ) { }

  static new<N extends number>(value: Uint8Array & { readonly length: N }) {
    return new DynamicBytes(value, 32 + (Math.ceil(value.length / 32) * 32))
  }

  static from<N extends number>(value: Uint8Array & { readonly length: N }) {
    return new DynamicBytes(value, 32 + (Math.ceil(value.length / 32) * 32))
  }

  static codegen() {
    return `Cubane.Abi.DynamicBytes`
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

  encodeOrThrow() {
    const length = this.value.length.toString(16).padStart(64, "0")
    const box = new Box(new Copied(this.value))
    const value = Base16.get().tryEncode(box).unwrap().padEnd(this.size, "0")

    return length + value
  }

  encodePackedOrThrow() {
    const length = this.value.length.toString(16)
    const box = new Box(new Copied(this.value))
    const value = Base16.get().tryEncode(box).unwrap()

    return length + value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length = Uint32.decodeOrThrow(cursor).value * 2
    const value = Base16.get().tryPadStartAndDecode(cursor.read(length)).unwrap().copyAndDispose().bytes
    const size = 64 + (Math.ceil(length / 64) * 64)

    cursor.offset += size - 64 - length

    return new DynamicBytes(value, size / 2)
  }

  trySize(): Result<number, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      const length = Uint32.new(this.value.length)

      length.tryWrite(cursor).throw(t)
      cursor.tryWrite(this.value).throw(t)
      cursor.fill(0, this.size - 32 - this.value.length)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<DynamicBytes<number>, BinaryReadError> {
    return Result.unthrowSync(t => {
      const length = Uint32.tryRead(cursor).throw(t)
      const bytes = cursor.tryRead(length.value).throw(t)
      const size = 32 + (Math.ceil(bytes.length / 32) * 32)

      cursor.offset += size - 32 - bytes.length

      return new Ok(new DynamicBytes(bytes, size))
    })
  }

}