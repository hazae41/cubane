import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { RawHexString } from "@hazae41/hex";
import { Copiable } from "libs/copiable/index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesAsUtf8, RawHexAsUtf8 } from "mods/types/formats/index.js";
import { NumberUint32, Uint32 } from "../uint/uint.js";

export { AbiString as String };

export type AbiString =
  | BytesAbiString
  | RawHexAbiString

export namespace AbiString {
  export const dynamic = true

  export type Create =
    | BytesAbiString.Create
    | RawHexAbiString.Create

  export type From =
    | BytesAbiString.From
    | RawHexAbiString.From

  export function create(value: AbiString.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiString.create(value)
    return RawHexAbiString.create(value)
  }

  export function fromOrThrow(value: AbiString.From) {
    if (value instanceof Uint8Array)
      return BytesAbiString.fromOrThrow(value)
    return RawHexAbiString.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.String`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiString.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiString.readOrThrow(cursor)
  }

}

export namespace BytesAbiString {

  export type Create = Uint8Array

  export type From = BytesAsUtf8.From

}

export class BytesAbiString {
  readonly #class = BytesAbiString

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiString.Create) {
    return new BytesAbiString(value)
  }

  static fromOrThrow(value: BytesAbiString.From) {
    return new BytesAbiString(BytesAsUtf8.fromOrThrow(value))
  }

  intoOrThrow(): string {
    return Bytes.toUtf8(this.value)
  }

  /**
   * @deprecated
   */
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
    const length1 = this.value.length
    const length2 = length1 * 2

    const head = NumberUint32.create(length1).encodeOrThrow()

    const padded2 = Math.ceil(length2 / 64) * 64
    const body = Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(padded2, "0")

    return head + body
  }

  encodePackedOrThrow() {
    const length1 = this.value.length

    const head = NumberUint32.create(length1).encodePackedOrThrow()
    const body = Base16.get().getOrThrow().encodeOrThrow(this.value)

    return head + body
  }

  static decodeOrThrow(cursor: TextCursor) {
    const length1 = Uint32.decodeOrThrow(cursor).value
    const length2 = length1 * 2

    const content = cursor.readOrThrow(length2)

    using copiable = Base16.get().getOrThrow().padEndAndDecodeOrThrow(content)

    const padded2 = Math.ceil(length2 / 64) * 64
    cursor.offset += padded2 - length2

    return new BytesAbiString(copiable.bytes.slice())
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

    return new BytesAbiString(bytes)
  }

}

export namespace RawHexAbiString {

  export type Create = RawHexString

  export type From = RawHexAsUtf8.From

}

export class RawHexAbiString {
  readonly #class = RawHexAbiString

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiString.Create) {
    return new RawHexAbiString(value)
  }

  static fromOrThrow(value: RawHexAbiString.From) {
    return new RawHexAbiString(RawHexAsUtf8.fromOrThrow(value))
  }

  intoOrThrow(): string {
    return Bytes.toUtf8(Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)))
  }

  /**
   * @deprecated
   */
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

    return new RawHexAbiString(value)
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

    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)
    cursor.writeOrThrow(slice.bytes)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.fillOrThrow(0, padded1 - length1)
  }

  static readOrThrow(cursor: Cursor) {
    const length1 = Uint32.readOrThrow(cursor).value

    const bytes = cursor.readOrThrow(length1)
    const value = Base16.get().getOrThrow().encodeOrThrow(bytes)

    const padded1 = Math.ceil(length1 / 32) * 32
    cursor.offset += padded1 - length1

    return new RawHexAbiString(value as RawHexString)
  }

}