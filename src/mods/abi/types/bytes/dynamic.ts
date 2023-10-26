import { Base16 } from "@hazae41/base16";
import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { Uint32 } from "../uint/uint.js";

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
    const value = Base16.get().tryEncode(this.value).unwrap().padEnd(this.size, "0")

    return length + value
  }

  encodePackedOrThrow() {
    const length = this.value.length.toString(16)
    const value = Base16.get().tryEncode(this.value).unwrap()

    return length + value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length = Uint32.decodeOrThrow(cursor).value * 2
    const value = Base16.get().tryPadStartAndDecode(cursor.read(length)).unwrap().copyAndDispose()
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