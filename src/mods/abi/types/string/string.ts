import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { DynamicBytes } from "../bytes/dynamic.js";
import { Uint32 } from "../uint/uint.js";

// export type DynamicString = 
// | 

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

  intoOrThrow() {
    return this.value
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

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const inner = DynamicBytes.decodeOrThrow(cursor)
    const value = Bytes.toUtf8(inner.value)

    return new DynamicString(value, inner)
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor): DynamicString {
    const length = Uint32.readOrThrow(cursor)
    const bytes = cursor.getOrThrow(length.value)
    const value = cursor.readUtf8OrThrow(length.value)
    const size = 32 + (Math.ceil(length.value / 32) * 32)

    cursor.offset += size - 32 - length.value

    const inner = new DynamicBytes(bytes, size)

    return new DynamicString(value, inner)
  }

}