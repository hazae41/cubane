import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { RawHexString } from "mods/types/rawhex/index.js";
import { ZeroHexString } from "mods/types/zerohex/index.js";

export type StaticAddress =
  | RawHexStaticAddress
  | BytesStaticAddress
  | ZeroHexStaticAddress

export namespace StaticAddress {
  export const dynamic = false
  export const size = 32

  export type From =
    | RawHexStaticAddress.From
    | BytesStaticAddress.From
    | ZeroHexStaticAddress.From

  export function create(value: StaticAddress.From) {
    if (value instanceof Uint8Array)
      return new BytesStaticAddress(value)
    if (ZeroHexString.is(value))
      return ZeroHexStaticAddress.create(value)
    return new RawHexStaticAddress(value)
  }

  export function from(value: StaticAddress.From) {
    return StaticAddress.create(value)
  }

  export function codegen() {
    return `Cubane.Abi.StaticAddress`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexStaticAddress.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticAddress.readOrThrow(cursor)
  }

}

export namespace BytesStaticAddress {
  export type From = Bytes<20>
}

export class BytesStaticAddress {
  readonly #class = BytesStaticAddress

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: BytesStaticAddress.From
  ) { }

  static create(value: BytesStaticAddress.From) {
    return new BytesStaticAddress(value)
  }

  static from(value: BytesStaticAddress.From) {
    return BytesStaticAddress.create(value)
  }

  intoOrThrow() {
    return this.value
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

    return new BytesStaticAddress(bytes)
  }

}

export namespace RawHexStaticAddress {
  export type From = RawHexString<40>
}

export class RawHexStaticAddress {
  readonly #class = RawHexStaticAddress

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexStaticAddress.From
  ) { }

  static create(value: RawHexStaticAddress.From) {
    return new RawHexStaticAddress(value)
  }

  static from(value: RawHexStaticAddress.From) {
    return RawHexStaticAddress.create(value)
  }

  intoOrThrow() {
    return this.value
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

    return new RawHexStaticAddress(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - 20)

    const raw = this.value
    using slice = Base16.get().padStartAndDecodeOrThrow(raw)
    cursor.writeOrThrow(slice.bytes)
  }

}

export namespace ZeroHexStaticAddress {
  export type From = ZeroHexString<42>
}

export class ZeroHexStaticAddress {
  readonly #class = ZeroHexStaticAddress

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly inner: RawHexStaticAddress
  ) { }

  static create(value: ZeroHexStaticAddress.From) {
    const raw = value.slice(2) as RawHexString<40>
    const inner = new RawHexStaticAddress(raw)
    return new ZeroHexStaticAddress(inner)
  }

  static from(value: ZeroHexStaticAddress.From) {
    return ZeroHexStaticAddress.create(value)
  }

  intoOrThrow() {
    return ZeroHexString.from(this.inner.intoOrThrow())
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

  sizeOrThrow() {
    return this.inner.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.inner.writeOrThrow(cursor)
  }

}