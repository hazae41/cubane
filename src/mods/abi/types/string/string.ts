import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { DynamicBytes } from "../bytes/bytes.js";

export class DynamicString {
  readonly #class = DynamicString

  private constructor(
    readonly value: string,
    readonly inner: DynamicBytes
  ) { }

  static new(value: string) {
    return new DynamicString(value, DynamicBytes.new(Bytes.fromUtf8(value)))
  }

  static from(value: string) {
    return new DynamicString(value, DynamicBytes.new(Bytes.fromUtf8(value)))
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

    return new DynamicString(Bytes.toUtf8(inner.value), inner)
  }

  trySize(): Result<number, never> {
    return this.inner.trySize()
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return this.inner.tryWrite(cursor)
  }

  static tryRead(cursor: Cursor): Result<DynamicString, BinaryReadError> {
    return DynamicBytes.tryRead(cursor).mapSync(x => new DynamicString(Bytes.toUtf8(x.value), x))
  }

}