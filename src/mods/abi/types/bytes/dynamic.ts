import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { RawHexString, ZeroHexString } from "index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesAsInteger, RawHexAsInteger } from "mods/types/helpers/generic.js";
import { NumberUint32, Uint32 } from "../uint/uint.js";

export { AbiBytes as Bytes };

export type AbiBytes =
  | BytesAbiBytes
  | RawHexAbiBytes

export namespace AbiBytes {
  export const dynamic = true

  export type Create =
    | BytesAbiBytes.Create
    | RawHexAbiBytes.Create

  export type From =
    | BytesAsInteger.From
    | RawHexAsInteger.From

  export function create(value: AbiBytes.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes.create(value)
    return RawHexAbiBytes.create(value)
  }

  export function fromOrThrow(value: AbiBytes.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes.fromOrThrow(value)
    return RawHexAbiBytes.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes {
  readonly #class = BytesAbiBytes

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes.Create) {
    return new BytesAbiBytes(value)
  }

  static fromOrThrow(value: BytesAbiBytes.From) {
    return new BytesAbiBytes(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
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

    const head = NumberUint32.create(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = Base16.get().encodeOrThrow(this.value).padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length1 = this.value.length

    const head = NumberUint32.create(length1).encodePackedOrThrow()
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

    return new BytesAbiBytes(value)
  }

  sizeOrThrow() {
    const length1 = this.value.length

    const padded1 = Math.ceil(length1 / 32) * 32

    return 32 + padded1
  }

  writeOrThrow(cursor: Cursor) {
    const length1 = this.value.length

    NumberUint32.create(length1).writeOrThrow(cursor)
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

    return new BytesAbiBytes(bytes)
  }

}

export namespace RawHexAbiBytes {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes {
  readonly #class = RawHexAbiBytes

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes.Create) {
    return new RawHexAbiBytes(value)
  }

  static fromOrThrow(value: RawHexAbiBytes.From) {
    return new RawHexAbiBytes(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
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

    const head = NumberUint32.create(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = this.value.padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length2 = this.value.length
    const length1 = length2 / 2

    const head = NumberUint32.create(length1).encodeOrThrow()
    const body = this.value

    return head + body
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length1 = Uint32.decodeOrThrow(cursor).value
    const length2 = length1 * 2

    const value = cursor.readOrThrow(length2)

    const padded2 = Math.ceil(length2 / 64) * 64
    cursor.offset += padded2 - length2

    return new RawHexAbiBytes(value)
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

    NumberUint32.create(length1).writeOrThrow(cursor)

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

    return new RawHexAbiBytes(value as RawHexString)
  }

}