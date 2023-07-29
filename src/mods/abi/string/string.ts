import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Result } from "@hazae41/result";
import { DynamicBytes } from "mods/abi/bytes/bytes.js";

export class DynamicString {
  readonly #class = DynamicString

  static readonly dynamic = true as const

  private constructor(
    readonly value: string,
    readonly inner: DynamicBytes
  ) { }

  static new(value: string) {
    return new DynamicString(value, DynamicBytes.new(Bytes.fromUtf8(value)))
  }

  get class() {
    return this.#class
  }

  get dynamic() {
    return this.#class.dynamic
  }

  trySize(): Result<number, never> {
    return this.inner.trySize()
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return this.inner.tryWrite(cursor)
  }

  static tryRead(cursor: Cursor): Result<DynamicString, BinaryReadError> {
    return DynamicBytes.tryRead(cursor).mapSync(x => new DynamicString(Bytes.toUtf8(x.value), DynamicBytes.new(x.value)))
  }

}