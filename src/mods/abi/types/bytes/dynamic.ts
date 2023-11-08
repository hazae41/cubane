import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { RawHexString, ZeroHexString } from "index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { Uint32 } from "../uint/uint.js";

export type DynamicBytes =
  | BytesDynamicBytes
  | RawHexDynamicBytes
  | ZeroHexDynamicBytes

export namespace DynamicBytes {
  export type From =
    | BytesDynamicBytes.From
    | RawHexDynamicBytes.From
    | ZeroHexDynamicBytes.From

  export function create(value: DynamicBytes.From) {
    if (value instanceof Uint8Array)
      return new BytesDynamicBytes(value)
    if (ZeroHexString.is(value))
      return ZeroHexDynamicBytes.create(value)
    return new RawHexDynamicBytes(value)
  }

  export function from(value: DynamicBytes.From) {
    return DynamicBytes.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.DynamicBytes`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexDynamicBytes.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesDynamicBytes.readOrThrow(cursor)
  }

}

export namespace BytesDynamicBytes {
  export type From = Bytes
}

export class BytesDynamicBytes {
  readonly #class = BytesDynamicBytes

  constructor(
    readonly value: BytesDynamicBytes.From
  ) { }

  static new(value: BytesDynamicBytes.From) {
    return new BytesDynamicBytes(value)
  }

  static from(value: BytesDynamicBytes.From) {
    return new BytesDynamicBytes(value)
  }

  intoOrThrow() {
    return this.value
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

    return new BytesDynamicBytes(value)
  }

  sizeOrThrow() {
    const length1 = this.value.length

    return 32 + (Math.ceil(length1 / 32) * 32)
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

    return new BytesDynamicBytes(bytes)
  }

}

export namespace RawHexDynamicBytes {
  export type From = RawHexString
}

export class RawHexDynamicBytes {
  readonly #class = BytesDynamicBytes

  constructor(
    readonly value: RawHexDynamicBytes.From
  ) { }

  static new(value: RawHexDynamicBytes.From) {
    return new RawHexDynamicBytes(value)
  }

  static from(value: RawHexDynamicBytes.From) {
    return new RawHexDynamicBytes(value)
  }

  intoOrThrow() {
    return ZeroHexString.from(this.value)
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
    const length2 = this.value.length
    const length1 = length2 / 2

    const head = Uint32.new(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = this.value.padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length2 = this.value.length
    const length1 = length2 / 2

    const head = Uint32.new(length1).encodeOrThrow()
    const body = this.value

    return head + body
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length1 = Uint32.decodeOrThrow(cursor).value
    const length2 = length1 * 2

    const value = cursor.readOrThrow(length2)

    const padded2 = Math.ceil(length2 / 64) * 64
    cursor.offset += padded2 - length2

    return new RawHexDynamicBytes(value)
  }

  sizeOrThrow() {
    const length2 = this.value.length
    const length1 = length2 / 2

    return 32 + (Math.ceil(length1 / 32) * 32)
  }

  writeOrThrow(cursor: Cursor) {
    const length2 = this.value.length
    const length1 = length2 / 2

    Uint32.new(length1).writeOrThrow(cursor)

    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)
    cursor.writeOrThrow(slice.bytes)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.fillOrThrow(0, padded1 - length1)
  }

  static readOrThrow(cursor: Cursor) {
    const length1 = Uint32.readOrThrow(cursor).value

    const bytes = cursor.readOrThrow(length1)

    const value = Base16.get().encodeOrThrow(bytes)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.offset += padded1 - length1

    return new RawHexDynamicBytes(value)
  }

}

export namespace ZeroHexDynamicBytes {
  export type From = ZeroHexString
}

export class ZeroHexDynamicBytes {
  readonly #class = BytesDynamicBytes

  constructor(
    readonly inner: RawHexDynamicBytes
  ) { }

  static create(value: ZeroHexDynamicBytes.From) {
    const raw = value.slice(2) as RawHexString
    const inner = new RawHexDynamicBytes(raw)

    return new ZeroHexDynamicBytes(inner)
  }

  static from(value: ZeroHexDynamicBytes.From) {
    return ZeroHexDynamicBytes.create(value)
  }

  intoOrThrow() {
    return this.inner.intoOrThrow()
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
    return new ZeroHexDynamicBytes(RawHexDynamicBytes.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new ZeroHexDynamicBytes(RawHexDynamicBytes.readOrThrow(cursor))
  }

}