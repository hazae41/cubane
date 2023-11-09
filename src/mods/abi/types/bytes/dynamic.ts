import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { RawHexString, ZeroHexString } from "index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { StaticUint32 } from "../uint/uint.js";

export type DynamicBytes =
  | BytesDynamicBytes
  | ZeroHexDynamicBytes

export namespace DynamicBytes {
  export const dynamic = true

  export type From =
    | BytesDynamicBytes.From
    | ZeroHexDynamicBytes.From

  export function create(value: DynamicBytes.From) {
    if (value instanceof Uint8Array)
      return BytesDynamicBytes.create(value)
    return ZeroHexDynamicBytes.create(value)
  }

  export function from(value: DynamicBytes.From) {
    return DynamicBytes.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.DynamicBytes`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexDynamicBytes.decodeOrThrow(cursor)
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

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: BytesDynamicBytes.From
  ) { }

  static create(value: BytesDynamicBytes.From) {
    return new BytesDynamicBytes(value)
  }

  static from(value: BytesDynamicBytes.From) {
    return BytesDynamicBytes.create(value)
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

  encodeOrThrow() {
    const length1 = this.value.length
    const length2 = length1 * 2

    const head = StaticUint32.create(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = Base16.get().encodeOrThrow(this.value).padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length1 = this.value.length

    const head = StaticUint32.create(length1).encodePackedOrThrow()
    const body = Base16.get().encodeOrThrow(this.value)

    return head + body
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length1 = StaticUint32.decodeOrThrow(cursor).toNumber()
    const length2 = length1 * 2

    const content = cursor.readOrThrow(length2)

    const value = Base16.get().padEndAndDecodeOrThrow(content).copyAndDispose()

    const padded2 = Math.ceil(length2 / 64) * 64
    cursor.offset += padded2 - length2

    return new BytesDynamicBytes(value)
  }

  sizeOrThrow() {
    const length1 = this.value.length

    const padded1 = Math.ceil(length1 / 32) * 32

    return 32 + padded1
  }

  writeOrThrow(cursor: Cursor) {
    const length1 = this.value.length

    StaticUint32.create(length1).writeOrThrow(cursor)
    cursor.writeOrThrow(this.value)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.fillOrThrow(0, padded1 - length1)
  }

  static readOrThrow(cursor: Cursor) {
    const length1 = StaticUint32.readOrThrow(cursor).toNumber()
    const content = cursor.readOrThrow(length1)
    const bytes = new Uint8Array(content)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.offset += padded1 - length1

    return new BytesDynamicBytes(bytes)
  }

}

export namespace ZeroHexDynamicBytes {
  export type From = ZeroHexString
}

export class ZeroHexDynamicBytes {
  readonly #class = BytesDynamicBytes

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: ZeroHexDynamicBytes.From) {
    return new ZeroHexDynamicBytes(value.slice(2))
  }

  static from(value: ZeroHexDynamicBytes.From) {
    return ZeroHexDynamicBytes.create(value)
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

  encodeOrThrow() {
    const length2 = this.value.length
    const length1 = length2 / 2

    const head = StaticUint32.create(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = this.value.padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length2 = this.value.length
    const length1 = length2 / 2

    const head = StaticUint32.create(length1).encodeOrThrow()
    const body = this.value

    return head + body
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length1 = StaticUint32.decodeOrThrow(cursor).toNumber()
    const length2 = length1 * 2

    const value = cursor.readOrThrow(length2)

    const padded2 = Math.ceil(length2 / 64) * 64
    cursor.offset += padded2 - length2

    return new ZeroHexDynamicBytes(value)
  }

  sizeOrThrow() {
    const length2 = this.value.length
    const length1 = length2 / 2

    const padded1 = Math.ceil(length1 / 32) * 32

    return 32 + padded1
  }

  writeOrThrow(cursor: Cursor) {
    const length2 = this.value.length
    const length1 = length2 / 2

    StaticUint32.create(length1).writeOrThrow(cursor)

    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)
    cursor.writeOrThrow(slice.bytes)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.fillOrThrow(0, padded1 - length1)
  }

  static readOrThrow(cursor: Cursor) {
    const length1 = StaticUint32.readOrThrow(cursor).toNumber()

    const bytes = cursor.readOrThrow(length1)
    const value = Base16.get().encodeOrThrow(bytes)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.offset += padded1 - length1

    return new ZeroHexDynamicBytes(value)
  }

}