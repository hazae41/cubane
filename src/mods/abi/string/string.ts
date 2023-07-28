import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes as LibBytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Result } from "@hazae41/result";
import { Bytes as AbiBytes } from "mods/abi/bytes/bytes.js";

export class String {
  readonly #class = String

  static readonly dynamic = true as const

  readonly inner: AbiBytes

  private constructor(
    readonly value: string
  ) {
    this.inner = AbiBytes.new(LibBytes.fromUtf8(value))
  }

  static new(value: string) {
    return new String(value)
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

  static tryRead(cursor: Cursor): Result<String, BinaryReadError> {
    return AbiBytes.tryRead(cursor).mapSync(x => new String(LibBytes.toUtf8(x.value)))
  }

}