import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { DynamicBytes } from "../bytes/bytes.js";
import { Uint32 } from "../index.js";

export class DynamicString {
  readonly #class = DynamicString

  constructor(
    readonly value: string,
    readonly inner: DynamicBytes
  ) { }

  static new(value: string) {
    return new DynamicString(value, DynamicBytes.new(Bytes.fromUtf8(value)))
  }

  static from(value: string) {
    return new DynamicString(value, DynamicBytes.new(Bytes.fromUtf8(value)))
  }

  static codegen() {
    return `Cubane.Abi.DynamicString`
  }

  get class() {
    return this.#class
  }

  get size() {
    return this.inner.size
  }

  static get dynamic() {
    return true as const
  }

  get dynamic() {
    return this.#class.dynamic
  }

  encode() {
    return this.inner.encode()
  }

  encodePacked() {
    return this.inner.encodePacked()
  }

  static decode(cursor: TextCursor) {
    const inner = DynamicBytes.decode(cursor)
    const value = Bytes.toUtf8(inner.value)

    return new DynamicString(value, inner)
  }

  trySize(): Result<number, never> {
    return this.inner.trySize()
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return this.inner.tryWrite(cursor)
  }

  /**
   * Zero-copy read as bytes and as UTF-8
   * @param cursor 
   * @returns 
   */
  static tryRead(cursor: Cursor): Result<DynamicString, BinaryReadError> {
    return Result.unthrowSync(t => {
      const length = Uint32.tryRead(cursor).throw(t)
      const bytes = cursor.tryGet(length.value).throw(t)
      const value = cursor.tryReadUtf8(length.value).throw(t)
      const size = 32 + (Math.ceil(length.value / 32) * 32)

      cursor.offset += size - 32 - length.value

      const inner = new DynamicBytes(bytes, size)

      return new Ok(new DynamicString(value, inner))
    })
  }

}