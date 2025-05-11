import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { RawHexString } from "@hazae41/hexane";
import { TextCursor } from "libs/cursor/cursor.js";
import { AddressString } from "mods/address/index.js";
import { BytesAsInteger, RawHexAsInteger } from "mods/convert/index.js";

export { AbiAddress as Address, BytesAbiAddress as BytesAddress, RawHexAbiAddress as RawHexAddress };

export type AbiAddress =
  | RawHexAbiAddress
  | BytesAbiAddress

export namespace AbiAddress {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiAddress.Create
    | RawHexAbiAddress.Create

  export type From =
    | BytesAbiAddress.From
    | RawHexAbiAddress.From

  export function create(value: AbiAddress.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiAddress.create(value)
    return RawHexAbiAddress.create(value)
  }

  export function fromOrThrow(value: AbiAddress.From) {
    if (value instanceof Uint8Array)
      return BytesAbiAddress.fromOrThrow(value)
    return RawHexAbiAddress.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Address`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiAddress.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiAddress.readOrThrow(cursor)
  }

}

export namespace BytesAbiAddress {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

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

  static fromOrThrow(value: BytesAbiAddress.From) {
    return new BytesAbiAddress(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): AddressString {
    return AddressString.fromOrThrow(this.value)
  }

  /**
   * @deprecated
   */
  toJSON(): AddressString {
    return this.intoOrThrow()
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
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

    const content = cursor.readAndCopyOrThrow(20)

    return new BytesAbiAddress(content)
  }

}

export namespace RawHexAbiAddress {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiAddress {
  readonly #class = RawHexAbiAddress

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiAddress.Create) {
    return new RawHexAbiAddress(value)
  }

  static fromOrThrow(value: RawHexAbiAddress.From) {
    return new RawHexAbiAddress(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): AddressString {
    return AddressString.fromOrThrow(this.value)
  }

  /**
   * @deprecated
   */
  toJSON(): AddressString {
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

    return new RawHexAbiAddress(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - 20)

    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
  }

}