import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesDynamicBytes } from "../index.js";

export type DynamicString =
  | BytesDynamicString
  | StringDynamicString

export namespace DynamicString {
  export const dynamic = true

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

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly inner: BytesDynamicBytes
  ) { }

  static create(value: BytesDynamicString.From) {
    return new BytesDynamicString(BytesDynamicBytes.create(value))
  }

  static from(value: BytesDynamicString.From) {
    return BytesDynamicString.create(value)
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
    return new BytesDynamicString(BytesDynamicBytes.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    return this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new BytesDynamicString(BytesDynamicBytes.readOrThrow(cursor))
  }

}

export namespace StringDynamicString {
  export type From = string
}

export class StringDynamicString {
  readonly #class = StringDynamicString

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly inner: BytesDynamicBytes
  ) { }

  static create(value: StringDynamicString.From) {
    const bytes = Bytes.fromUtf8(value)
    const inner = BytesDynamicBytes.create(bytes)

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

  encodeOrThrow() {
    return this.inner.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.inner.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new StringDynamicString(BytesDynamicBytes.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    return this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new StringDynamicString(BytesDynamicBytes.readOrThrow(cursor))
  }

}