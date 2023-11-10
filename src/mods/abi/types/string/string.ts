import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesAbiBytes } from "../bytes/dynamic.js";

export { AbiString as String };

export namespace AbiString {
  export type From = Bytes | string
}

export class AbiString {
  readonly #class = AbiString

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly inner: BytesAbiBytes
  ) { }

  static create(value: AbiString.From): AbiString {
    if (typeof value === "string")
      return AbiString.create(Bytes.fromUtf8(value))
    return new AbiString(BytesAbiBytes.create(value))
  }

  static from(value: AbiString.From) {
    return AbiString.create(value)
  }

  intoOrThrow(): string {
    return Bytes.toUtf8(this.inner.value)
  }

  toJSON(): string {
    return this.intoOrThrow()
  }

  static codegen() {
    return `Abi.String`
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
    return new AbiString(BytesAbiBytes.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    return this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new AbiString(BytesAbiBytes.readOrThrow(cursor))
  }

}