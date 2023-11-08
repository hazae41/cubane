import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesDynamicBytes } from "../index.js";

export namespace DynamicString {
  export type From = Bytes | string
}

export class DynamicString {
  readonly #class = DynamicString

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly inner: BytesDynamicBytes
  ) { }

  static create(value: DynamicString.From): DynamicString {
    if (typeof value === "string")
      return DynamicString.create(Bytes.fromUtf8(value))
    return new DynamicString(BytesDynamicBytes.create(value))
  }

  static from(value: DynamicString.From) {
    return DynamicString.create(value)
  }

  intoOrThrow() {
    return Bytes.toUtf8(this.inner.intoOrThrow())
  }

  static codegen() {
    return `Cubane.Abi.DynamicString`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new DynamicString(BytesDynamicBytes.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    return this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new DynamicString(BytesDynamicBytes.readOrThrow(cursor))
  }

}