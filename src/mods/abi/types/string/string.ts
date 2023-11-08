import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { Uint32 } from "../uint/uint.js";

export type DynamicString =
  | BytesDynamicString
  | StringDynamicString

export namespace DynamicString {
  export type From =
    | BytesDynamicString.From
    | StringDynamicString.From

  export function create(value: DynamicString.From) {
    if (value instanceof Uint8Array)
      return BytesDynamicString.create(value)
    return StringDynamicString.create(value)
  }

  export function from(value: DynamicString.From) {
    return DynamicString.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.DynamicString`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return StringDynamicString.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesDynamicString.readOrThrow(cursor)
  }

}

export namespace BytesDynamicString {
  export type From = Bytes
}

export class BytesDynamicString {
  readonly #class = BytesDynamicString

  constructor(
    readonly value: BytesDynamicString.From
  ) { }

  static create(value: BytesDynamicString.From) {
    return new BytesDynamicString(value)
  }

  static from(value: BytesDynamicString.From) {
    return BytesDynamicString.create(value)
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

  static get dynamic() {
    return true as const
  }

  get dynamic() {
    return this.#class.dynamic
  }

  encodeOrThrow() {
    const length1 = this.value.length
    const length2 = length1 * 2

    const head = Uint32.new(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = Base16.get().encodeOrThrow(this.value).padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length1 = this.value.length

    const head = Uint32.new(length1).encodePackedOrThrow()
    const body = Base16.get().encodeOrThrow(this.value)

    return head + body
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length1 = Uint32.decodeOrThrow(cursor).value
    const length2 = length1 * 2

    const content = cursor.readOrThrow(length2)

    const value = Base16.get().padEndAndDecodeOrThrow(content).copyAndDispose()

    const padded2 = Math.ceil(length2 / 64) * 64
    cursor.offset += padded2 - length2

    return new BytesDynamicString(value)
  }

  sizeOrThrow() {
    const length1 = this.value.length

    const padded1 = Math.ceil(length1 / 32) * 32

    return 32 + padded1
  }

  writeOrThrow(cursor: Cursor) {
    const length1 = this.value.length

    Uint32.new(length1).writeOrThrow(cursor)
    cursor.writeOrThrow(this.value)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.fillOrThrow(0, padded1 - length1)
  }

  static readOrThrow(cursor: Cursor) {
    const length1 = Uint32.readOrThrow(cursor).value
    const content = cursor.readOrThrow(length1)
    const bytes = new Uint8Array(content)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.offset += padded1 - length1

    return new BytesDynamicString(bytes)
  }

}

export namespace StringDynamicString {
  export type From = string
}

export class StringDynamicString {
  readonly #class = BytesDynamicString

  constructor(
    readonly inner: BytesDynamicString
  ) { }

  static create(value: StringDynamicString.From) {
    const bytes = Bytes.fromUtf8(value)
    const inner = BytesDynamicString.create(bytes)

    return new StringDynamicString(inner)
  }

  static from(value: StringDynamicString.From) {
    return StringDynamicString.create(value)
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
    return new StringDynamicString(BytesDynamicString.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    return this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new StringDynamicString(BytesDynamicString.readOrThrow(cursor))
  }

}