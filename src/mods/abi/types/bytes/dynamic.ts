import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { RawHexString, ZeroHexString } from "index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { Uint32 } from "../uint/uint.js";

export { AbiBytes as Bytes };

export type AbiBytes =
  | BytesAbiBytes
  | ZeroHexAbiBytes

export namespace AbiBytes {
  export const dynamic = true

  export type From =
    | BytesAbiBytes.From
    | ZeroHexAbiBytes.From

  export function create(value: AbiBytes.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes.create(value)
    return ZeroHexAbiBytes.create(value)
  }

  export function from(value: AbiBytes.From) {
    return AbiBytes.create(value)
  }

  export function codegen() {
    return `Abi.Bytes`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes {
  export type From = Bytes
}

export class BytesAbiBytes {
  readonly #class = BytesAbiBytes

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: BytesAbiBytes.From
  ) { }

  static create(value: BytesAbiBytes.From) {
    return new BytesAbiBytes(value)
  }

  static from(value: BytesAbiBytes.From) {
    return BytesAbiBytes.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Abi.Bytes`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    const length1 = this.value.length
    const length2 = length1 * 2

    const head = Uint32.fromNumber(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = Base16.get().encodeOrThrow(this.value).padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length1 = this.value.length

    const head = Uint32.fromNumber(length1).encodePackedOrThrow()
    const body = Base16.get().encodeOrThrow(this.value)

    return head + body
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length1 = Uint32.decodeOrThrow(cursor).toNumber()
    const length2 = length1 * 2

    const content = cursor.readOrThrow(length2)

    const value = Base16.get().padEndAndDecodeOrThrow(content).copyAndDispose()

    const padded2 = Math.ceil(length2 / 64) * 64
    cursor.offset += padded2 - length2

    return new BytesAbiBytes(value)
  }

  sizeOrThrow() {
    const length1 = this.value.length

    const padded1 = Math.ceil(length1 / 32) * 32

    return 32 + padded1
  }

  writeOrThrow(cursor: Cursor) {
    const length1 = this.value.length

    Uint32.fromNumber(length1).writeOrThrow(cursor)
    cursor.writeOrThrow(this.value)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.fillOrThrow(0, padded1 - length1)
  }

  static readOrThrow(cursor: Cursor) {
    const length1 = Uint32.readOrThrow(cursor).toNumber()
    const content = cursor.readOrThrow(length1)
    const bytes = new Uint8Array(content)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.offset += padded1 - length1

    return new BytesAbiBytes(bytes)
  }

}

export namespace ZeroHexAbiBytes {
  export type From = ZeroHexString
}

export class ZeroHexAbiBytes {
  readonly #class = BytesAbiBytes

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: ZeroHexAbiBytes.From) {
    return new ZeroHexAbiBytes(value.slice(2))
  }

  static from(value: ZeroHexAbiBytes.From) {
    return ZeroHexAbiBytes.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Abi.Bytes`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    const length2 = this.value.length
    const length1 = length2 / 2

    const head = Uint32.fromNumber(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = this.value.padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length2 = this.value.length
    const length1 = length2 / 2

    const head = Uint32.fromNumber(length1).encodeOrThrow()
    const body = this.value

    return head + body
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length1 = Uint32.decodeOrThrow(cursor).toNumber()
    const length2 = length1 * 2

    const value = cursor.readOrThrow(length2)

    const padded2 = Math.ceil(length2 / 64) * 64
    cursor.offset += padded2 - length2

    return new ZeroHexAbiBytes(value)
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

    Uint32.fromNumber(length1).writeOrThrow(cursor)

    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)
    cursor.writeOrThrow(slice.bytes)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.fillOrThrow(0, padded1 - length1)
  }

  static readOrThrow(cursor: Cursor) {
    const length1 = Uint32.readOrThrow(cursor).toNumber()

    const bytes = cursor.readOrThrow(length1)
    const value = Base16.get().encodeOrThrow(bytes)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.offset += padded1 - length1

    return new ZeroHexAbiBytes(value)
  }

}