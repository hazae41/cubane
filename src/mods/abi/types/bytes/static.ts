import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { RawHexString, ZeroHexString } from "@hazae41/hex";
import { Copiable } from "libs/copiable/index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesAsInteger, RawHexAsInteger } from "mods/types/formats/index.js";

export { AbiBytes1 as Bytes1 };

export type AbiBytes1 =
  | BytesAbiBytes1
  | RawHexAbiBytes1

export namespace AbiBytes1 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes1.Create
    | RawHexAbiBytes1.Create

  export type From =
    | BytesAbiBytes1.From
    | RawHexAbiBytes1.From

  export function create(value: AbiBytes1.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes1.create(value)
    return RawHexAbiBytes1.create(value)
  }

  export function fromOrThrow(value: AbiBytes1.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes1.fromOrThrow(value)
    return RawHexAbiBytes1.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes1`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes1.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes1.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes1 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes1 {
  readonly #class = BytesAbiBytes1

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes1.Create) {
    return new BytesAbiBytes1(value)
  }

  static fromOrThrow(value: BytesAbiBytes1.From) {
    return new BytesAbiBytes1(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes1`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes1.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes1.nibbles

    return new BytesAbiBytes1(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes1.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes1.bytes)

    cursor.offset += 32 - BytesAbiBytes1.bytes

    return new BytesAbiBytes1(content)
  }

}

