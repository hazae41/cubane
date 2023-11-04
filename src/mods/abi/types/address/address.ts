import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { ZeroHexString } from "mods/types/zerohex/index.js";

export type StaticAddress =
  | RawStaticAddress
  | BytesStaticAddress
  | ZeroHexStaticAddress

export namespace StaticAddress {
  export type From =
    | RawStaticAddress.From
    | BytesStaticAddress.From
    | ZeroHexStaticAddress.From

  export function create(value: StaticAddress.From) {
    if (value instanceof Uint8Array)
      return new BytesStaticAddress(value)
    if (ZeroHexString.is(value))
      return new ZeroHexStaticAddress(value)
    return new RawStaticAddress(value)
  }

  export function from(value: StaticAddress.From) {
    return create(value)
  }

  export function codegen() {
    return `Cubane.Abi.StaticAddress`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 24

    const value = cursor.readOrThrow(40)

    return new RawStaticAddress(value as RawStaticAddress.From)
  }

  export function readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - 20

    const bytes = cursor.readOrThrow(20)

    return new BytesStaticAddress(bytes)
  }

  export function tryRead(cursor: Cursor): Result<BytesStaticAddress, Error> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - 20

      const bytes = cursor.tryRead(20).throw(t)

      return new Ok(new BytesStaticAddress(bytes))
    })
  }
}

export namespace RawStaticAddress {
  export type From = string & { readonly length: 40 }
}

export class RawStaticAddress {
  readonly #class = RawStaticAddress

  readonly size = 32 as const

  constructor(
    readonly value: RawStaticAddress.From
  ) { }

  static new(value: RawStaticAddress.From) {
    return new RawStaticAddress(value)
  }

  static from(value: RawStaticAddress.From) {
    return new RawStaticAddress(value)
  }

  into() {
    return ZeroHexString.from(this.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticAddress`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value as string
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 24

    const value = cursor.readOrThrow(40)

    return new RawStaticAddress(value as RawStaticAddress.From)
  }

  sizeOrThrow() {
    return this.size
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - 20)

    const hex = this.encodePackedOrThrow()
    using slice = Base16.get().padStartAndDecodeOrThrow(hex)
    cursor.writeOrThrow(slice.bytes)
  }

  tryWrite(cursor: Cursor): Result<void, Error> {
    return Result.unthrowSync(t => {
      cursor.tryFill(0, 32 - 20).throw(t)

      const hex = this.encodePackedOrThrow()
      using slice = Base16.get().tryPadStartAndDecode(hex).throw(t)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

}

export namespace BytesStaticAddress {
  export type From = Bytes<20>
}

export class BytesStaticAddress {
  readonly #class = BytesStaticAddress

  readonly size = 32 as const

  constructor(
    readonly value: BytesStaticAddress.From
  ) { }

  static new(value: BytesStaticAddress.From) {
    return new BytesStaticAddress(value)
  }

  static from(value: BytesStaticAddress.From) {
    return new BytesStaticAddress(value)
  }

  into() {
    return ZeroHexString.from(this.value)
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

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - 20)
    cursor.writeOrThrow(this.value)
  }

  tryWrite(cursor: Cursor): Result<void, Error> {
    return Result.unthrowSync(t => {
      cursor.tryFill(0, 32 - 20).throw(t)
      cursor.tryWrite(this.value).throw(t)
      return Ok.void()
    })
  }

}

export namespace ZeroHexStaticAddress {
  export type From = ZeroHexString<42>
}

export class ZeroHexStaticAddress {
  readonly #class = ZeroHexStaticAddress

  readonly size = 32 as const

  constructor(
    readonly value: ZeroHexStaticAddress.From
  ) { }

  static new(value: ZeroHexStaticAddress.From) {
    return new ZeroHexStaticAddress(value)
  }

  static from(value: ZeroHexStaticAddress.From) {
    return new ZeroHexStaticAddress(value)
  }

  into() {
    return this.value
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.slice(2).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.slice(2)
  }

  sizeOrThrow() {
    return this.size
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - 20)

    const hex = this.encodePackedOrThrow()
    using slice = Base16.get().padStartAndDecodeOrThrow(hex)
    cursor.writeOrThrow(slice.bytes)
  }

  tryWrite(cursor: Cursor): Result<void, Error> {
    return Result.unthrowSync(t => {
      cursor.tryFill(0, 32 - 20).throw(t)

      const hex = this.encodePackedOrThrow()
      using slice = Base16.get().tryPadStartAndDecode(hex).throw(t)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

}