import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { Address } from "mods/types/address/index.js";
import { BytesInteger } from "mods/types/index.js";
import { RawHexString, ZeroHexString } from "mods/types/string/index.js";

export { AbiAddress as Address, BytesAbiAddress as BytesAddress, RawHexAbiAddress as RawHexAddress };

export type AbiAddress =
  | RawHexAbiAddress
  | BytesAbiAddress

export namespace AbiAddress {
  export const dynamic = false
  export const size = 32

  export type Create =
    | Uint8Array
    | ZeroHexString

  export type From =
    | Uint8Array
    | ZeroHexString

  export function create(value: AbiAddress.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiAddress.create(value)
    return RawHexAbiAddress.fromZeroHexOrThrow(value)
  }

  export function fromOrThrow(value: AbiAddress.From) {
    return AbiAddress.create(value)
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

  export type From =
    | Uint8Array
    | ZeroHexString

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
    return new BytesAbiAddress(BytesInteger.fromOrThrow(value))
  }

  intoOrThrow(): Address {
    return Address.fromRawHexOrThrow(this.encodePackedOrThrow())
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

    const content = cursor.readAndCopyOrThrow(20)

    return new BytesAbiAddress(content)
  }

}

export namespace RawHexAbiAddress {

  export type Create = RawHexString

  export type From =
    | Uint8Array
    | ZeroHexString

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

  static fromBytesOrThrow(value: Uint8Array) {
    return new RawHexAbiAddress(Base16.get().encodeOrThrow(value))
  }

  static fromZeroHexOrThrow(value: ZeroHexString) {
    return new RawHexAbiAddress(value.slice(2))
  }

  static fromOrThrow(value: RawHexAbiAddress.From) {
    if (value instanceof Uint8Array)
      return RawHexAbiAddress.fromBytesOrThrow(value)
    return RawHexAbiAddress.fromZeroHexOrThrow(value)
  }

  intoOrThrow(): Address {
    return Address.fromRawHexOrThrow(this.value)
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

    return new RawHexAbiAddress(value)
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