export namespace RawHexAbiBytes1 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes1 {
  readonly #class = RawHexAbiBytes1

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes1.Create) {
    return new RawHexAbiBytes1(value)
  }

  static fromOrThrow(value: RawHexAbiBytes1.From) {
    return new RawHexAbiBytes1(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes1`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes1.nibbles)

    cursor.offset += 64 - RawHexAbiBytes1.nibbles

    return new RawHexAbiBytes1(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes1.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes1.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes1.bytes

    return new RawHexAbiBytes1(value as RawHexString)
  }

}

export { AbiBytes2 as Bytes2 };

export type AbiBytes2 =
  | BytesAbiBytes2
  | RawHexAbiBytes2

export namespace AbiBytes2 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes2.Create
    | RawHexAbiBytes2.Create

  export type From =
    | BytesAbiBytes2.From
    | RawHexAbiBytes2.From

  export function create(value: AbiBytes2.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes2.create(value)
    return RawHexAbiBytes2.create(value)
  }

  export function fromOrThrow(value: AbiBytes2.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes2.fromOrThrow(value)
    return RawHexAbiBytes2.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes2`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes2.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes2.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes2 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes2 {
  readonly #class = BytesAbiBytes2

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes2.Create) {
    return new BytesAbiBytes2(value)
  }

  static fromOrThrow(value: BytesAbiBytes2.From) {
    return new BytesAbiBytes2(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes2`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes2.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes2.nibbles

    return new BytesAbiBytes2(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes2.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes2.bytes)

    cursor.offset += 32 - BytesAbiBytes2.bytes

    return new BytesAbiBytes2(content)
  }

}

export namespace RawHexAbiBytes2 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes2 {
  readonly #class = RawHexAbiBytes2

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes2.Create) {
    return new RawHexAbiBytes2(value)
  }

  static fromOrThrow(value: RawHexAbiBytes2.From) {
    return new RawHexAbiBytes2(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes2`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes2.nibbles)

    cursor.offset += 64 - RawHexAbiBytes2.nibbles

    return new RawHexAbiBytes2(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes2.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes2.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes2.bytes

    return new RawHexAbiBytes2(value as RawHexString)
  }

}

export { AbiBytes3 as Bytes3 };

export type AbiBytes3 =
  | BytesAbiBytes3
  | RawHexAbiBytes3

export namespace AbiBytes3 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes3.Create
    | RawHexAbiBytes3.Create

  export type From =
    | BytesAbiBytes3.From
    | RawHexAbiBytes3.From

  export function create(value: AbiBytes3.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes3.create(value)
    return RawHexAbiBytes3.create(value)
  }

  export function fromOrThrow(value: AbiBytes3.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes3.fromOrThrow(value)
    return RawHexAbiBytes3.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes3`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes3.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes3.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes3 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes3 {
  readonly #class = BytesAbiBytes3

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes3.Create) {
    return new BytesAbiBytes3(value)
  }

  static fromOrThrow(value: BytesAbiBytes3.From) {
    return new BytesAbiBytes3(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes3`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes3.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes3.nibbles

    return new BytesAbiBytes3(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes3.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes3.bytes)

    cursor.offset += 32 - BytesAbiBytes3.bytes

    return new BytesAbiBytes3(content)
  }

}

export namespace RawHexAbiBytes3 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes3 {
  readonly #class = RawHexAbiBytes3

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes3.Create) {
    return new RawHexAbiBytes3(value)
  }

  static fromOrThrow(value: RawHexAbiBytes3.From) {
    return new RawHexAbiBytes3(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes3`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes3.nibbles)

    cursor.offset += 64 - RawHexAbiBytes3.nibbles

    return new RawHexAbiBytes3(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes3.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes3.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes3.bytes

    return new RawHexAbiBytes3(value as RawHexString)
  }

}

export { AbiBytes4 as Bytes4 };

export type AbiBytes4 =
  | BytesAbiBytes4
  | RawHexAbiBytes4

export namespace AbiBytes4 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes4.Create
    | RawHexAbiBytes4.Create

  export type From =
    | BytesAbiBytes4.From
    | RawHexAbiBytes4.From

  export function create(value: AbiBytes4.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes4.create(value)
    return RawHexAbiBytes4.create(value)
  }

  export function fromOrThrow(value: AbiBytes4.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes4.fromOrThrow(value)
    return RawHexAbiBytes4.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes4`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes4.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes4.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes4 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes4 {
  readonly #class = BytesAbiBytes4

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes4.Create) {
    return new BytesAbiBytes4(value)
  }

  static fromOrThrow(value: BytesAbiBytes4.From) {
    return new BytesAbiBytes4(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes4`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes4.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes4.nibbles

    return new BytesAbiBytes4(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes4.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes4.bytes)

    cursor.offset += 32 - BytesAbiBytes4.bytes

    return new BytesAbiBytes4(content)
  }

}

export namespace RawHexAbiBytes4 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes4 {
  readonly #class = RawHexAbiBytes4

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes4.Create) {
    return new RawHexAbiBytes4(value)
  }

  static fromOrThrow(value: RawHexAbiBytes4.From) {
    return new RawHexAbiBytes4(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes4`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes4.nibbles)

    cursor.offset += 64 - RawHexAbiBytes4.nibbles

    return new RawHexAbiBytes4(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes4.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes4.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes4.bytes

    return new RawHexAbiBytes4(value as RawHexString)
  }

}

export { AbiBytes5 as Bytes5 };

export type AbiBytes5 =
  | BytesAbiBytes5
  | RawHexAbiBytes5

export namespace AbiBytes5 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes5.Create
    | RawHexAbiBytes5.Create

  export type From =
    | BytesAbiBytes5.From
    | RawHexAbiBytes5.From

  export function create(value: AbiBytes5.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes5.create(value)
    return RawHexAbiBytes5.create(value)
  }

  export function fromOrThrow(value: AbiBytes5.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes5.fromOrThrow(value)
    return RawHexAbiBytes5.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes5`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes5.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes5.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes5 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes5 {
  readonly #class = BytesAbiBytes5

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes5.Create) {
    return new BytesAbiBytes5(value)
  }

  static fromOrThrow(value: BytesAbiBytes5.From) {
    return new BytesAbiBytes5(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes5`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes5.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes5.nibbles

    return new BytesAbiBytes5(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes5.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes5.bytes)

    cursor.offset += 32 - BytesAbiBytes5.bytes

    return new BytesAbiBytes5(content)
  }

}

export namespace RawHexAbiBytes5 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes5 {
  readonly #class = RawHexAbiBytes5

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes5.Create) {
    return new RawHexAbiBytes5(value)
  }

  static fromOrThrow(value: RawHexAbiBytes5.From) {
    return new RawHexAbiBytes5(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes5`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes5.nibbles)

    cursor.offset += 64 - RawHexAbiBytes5.nibbles

    return new RawHexAbiBytes5(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes5.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes5.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes5.bytes

    return new RawHexAbiBytes5(value as RawHexString)
  }

}

export { AbiBytes6 as Bytes6 };

export type AbiBytes6 =
  | BytesAbiBytes6
  | RawHexAbiBytes6

export namespace AbiBytes6 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes6.Create
    | RawHexAbiBytes6.Create

  export type From =
    | BytesAbiBytes6.From
    | RawHexAbiBytes6.From

  export function create(value: AbiBytes6.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes6.create(value)
    return RawHexAbiBytes6.create(value)
  }

  export function fromOrThrow(value: AbiBytes6.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes6.fromOrThrow(value)
    return RawHexAbiBytes6.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes6`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes6.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes6.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes6 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes6 {
  readonly #class = BytesAbiBytes6

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes6.Create) {
    return new BytesAbiBytes6(value)
  }

  static fromOrThrow(value: BytesAbiBytes6.From) {
    return new BytesAbiBytes6(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes6`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes6.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes6.nibbles

    return new BytesAbiBytes6(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes6.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes6.bytes)

    cursor.offset += 32 - BytesAbiBytes6.bytes

    return new BytesAbiBytes6(content)
  }

}

export namespace RawHexAbiBytes6 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes6 {
  readonly #class = RawHexAbiBytes6

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes6.Create) {
    return new RawHexAbiBytes6(value)
  }

  static fromOrThrow(value: RawHexAbiBytes6.From) {
    return new RawHexAbiBytes6(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes6`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes6.nibbles)

    cursor.offset += 64 - RawHexAbiBytes6.nibbles

    return new RawHexAbiBytes6(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes6.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes6.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes6.bytes

    return new RawHexAbiBytes6(value as RawHexString)
  }

}

export { AbiBytes7 as Bytes7 };

export type AbiBytes7 =
  | BytesAbiBytes7
  | RawHexAbiBytes7

export namespace AbiBytes7 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes7.Create
    | RawHexAbiBytes7.Create

  export type From =
    | BytesAbiBytes7.From
    | RawHexAbiBytes7.From

  export function create(value: AbiBytes7.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes7.create(value)
    return RawHexAbiBytes7.create(value)
  }

  export function fromOrThrow(value: AbiBytes7.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes7.fromOrThrow(value)
    return RawHexAbiBytes7.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes7`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes7.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes7.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes7 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes7 {
  readonly #class = BytesAbiBytes7

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes7.Create) {
    return new BytesAbiBytes7(value)
  }

  static fromOrThrow(value: BytesAbiBytes7.From) {
    return new BytesAbiBytes7(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes7`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes7.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes7.nibbles

    return new BytesAbiBytes7(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes7.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes7.bytes)

    cursor.offset += 32 - BytesAbiBytes7.bytes

    return new BytesAbiBytes7(content)
  }

}

export namespace RawHexAbiBytes7 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes7 {
  readonly #class = RawHexAbiBytes7

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes7.Create) {
    return new RawHexAbiBytes7(value)
  }

  static fromOrThrow(value: RawHexAbiBytes7.From) {
    return new RawHexAbiBytes7(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes7`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes7.nibbles)

    cursor.offset += 64 - RawHexAbiBytes7.nibbles

    return new RawHexAbiBytes7(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes7.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes7.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes7.bytes

    return new RawHexAbiBytes7(value as RawHexString)
  }

}

export { AbiBytes8 as Bytes8 };

export type AbiBytes8 =
  | BytesAbiBytes8
  | RawHexAbiBytes8

export namespace AbiBytes8 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes8.Create
    | RawHexAbiBytes8.Create

  export type From =
    | BytesAbiBytes8.From
    | RawHexAbiBytes8.From

  export function create(value: AbiBytes8.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes8.create(value)
    return RawHexAbiBytes8.create(value)
  }

  export function fromOrThrow(value: AbiBytes8.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes8.fromOrThrow(value)
    return RawHexAbiBytes8.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes8`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes8.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes8.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes8 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes8 {
  readonly #class = BytesAbiBytes8

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes8.Create) {
    return new BytesAbiBytes8(value)
  }

  static fromOrThrow(value: BytesAbiBytes8.From) {
    return new BytesAbiBytes8(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes8.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes8.nibbles

    return new BytesAbiBytes8(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes8.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes8.bytes)

    cursor.offset += 32 - BytesAbiBytes8.bytes

    return new BytesAbiBytes8(content)
  }

}

export namespace RawHexAbiBytes8 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes8 {
  readonly #class = RawHexAbiBytes8

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes8.Create) {
    return new RawHexAbiBytes8(value)
  }

  static fromOrThrow(value: RawHexAbiBytes8.From) {
    return new RawHexAbiBytes8(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes8.nibbles)

    cursor.offset += 64 - RawHexAbiBytes8.nibbles

    return new RawHexAbiBytes8(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes8.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes8.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes8.bytes

    return new RawHexAbiBytes8(value as RawHexString)
  }

}

export { AbiBytes9 as Bytes9 };

export type AbiBytes9 =
  | BytesAbiBytes9
  | RawHexAbiBytes9

export namespace AbiBytes9 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes9.Create
    | RawHexAbiBytes9.Create

  export type From =
    | BytesAbiBytes9.From
    | RawHexAbiBytes9.From

  export function create(value: AbiBytes9.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes9.create(value)
    return RawHexAbiBytes9.create(value)
  }

  export function fromOrThrow(value: AbiBytes9.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes9.fromOrThrow(value)
    return RawHexAbiBytes9.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes9`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes9.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes9.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes9 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes9 {
  readonly #class = BytesAbiBytes9

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes9.Create) {
    return new BytesAbiBytes9(value)
  }

  static fromOrThrow(value: BytesAbiBytes9.From) {
    return new BytesAbiBytes9(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes9`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes9.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes9.nibbles

    return new BytesAbiBytes9(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes9.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes9.bytes)

    cursor.offset += 32 - BytesAbiBytes9.bytes

    return new BytesAbiBytes9(content)
  }

}

export namespace RawHexAbiBytes9 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes9 {
  readonly #class = RawHexAbiBytes9

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes9.Create) {
    return new RawHexAbiBytes9(value)
  }

  static fromOrThrow(value: RawHexAbiBytes9.From) {
    return new RawHexAbiBytes9(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes9`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes9.nibbles)

    cursor.offset += 64 - RawHexAbiBytes9.nibbles

    return new RawHexAbiBytes9(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes9.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes9.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes9.bytes

    return new RawHexAbiBytes9(value as RawHexString)
  }

}

export { AbiBytes10 as Bytes10 };

export type AbiBytes10 =
  | BytesAbiBytes10
  | RawHexAbiBytes10

export namespace AbiBytes10 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes10.Create
    | RawHexAbiBytes10.Create

  export type From =
    | BytesAbiBytes10.From
    | RawHexAbiBytes10.From

  export function create(value: AbiBytes10.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes10.create(value)
    return RawHexAbiBytes10.create(value)
  }

  export function fromOrThrow(value: AbiBytes10.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes10.fromOrThrow(value)
    return RawHexAbiBytes10.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes10`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes10.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes10.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes10 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes10 {
  readonly #class = BytesAbiBytes10

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes10.Create) {
    return new BytesAbiBytes10(value)
  }

  static fromOrThrow(value: BytesAbiBytes10.From) {
    return new BytesAbiBytes10(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes10`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes10.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes10.nibbles

    return new BytesAbiBytes10(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes10.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes10.bytes)

    cursor.offset += 32 - BytesAbiBytes10.bytes

    return new BytesAbiBytes10(content)
  }

}

export namespace RawHexAbiBytes10 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes10 {
  readonly #class = RawHexAbiBytes10

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes10.Create) {
    return new RawHexAbiBytes10(value)
  }

  static fromOrThrow(value: RawHexAbiBytes10.From) {
    return new RawHexAbiBytes10(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes10`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes10.nibbles)

    cursor.offset += 64 - RawHexAbiBytes10.nibbles

    return new RawHexAbiBytes10(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes10.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes10.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes10.bytes

    return new RawHexAbiBytes10(value as RawHexString)
  }

}

export { AbiBytes11 as Bytes11 };

export type AbiBytes11 =
  | BytesAbiBytes11
  | RawHexAbiBytes11

export namespace AbiBytes11 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes11.Create
    | RawHexAbiBytes11.Create

  export type From =
    | BytesAbiBytes11.From
    | RawHexAbiBytes11.From

  export function create(value: AbiBytes11.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes11.create(value)
    return RawHexAbiBytes11.create(value)
  }

  export function fromOrThrow(value: AbiBytes11.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes11.fromOrThrow(value)
    return RawHexAbiBytes11.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes11`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes11.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes11.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes11 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes11 {
  readonly #class = BytesAbiBytes11

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes11.Create) {
    return new BytesAbiBytes11(value)
  }

  static fromOrThrow(value: BytesAbiBytes11.From) {
    return new BytesAbiBytes11(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes11`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes11.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes11.nibbles

    return new BytesAbiBytes11(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes11.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes11.bytes)

    cursor.offset += 32 - BytesAbiBytes11.bytes

    return new BytesAbiBytes11(content)
  }

}

export namespace RawHexAbiBytes11 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes11 {
  readonly #class = RawHexAbiBytes11

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes11.Create) {
    return new RawHexAbiBytes11(value)
  }

  static fromOrThrow(value: RawHexAbiBytes11.From) {
    return new RawHexAbiBytes11(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes11`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes11.nibbles)

    cursor.offset += 64 - RawHexAbiBytes11.nibbles

    return new RawHexAbiBytes11(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes11.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes11.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes11.bytes

    return new RawHexAbiBytes11(value as RawHexString)
  }

}

export { AbiBytes12 as Bytes12 };

export type AbiBytes12 =
  | BytesAbiBytes12
  | RawHexAbiBytes12

export namespace AbiBytes12 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes12.Create
    | RawHexAbiBytes12.Create

  export type From =
    | BytesAbiBytes12.From
    | RawHexAbiBytes12.From

  export function create(value: AbiBytes12.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes12.create(value)
    return RawHexAbiBytes12.create(value)
  }

  export function fromOrThrow(value: AbiBytes12.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes12.fromOrThrow(value)
    return RawHexAbiBytes12.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes12`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes12.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes12.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes12 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes12 {
  readonly #class = BytesAbiBytes12

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes12.Create) {
    return new BytesAbiBytes12(value)
  }

  static fromOrThrow(value: BytesAbiBytes12.From) {
    return new BytesAbiBytes12(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes12`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes12.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes12.nibbles

    return new BytesAbiBytes12(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes12.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes12.bytes)

    cursor.offset += 32 - BytesAbiBytes12.bytes

    return new BytesAbiBytes12(content)
  }

}

export namespace RawHexAbiBytes12 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes12 {
  readonly #class = RawHexAbiBytes12

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes12.Create) {
    return new RawHexAbiBytes12(value)
  }

  static fromOrThrow(value: RawHexAbiBytes12.From) {
    return new RawHexAbiBytes12(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes12`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes12.nibbles)

    cursor.offset += 64 - RawHexAbiBytes12.nibbles

    return new RawHexAbiBytes12(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes12.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes12.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes12.bytes

    return new RawHexAbiBytes12(value as RawHexString)
  }

}

export { AbiBytes13 as Bytes13 };

export type AbiBytes13 =
  | BytesAbiBytes13
  | RawHexAbiBytes13

export namespace AbiBytes13 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes13.Create
    | RawHexAbiBytes13.Create

  export type From =
    | BytesAbiBytes13.From
    | RawHexAbiBytes13.From

  export function create(value: AbiBytes13.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes13.create(value)
    return RawHexAbiBytes13.create(value)
  }

  export function fromOrThrow(value: AbiBytes13.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes13.fromOrThrow(value)
    return RawHexAbiBytes13.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes13`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes13.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes13.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes13 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes13 {
  readonly #class = BytesAbiBytes13

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes13.Create) {
    return new BytesAbiBytes13(value)
  }

  static fromOrThrow(value: BytesAbiBytes13.From) {
    return new BytesAbiBytes13(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes13`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes13.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes13.nibbles

    return new BytesAbiBytes13(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes13.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes13.bytes)

    cursor.offset += 32 - BytesAbiBytes13.bytes

    return new BytesAbiBytes13(content)
  }

}

export namespace RawHexAbiBytes13 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes13 {
  readonly #class = RawHexAbiBytes13

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes13.Create) {
    return new RawHexAbiBytes13(value)
  }

  static fromOrThrow(value: RawHexAbiBytes13.From) {
    return new RawHexAbiBytes13(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes13`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes13.nibbles)

    cursor.offset += 64 - RawHexAbiBytes13.nibbles

    return new RawHexAbiBytes13(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes13.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes13.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes13.bytes

    return new RawHexAbiBytes13(value as RawHexString)
  }

}

export { AbiBytes14 as Bytes14 };

export type AbiBytes14 =
  | BytesAbiBytes14
  | RawHexAbiBytes14

export namespace AbiBytes14 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes14.Create
    | RawHexAbiBytes14.Create

  export type From =
    | BytesAbiBytes14.From
    | RawHexAbiBytes14.From

  export function create(value: AbiBytes14.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes14.create(value)
    return RawHexAbiBytes14.create(value)
  }

  export function fromOrThrow(value: AbiBytes14.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes14.fromOrThrow(value)
    return RawHexAbiBytes14.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes14`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes14.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes14.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes14 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes14 {
  readonly #class = BytesAbiBytes14

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes14.Create) {
    return new BytesAbiBytes14(value)
  }

  static fromOrThrow(value: BytesAbiBytes14.From) {
    return new BytesAbiBytes14(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes14`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes14.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes14.nibbles

    return new BytesAbiBytes14(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes14.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes14.bytes)

    cursor.offset += 32 - BytesAbiBytes14.bytes

    return new BytesAbiBytes14(content)
  }

}

export namespace RawHexAbiBytes14 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes14 {
  readonly #class = RawHexAbiBytes14

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes14.Create) {
    return new RawHexAbiBytes14(value)
  }

  static fromOrThrow(value: RawHexAbiBytes14.From) {
    return new RawHexAbiBytes14(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes14`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes14.nibbles)

    cursor.offset += 64 - RawHexAbiBytes14.nibbles

    return new RawHexAbiBytes14(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes14.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes14.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes14.bytes

    return new RawHexAbiBytes14(value as RawHexString)
  }

}

export { AbiBytes15 as Bytes15 };

export type AbiBytes15 =
  | BytesAbiBytes15
  | RawHexAbiBytes15

export namespace AbiBytes15 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes15.Create
    | RawHexAbiBytes15.Create

  export type From =
    | BytesAbiBytes15.From
    | RawHexAbiBytes15.From

  export function create(value: AbiBytes15.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes15.create(value)
    return RawHexAbiBytes15.create(value)
  }

  export function fromOrThrow(value: AbiBytes15.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes15.fromOrThrow(value)
    return RawHexAbiBytes15.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes15`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes15.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes15.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes15 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes15 {
  readonly #class = BytesAbiBytes15

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes15.Create) {
    return new BytesAbiBytes15(value)
  }

  static fromOrThrow(value: BytesAbiBytes15.From) {
    return new BytesAbiBytes15(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes15`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes15.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes15.nibbles

    return new BytesAbiBytes15(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes15.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes15.bytes)

    cursor.offset += 32 - BytesAbiBytes15.bytes

    return new BytesAbiBytes15(content)
  }

}

export namespace RawHexAbiBytes15 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes15 {
  readonly #class = RawHexAbiBytes15

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes15.Create) {
    return new RawHexAbiBytes15(value)
  }

  static fromOrThrow(value: RawHexAbiBytes15.From) {
    return new RawHexAbiBytes15(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes15`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes15.nibbles)

    cursor.offset += 64 - RawHexAbiBytes15.nibbles

    return new RawHexAbiBytes15(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes15.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes15.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes15.bytes

    return new RawHexAbiBytes15(value as RawHexString)
  }

}

export { AbiBytes16 as Bytes16 };

export type AbiBytes16 =
  | BytesAbiBytes16
  | RawHexAbiBytes16

export namespace AbiBytes16 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes16.Create
    | RawHexAbiBytes16.Create

  export type From =
    | BytesAbiBytes16.From
    | RawHexAbiBytes16.From

  export function create(value: AbiBytes16.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes16.create(value)
    return RawHexAbiBytes16.create(value)
  }

  export function fromOrThrow(value: AbiBytes16.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes16.fromOrThrow(value)
    return RawHexAbiBytes16.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes16`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes16.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes16.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes16 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes16 {
  readonly #class = BytesAbiBytes16

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes16.Create) {
    return new BytesAbiBytes16(value)
  }

  static fromOrThrow(value: BytesAbiBytes16.From) {
    return new BytesAbiBytes16(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes16.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes16.nibbles

    return new BytesAbiBytes16(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes16.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes16.bytes)

    cursor.offset += 32 - BytesAbiBytes16.bytes

    return new BytesAbiBytes16(content)
  }

}

export namespace RawHexAbiBytes16 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes16 {
  readonly #class = RawHexAbiBytes16

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes16.Create) {
    return new RawHexAbiBytes16(value)
  }

  static fromOrThrow(value: RawHexAbiBytes16.From) {
    return new RawHexAbiBytes16(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes16.nibbles)

    cursor.offset += 64 - RawHexAbiBytes16.nibbles

    return new RawHexAbiBytes16(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes16.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes16.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes16.bytes

    return new RawHexAbiBytes16(value as RawHexString)
  }

}

export { AbiBytes17 as Bytes17 };

export type AbiBytes17 =
  | BytesAbiBytes17
  | RawHexAbiBytes17

export namespace AbiBytes17 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes17.Create
    | RawHexAbiBytes17.Create

  export type From =
    | BytesAbiBytes17.From
    | RawHexAbiBytes17.From

  export function create(value: AbiBytes17.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes17.create(value)
    return RawHexAbiBytes17.create(value)
  }

  export function fromOrThrow(value: AbiBytes17.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes17.fromOrThrow(value)
    return RawHexAbiBytes17.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes17`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes17.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes17.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes17 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes17 {
  readonly #class = BytesAbiBytes17

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes17.Create) {
    return new BytesAbiBytes17(value)
  }

  static fromOrThrow(value: BytesAbiBytes17.From) {
    return new BytesAbiBytes17(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes17`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes17.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes17.nibbles

    return new BytesAbiBytes17(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes17.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes17.bytes)

    cursor.offset += 32 - BytesAbiBytes17.bytes

    return new BytesAbiBytes17(content)
  }

}

export namespace RawHexAbiBytes17 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes17 {
  readonly #class = RawHexAbiBytes17

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes17.Create) {
    return new RawHexAbiBytes17(value)
  }

  static fromOrThrow(value: RawHexAbiBytes17.From) {
    return new RawHexAbiBytes17(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes17`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes17.nibbles)

    cursor.offset += 64 - RawHexAbiBytes17.nibbles

    return new RawHexAbiBytes17(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes17.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes17.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes17.bytes

    return new RawHexAbiBytes17(value as RawHexString)
  }

}

export { AbiBytes18 as Bytes18 };

export type AbiBytes18 =
  | BytesAbiBytes18
  | RawHexAbiBytes18

export namespace AbiBytes18 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes18.Create
    | RawHexAbiBytes18.Create

  export type From =
    | BytesAbiBytes18.From
    | RawHexAbiBytes18.From

  export function create(value: AbiBytes18.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes18.create(value)
    return RawHexAbiBytes18.create(value)
  }

  export function fromOrThrow(value: AbiBytes18.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes18.fromOrThrow(value)
    return RawHexAbiBytes18.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes18`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes18.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes18.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes18 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes18 {
  readonly #class = BytesAbiBytes18

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes18.Create) {
    return new BytesAbiBytes18(value)
  }

  static fromOrThrow(value: BytesAbiBytes18.From) {
    return new BytesAbiBytes18(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes18`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes18.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes18.nibbles

    return new BytesAbiBytes18(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes18.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes18.bytes)

    cursor.offset += 32 - BytesAbiBytes18.bytes

    return new BytesAbiBytes18(content)
  }

}

export namespace RawHexAbiBytes18 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes18 {
  readonly #class = RawHexAbiBytes18

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes18.Create) {
    return new RawHexAbiBytes18(value)
  }

  static fromOrThrow(value: RawHexAbiBytes18.From) {
    return new RawHexAbiBytes18(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes18`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes18.nibbles)

    cursor.offset += 64 - RawHexAbiBytes18.nibbles

    return new RawHexAbiBytes18(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes18.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes18.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes18.bytes

    return new RawHexAbiBytes18(value as RawHexString)
  }

}

export { AbiBytes19 as Bytes19 };

export type AbiBytes19 =
  | BytesAbiBytes19
  | RawHexAbiBytes19

export namespace AbiBytes19 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes19.Create
    | RawHexAbiBytes19.Create

  export type From =
    | BytesAbiBytes19.From
    | RawHexAbiBytes19.From

  export function create(value: AbiBytes19.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes19.create(value)
    return RawHexAbiBytes19.create(value)
  }

  export function fromOrThrow(value: AbiBytes19.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes19.fromOrThrow(value)
    return RawHexAbiBytes19.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes19`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes19.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes19.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes19 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes19 {
  readonly #class = BytesAbiBytes19

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes19.Create) {
    return new BytesAbiBytes19(value)
  }

  static fromOrThrow(value: BytesAbiBytes19.From) {
    return new BytesAbiBytes19(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes19`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes19.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes19.nibbles

    return new BytesAbiBytes19(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes19.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes19.bytes)

    cursor.offset += 32 - BytesAbiBytes19.bytes

    return new BytesAbiBytes19(content)
  }

}

export namespace RawHexAbiBytes19 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes19 {
  readonly #class = RawHexAbiBytes19

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes19.Create) {
    return new RawHexAbiBytes19(value)
  }

  static fromOrThrow(value: RawHexAbiBytes19.From) {
    return new RawHexAbiBytes19(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes19`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes19.nibbles)

    cursor.offset += 64 - RawHexAbiBytes19.nibbles

    return new RawHexAbiBytes19(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes19.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes19.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes19.bytes

    return new RawHexAbiBytes19(value as RawHexString)
  }

}

export { AbiBytes20 as Bytes20 };

export type AbiBytes20 =
  | BytesAbiBytes20
  | RawHexAbiBytes20

export namespace AbiBytes20 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes20.Create
    | RawHexAbiBytes20.Create

  export type From =
    | BytesAbiBytes20.From
    | RawHexAbiBytes20.From

  export function create(value: AbiBytes20.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes20.create(value)
    return RawHexAbiBytes20.create(value)
  }

  export function fromOrThrow(value: AbiBytes20.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes20.fromOrThrow(value)
    return RawHexAbiBytes20.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes20`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes20.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes20.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes20 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes20 {
  readonly #class = BytesAbiBytes20

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes20.Create) {
    return new BytesAbiBytes20(value)
  }

  static fromOrThrow(value: BytesAbiBytes20.From) {
    return new BytesAbiBytes20(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes20`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes20.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes20.nibbles

    return new BytesAbiBytes20(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes20.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes20.bytes)

    cursor.offset += 32 - BytesAbiBytes20.bytes

    return new BytesAbiBytes20(content)
  }

}

export namespace RawHexAbiBytes20 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes20 {
  readonly #class = RawHexAbiBytes20

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes20.Create) {
    return new RawHexAbiBytes20(value)
  }

  static fromOrThrow(value: RawHexAbiBytes20.From) {
    return new RawHexAbiBytes20(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes20`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes20.nibbles)

    cursor.offset += 64 - RawHexAbiBytes20.nibbles

    return new RawHexAbiBytes20(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes20.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes20.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes20.bytes

    return new RawHexAbiBytes20(value as RawHexString)
  }

}

export { AbiBytes21 as Bytes21 };

export type AbiBytes21 =
  | BytesAbiBytes21
  | RawHexAbiBytes21

export namespace AbiBytes21 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes21.Create
    | RawHexAbiBytes21.Create

  export type From =
    | BytesAbiBytes21.From
    | RawHexAbiBytes21.From

  export function create(value: AbiBytes21.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes21.create(value)
    return RawHexAbiBytes21.create(value)
  }

  export function fromOrThrow(value: AbiBytes21.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes21.fromOrThrow(value)
    return RawHexAbiBytes21.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes21`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes21.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes21.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes21 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes21 {
  readonly #class = BytesAbiBytes21

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes21.Create) {
    return new BytesAbiBytes21(value)
  }

  static fromOrThrow(value: BytesAbiBytes21.From) {
    return new BytesAbiBytes21(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes21`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes21.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes21.nibbles

    return new BytesAbiBytes21(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes21.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes21.bytes)

    cursor.offset += 32 - BytesAbiBytes21.bytes

    return new BytesAbiBytes21(content)
  }

}

export namespace RawHexAbiBytes21 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes21 {
  readonly #class = RawHexAbiBytes21

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes21.Create) {
    return new RawHexAbiBytes21(value)
  }

  static fromOrThrow(value: RawHexAbiBytes21.From) {
    return new RawHexAbiBytes21(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes21`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes21.nibbles)

    cursor.offset += 64 - RawHexAbiBytes21.nibbles

    return new RawHexAbiBytes21(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes21.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes21.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes21.bytes

    return new RawHexAbiBytes21(value as RawHexString)
  }

}

export { AbiBytes22 as Bytes22 };

export type AbiBytes22 =
  | BytesAbiBytes22
  | RawHexAbiBytes22

export namespace AbiBytes22 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes22.Create
    | RawHexAbiBytes22.Create

  export type From =
    | BytesAbiBytes22.From
    | RawHexAbiBytes22.From

  export function create(value: AbiBytes22.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes22.create(value)
    return RawHexAbiBytes22.create(value)
  }

  export function fromOrThrow(value: AbiBytes22.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes22.fromOrThrow(value)
    return RawHexAbiBytes22.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes22`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes22.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes22.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes22 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes22 {
  readonly #class = BytesAbiBytes22

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes22.Create) {
    return new BytesAbiBytes22(value)
  }

  static fromOrThrow(value: BytesAbiBytes22.From) {
    return new BytesAbiBytes22(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes22`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes22.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes22.nibbles

    return new BytesAbiBytes22(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes22.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes22.bytes)

    cursor.offset += 32 - BytesAbiBytes22.bytes

    return new BytesAbiBytes22(content)
  }

}

export namespace RawHexAbiBytes22 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes22 {
  readonly #class = RawHexAbiBytes22

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes22.Create) {
    return new RawHexAbiBytes22(value)
  }

  static fromOrThrow(value: RawHexAbiBytes22.From) {
    return new RawHexAbiBytes22(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes22`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes22.nibbles)

    cursor.offset += 64 - RawHexAbiBytes22.nibbles

    return new RawHexAbiBytes22(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes22.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes22.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes22.bytes

    return new RawHexAbiBytes22(value as RawHexString)
  }

}

export { AbiBytes23 as Bytes23 };

export type AbiBytes23 =
  | BytesAbiBytes23
  | RawHexAbiBytes23

export namespace AbiBytes23 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes23.Create
    | RawHexAbiBytes23.Create

  export type From =
    | BytesAbiBytes23.From
    | RawHexAbiBytes23.From

  export function create(value: AbiBytes23.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes23.create(value)
    return RawHexAbiBytes23.create(value)
  }

  export function fromOrThrow(value: AbiBytes23.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes23.fromOrThrow(value)
    return RawHexAbiBytes23.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes23`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes23.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes23.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes23 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes23 {
  readonly #class = BytesAbiBytes23

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes23.Create) {
    return new BytesAbiBytes23(value)
  }

  static fromOrThrow(value: BytesAbiBytes23.From) {
    return new BytesAbiBytes23(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes23`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes23.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes23.nibbles

    return new BytesAbiBytes23(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes23.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes23.bytes)

    cursor.offset += 32 - BytesAbiBytes23.bytes

    return new BytesAbiBytes23(content)
  }

}

export namespace RawHexAbiBytes23 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes23 {
  readonly #class = RawHexAbiBytes23

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes23.Create) {
    return new RawHexAbiBytes23(value)
  }

  static fromOrThrow(value: RawHexAbiBytes23.From) {
    return new RawHexAbiBytes23(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes23`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes23.nibbles)

    cursor.offset += 64 - RawHexAbiBytes23.nibbles

    return new RawHexAbiBytes23(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes23.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes23.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes23.bytes

    return new RawHexAbiBytes23(value as RawHexString)
  }

}

export { AbiBytes24 as Bytes24 };

export type AbiBytes24 =
  | BytesAbiBytes24
  | RawHexAbiBytes24

export namespace AbiBytes24 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes24.Create
    | RawHexAbiBytes24.Create

  export type From =
    | BytesAbiBytes24.From
    | RawHexAbiBytes24.From

  export function create(value: AbiBytes24.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes24.create(value)
    return RawHexAbiBytes24.create(value)
  }

  export function fromOrThrow(value: AbiBytes24.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes24.fromOrThrow(value)
    return RawHexAbiBytes24.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes24`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes24.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes24.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes24 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes24 {
  readonly #class = BytesAbiBytes24

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes24.Create) {
    return new BytesAbiBytes24(value)
  }

  static fromOrThrow(value: BytesAbiBytes24.From) {
    return new BytesAbiBytes24(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes24.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes24.nibbles

    return new BytesAbiBytes24(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes24.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes24.bytes)

    cursor.offset += 32 - BytesAbiBytes24.bytes

    return new BytesAbiBytes24(content)
  }

}

export namespace RawHexAbiBytes24 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes24 {
  readonly #class = RawHexAbiBytes24

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes24.Create) {
    return new RawHexAbiBytes24(value)
  }

  static fromOrThrow(value: RawHexAbiBytes24.From) {
    return new RawHexAbiBytes24(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes24.nibbles)

    cursor.offset += 64 - RawHexAbiBytes24.nibbles

    return new RawHexAbiBytes24(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes24.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes24.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes24.bytes

    return new RawHexAbiBytes24(value as RawHexString)
  }

}

export { AbiBytes25 as Bytes25 };

export type AbiBytes25 =
  | BytesAbiBytes25
  | RawHexAbiBytes25

export namespace AbiBytes25 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes25.Create
    | RawHexAbiBytes25.Create

  export type From =
    | BytesAbiBytes25.From
    | RawHexAbiBytes25.From

  export function create(value: AbiBytes25.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes25.create(value)
    return RawHexAbiBytes25.create(value)
  }

  export function fromOrThrow(value: AbiBytes25.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes25.fromOrThrow(value)
    return RawHexAbiBytes25.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes25`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes25.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes25.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes25 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes25 {
  readonly #class = BytesAbiBytes25

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes25.Create) {
    return new BytesAbiBytes25(value)
  }

  static fromOrThrow(value: BytesAbiBytes25.From) {
    return new BytesAbiBytes25(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes25`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes25.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes25.nibbles

    return new BytesAbiBytes25(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes25.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes25.bytes)

    cursor.offset += 32 - BytesAbiBytes25.bytes

    return new BytesAbiBytes25(content)
  }

}

export namespace RawHexAbiBytes25 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes25 {
  readonly #class = RawHexAbiBytes25

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes25.Create) {
    return new RawHexAbiBytes25(value)
  }

  static fromOrThrow(value: RawHexAbiBytes25.From) {
    return new RawHexAbiBytes25(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes25`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes25.nibbles)

    cursor.offset += 64 - RawHexAbiBytes25.nibbles

    return new RawHexAbiBytes25(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes25.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes25.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes25.bytes

    return new RawHexAbiBytes25(value as RawHexString)
  }

}

export { AbiBytes26 as Bytes26 };

export type AbiBytes26 =
  | BytesAbiBytes26
  | RawHexAbiBytes26

export namespace AbiBytes26 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes26.Create
    | RawHexAbiBytes26.Create

  export type From =
    | BytesAbiBytes26.From
    | RawHexAbiBytes26.From

  export function create(value: AbiBytes26.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes26.create(value)
    return RawHexAbiBytes26.create(value)
  }

  export function fromOrThrow(value: AbiBytes26.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes26.fromOrThrow(value)
    return RawHexAbiBytes26.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes26`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes26.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes26.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes26 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes26 {
  readonly #class = BytesAbiBytes26

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes26.Create) {
    return new BytesAbiBytes26(value)
  }

  static fromOrThrow(value: BytesAbiBytes26.From) {
    return new BytesAbiBytes26(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes26`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes26.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes26.nibbles

    return new BytesAbiBytes26(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes26.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes26.bytes)

    cursor.offset += 32 - BytesAbiBytes26.bytes

    return new BytesAbiBytes26(content)
  }

}

export namespace RawHexAbiBytes26 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes26 {
  readonly #class = RawHexAbiBytes26

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes26.Create) {
    return new RawHexAbiBytes26(value)
  }

  static fromOrThrow(value: RawHexAbiBytes26.From) {
    return new RawHexAbiBytes26(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes26`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes26.nibbles)

    cursor.offset += 64 - RawHexAbiBytes26.nibbles

    return new RawHexAbiBytes26(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes26.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes26.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes26.bytes

    return new RawHexAbiBytes26(value as RawHexString)
  }

}

export { AbiBytes27 as Bytes27 };

export type AbiBytes27 =
  | BytesAbiBytes27
  | RawHexAbiBytes27

export namespace AbiBytes27 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes27.Create
    | RawHexAbiBytes27.Create

  export type From =
    | BytesAbiBytes27.From
    | RawHexAbiBytes27.From

  export function create(value: AbiBytes27.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes27.create(value)
    return RawHexAbiBytes27.create(value)
  }

  export function fromOrThrow(value: AbiBytes27.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes27.fromOrThrow(value)
    return RawHexAbiBytes27.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes27`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes27.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes27.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes27 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes27 {
  readonly #class = BytesAbiBytes27

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes27.Create) {
    return new BytesAbiBytes27(value)
  }

  static fromOrThrow(value: BytesAbiBytes27.From) {
    return new BytesAbiBytes27(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes27`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes27.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes27.nibbles

    return new BytesAbiBytes27(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes27.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes27.bytes)

    cursor.offset += 32 - BytesAbiBytes27.bytes

    return new BytesAbiBytes27(content)
  }

}

export namespace RawHexAbiBytes27 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes27 {
  readonly #class = RawHexAbiBytes27

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes27.Create) {
    return new RawHexAbiBytes27(value)
  }

  static fromOrThrow(value: RawHexAbiBytes27.From) {
    return new RawHexAbiBytes27(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes27`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes27.nibbles)

    cursor.offset += 64 - RawHexAbiBytes27.nibbles

    return new RawHexAbiBytes27(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes27.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes27.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes27.bytes

    return new RawHexAbiBytes27(value as RawHexString)
  }

}

export { AbiBytes28 as Bytes28 };

export type AbiBytes28 =
  | BytesAbiBytes28
  | RawHexAbiBytes28

export namespace AbiBytes28 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes28.Create
    | RawHexAbiBytes28.Create

  export type From =
    | BytesAbiBytes28.From
    | RawHexAbiBytes28.From

  export function create(value: AbiBytes28.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes28.create(value)
    return RawHexAbiBytes28.create(value)
  }

  export function fromOrThrow(value: AbiBytes28.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes28.fromOrThrow(value)
    return RawHexAbiBytes28.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes28`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes28.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes28.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes28 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes28 {
  readonly #class = BytesAbiBytes28

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes28.Create) {
    return new BytesAbiBytes28(value)
  }

  static fromOrThrow(value: BytesAbiBytes28.From) {
    return new BytesAbiBytes28(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes28`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes28.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes28.nibbles

    return new BytesAbiBytes28(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes28.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes28.bytes)

    cursor.offset += 32 - BytesAbiBytes28.bytes

    return new BytesAbiBytes28(content)
  }

}

export namespace RawHexAbiBytes28 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes28 {
  readonly #class = RawHexAbiBytes28

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes28.Create) {
    return new RawHexAbiBytes28(value)
  }

  static fromOrThrow(value: RawHexAbiBytes28.From) {
    return new RawHexAbiBytes28(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes28`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes28.nibbles)

    cursor.offset += 64 - RawHexAbiBytes28.nibbles

    return new RawHexAbiBytes28(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes28.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes28.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes28.bytes

    return new RawHexAbiBytes28(value as RawHexString)
  }

}

export { AbiBytes29 as Bytes29 };

export type AbiBytes29 =
  | BytesAbiBytes29
  | RawHexAbiBytes29

export namespace AbiBytes29 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes29.Create
    | RawHexAbiBytes29.Create

  export type From =
    | BytesAbiBytes29.From
    | RawHexAbiBytes29.From

  export function create(value: AbiBytes29.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes29.create(value)
    return RawHexAbiBytes29.create(value)
  }

  export function fromOrThrow(value: AbiBytes29.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes29.fromOrThrow(value)
    return RawHexAbiBytes29.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes29`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes29.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes29.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes29 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes29 {
  readonly #class = BytesAbiBytes29

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes29.Create) {
    return new BytesAbiBytes29(value)
  }

  static fromOrThrow(value: BytesAbiBytes29.From) {
    return new BytesAbiBytes29(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes29`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes29.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes29.nibbles

    return new BytesAbiBytes29(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes29.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes29.bytes)

    cursor.offset += 32 - BytesAbiBytes29.bytes

    return new BytesAbiBytes29(content)
  }

}

export namespace RawHexAbiBytes29 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes29 {
  readonly #class = RawHexAbiBytes29

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes29.Create) {
    return new RawHexAbiBytes29(value)
  }

  static fromOrThrow(value: RawHexAbiBytes29.From) {
    return new RawHexAbiBytes29(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes29`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes29.nibbles)

    cursor.offset += 64 - RawHexAbiBytes29.nibbles

    return new RawHexAbiBytes29(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes29.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes29.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes29.bytes

    return new RawHexAbiBytes29(value as RawHexString)
  }

}

export { AbiBytes30 as Bytes30 };

export type AbiBytes30 =
  | BytesAbiBytes30
  | RawHexAbiBytes30

export namespace AbiBytes30 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes30.Create
    | RawHexAbiBytes30.Create

  export type From =
    | BytesAbiBytes30.From
    | RawHexAbiBytes30.From

  export function create(value: AbiBytes30.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes30.create(value)
    return RawHexAbiBytes30.create(value)
  }

  export function fromOrThrow(value: AbiBytes30.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes30.fromOrThrow(value)
    return RawHexAbiBytes30.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes30`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes30.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes30.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes30 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes30 {
  readonly #class = BytesAbiBytes30

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes30.Create) {
    return new BytesAbiBytes30(value)
  }

  static fromOrThrow(value: BytesAbiBytes30.From) {
    return new BytesAbiBytes30(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes30`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes30.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes30.nibbles

    return new BytesAbiBytes30(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes30.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes30.bytes)

    cursor.offset += 32 - BytesAbiBytes30.bytes

    return new BytesAbiBytes30(content)
  }

}

export namespace RawHexAbiBytes30 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes30 {
  readonly #class = RawHexAbiBytes30

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes30.Create) {
    return new RawHexAbiBytes30(value)
  }

  static fromOrThrow(value: RawHexAbiBytes30.From) {
    return new RawHexAbiBytes30(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes30`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes30.nibbles)

    cursor.offset += 64 - RawHexAbiBytes30.nibbles

    return new RawHexAbiBytes30(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes30.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes30.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes30.bytes

    return new RawHexAbiBytes30(value as RawHexString)
  }

}

export { AbiBytes31 as Bytes31 };

export type AbiBytes31 =
  | BytesAbiBytes31
  | RawHexAbiBytes31

export namespace AbiBytes31 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes31.Create
    | RawHexAbiBytes31.Create

  export type From =
    | BytesAbiBytes31.From
    | RawHexAbiBytes31.From

  export function create(value: AbiBytes31.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes31.create(value)
    return RawHexAbiBytes31.create(value)
  }

  export function fromOrThrow(value: AbiBytes31.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes31.fromOrThrow(value)
    return RawHexAbiBytes31.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes31`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes31.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes31.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes31 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes31 {
  readonly #class = BytesAbiBytes31

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes31.Create) {
    return new BytesAbiBytes31(value)
  }

  static fromOrThrow(value: BytesAbiBytes31.From) {
    return new BytesAbiBytes31(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes31`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes31.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes31.nibbles

    return new BytesAbiBytes31(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes31.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes31.bytes)

    cursor.offset += 32 - BytesAbiBytes31.bytes

    return new BytesAbiBytes31(content)
  }

}

export namespace RawHexAbiBytes31 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes31 {
  readonly #class = RawHexAbiBytes31

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes31.Create) {
    return new RawHexAbiBytes31(value)
  }

  static fromOrThrow(value: RawHexAbiBytes31.From) {
    return new RawHexAbiBytes31(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes31`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes31.nibbles)

    cursor.offset += 64 - RawHexAbiBytes31.nibbles

    return new RawHexAbiBytes31(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes31.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes31.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes31.bytes

    return new RawHexAbiBytes31(value as RawHexString)
  }

}

export { AbiBytes32 as Bytes32 };

export type AbiBytes32 =
  | BytesAbiBytes32
  | RawHexAbiBytes32

export namespace AbiBytes32 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes32.Create
    | RawHexAbiBytes32.Create

  export type From =
    | BytesAbiBytes32.From
    | RawHexAbiBytes32.From

  export function create(value: AbiBytes32.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes32.create(value)
    return RawHexAbiBytes32.create(value)
  }

  export function fromOrThrow(value: AbiBytes32.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes32.fromOrThrow(value)
    return RawHexAbiBytes32.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Bytes32`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes32.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes32.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes32 {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes32 {
  readonly #class = BytesAbiBytes32

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes32.Create) {
    return new BytesAbiBytes32(value)
  }

  static fromOrThrow(value: BytesAbiBytes32.From) {
    return new BytesAbiBytes32(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes32.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes32.nibbles

    return new BytesAbiBytes32(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes32.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes32.bytes)

    cursor.offset += 32 - BytesAbiBytes32.bytes

    return new BytesAbiBytes32(content)
  }

}

export namespace RawHexAbiBytes32 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes32 {
  readonly #class = RawHexAbiBytes32

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes32.Create) {
    return new RawHexAbiBytes32(value)
  }

  static fromOrThrow(value: RawHexAbiBytes32.From) {
    return new RawHexAbiBytes32(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes32.nibbles)

    cursor.offset += 64 - RawHexAbiBytes32.nibbles

    return new RawHexAbiBytes32(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes32.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes32.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes32.bytes

    return new RawHexAbiBytes32(value as RawHexString)
  }

}

export type BytesByName = {
  bytes1: typeof AbiBytes1,
  bytes2: typeof AbiBytes2,
  bytes3: typeof AbiBytes3,
  bytes4: typeof AbiBytes4,
  bytes5: typeof AbiBytes5,
  bytes6: typeof AbiBytes6,
  bytes7: typeof AbiBytes7,
  bytes8: typeof AbiBytes8,
  bytes9: typeof AbiBytes9,
  bytes10: typeof AbiBytes10,
  bytes11: typeof AbiBytes11,
  bytes12: typeof AbiBytes12,
  bytes13: typeof AbiBytes13,
  bytes14: typeof AbiBytes14,
  bytes15: typeof AbiBytes15,
  bytes16: typeof AbiBytes16,
  bytes17: typeof AbiBytes17,
  bytes18: typeof AbiBytes18,
  bytes19: typeof AbiBytes19,
  bytes20: typeof AbiBytes20,
  bytes21: typeof AbiBytes21,
  bytes22: typeof AbiBytes22,
  bytes23: typeof AbiBytes23,
  bytes24: typeof AbiBytes24,
  bytes25: typeof AbiBytes25,
  bytes26: typeof AbiBytes26,
  bytes27: typeof AbiBytes27,
  bytes28: typeof AbiBytes28,
  bytes29: typeof AbiBytes29,
  bytes30: typeof AbiBytes30,
  bytes31: typeof AbiBytes31,
  bytes32: typeof AbiBytes32,
}

export const bytesByName: BytesByName = {
  bytes1: AbiBytes1,
  bytes2: AbiBytes2,
  bytes3: AbiBytes3,
  bytes4: AbiBytes4,
  bytes5: AbiBytes5,
  bytes6: AbiBytes6,
  bytes7: AbiBytes7,
  bytes8: AbiBytes8,
  bytes9: AbiBytes9,
  bytes10: AbiBytes10,
  bytes11: AbiBytes11,
  bytes12: AbiBytes12,
  bytes13: AbiBytes13,
  bytes14: AbiBytes14,
  bytes15: AbiBytes15,
  bytes16: AbiBytes16,
  bytes17: AbiBytes17,
  bytes18: AbiBytes18,
  bytes19: AbiBytes19,
  bytes20: AbiBytes20,
  bytes21: AbiBytes21,
  bytes22: AbiBytes22,
  bytes23: AbiBytes23,
  bytes24: AbiBytes24,
  bytes25: AbiBytes25,
  bytes26: AbiBytes26,
  bytes27: AbiBytes27,
  bytes28: AbiBytes28,
  bytes29: AbiBytes29,
  bytes30: AbiBytes30,
  bytes31: AbiBytes31,
  bytes32: AbiBytes32,
} as const