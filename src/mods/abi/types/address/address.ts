import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { Address } from "mods/types/address/index.js";
import { RawHexString, ZeroHexString } from "mods/types/string/index.js";

export { AbiAddress as Address };

export type AbiAddress =
  | ZeroHexAbiAddress
  | BytesAbiAddress

export namespace AbiAddress {
  export const dynamic = false
  export const size = 32

  export type Create =
    | ZeroHexAbiAddress.Create
    | BytesAbiAddress.Create

  export type From =
    | ZeroHexAbiAddress.From
    | BytesAbiAddress.From

  export function create(value: AbiAddress.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiAddress.create(value)
    return ZeroHexAbiAddress.create(value)
  }

  export function fromOrThrow(value: AbiAddress.From) {
    return AbiAddress.create(value)
  }

  export function codegen() {
    return `Abi.Address`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiAddress.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiAddress.readOrThrow(cursor)
  }

}

export namespace BytesAbiAddress {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiAddress {
  readonly #class = BytesAbiAddress

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiAddress.Create) {
    return new BytesAbiAddress(value)
  }

  static from(value: BytesAbiAddress.From) {
    return BytesAbiAddress.create(value)
  }

  intoOrThrow(): Address {
    return Address.checksumOrThrow(this.encodePackedOrThrow())
  }

  toJSON(): Address {
    return this.intoOrThrow()
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - 20)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - 20

    const content = cursor.readOrThrow(20)
    const bytes = Bytes.from(content)

    return new BytesAbiAddress(bytes)
  }

}

export namespace ZeroHexAbiAddress {

  export type Create = ZeroHexString

  export type From = ZeroHexString

}

export class ZeroHexAbiAddress {
  readonly #class = ZeroHexAbiAddress

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: ZeroHexAbiAddress.Create) {
    return new ZeroHexAbiAddress(value.slice(2))
  }

  static from(value: ZeroHexAbiAddress.From) {
    return ZeroHexAbiAddress.create(value)
  }

  intoOrThrow(): Address {
    return Address.checksumOrThrow(this.value)
  }

  toJSON(): Address {
    return this.intoOrThrow()
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 24

    const value = cursor.readOrThrow(40)

    return new ZeroHexAbiAddress(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - 20)

    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
  }

}