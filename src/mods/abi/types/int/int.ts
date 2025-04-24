import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { RawHexString, ZeroHexString } from "@hazae41/hex";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { RawHexAsInteger } from "mods/types/formats/index.js";

const BN_0 = 0n
const BN_1 = 1n

export { BytesAbiInt8 as BytesInt8, AbiInt8 as Int8, RawHexAbiInt8 as RawHexInt8 };

export type AbiInt8 =
  | RawHexAbiInt8
  | BytesAbiInt8

export namespace AbiInt8 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt8.Create
    | RawHexAbiInt8.Create

  export type From =
    | BytesAbiInt8.From
    | RawHexAbiInt8.From

  export function create(value: AbiInt8.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt8.create(value)
    return RawHexAbiInt8.create(value)
  }

  export function fromOrThrow(value: AbiInt8.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt8.fromOrThrow(value)
    return RawHexAbiInt8.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int8`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt8.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt8.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt8 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt8 {
  readonly #class = BytesAbiInt8

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt8.Create) {
    return new BytesAbiInt8(value)
  }

  static fromOrThrow(value: BytesAbiInt8.From) {
    return new BytesAbiInt8(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt8(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt8(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt8.nibbles

    const content = cursor.readOrThrow(BytesAbiInt8.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt8(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt8.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt8.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt8.bytes)

    return new BytesAbiInt8(content)
  }

}

export namespace RawHexAbiInt8 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt8 {
  readonly #class = RawHexAbiInt8

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly bitsn = BigInt(8)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt8.Create) {
    return new RawHexAbiInt8(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt8(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt8(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt8.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt8.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt8(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt8.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt8.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt8(value.slice(2) as RawHexString)
    return RawHexAbiInt8.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int8`
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
    return new RawHexAbiInt8(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt8.bytes

    const content = cursor.readOrThrow(RawHexAbiInt8.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt8(value as RawHexString)
  }

}

export { BytesAbiInt16 as BytesInt16, AbiInt16 as Int16, RawHexAbiInt16 as RawHexInt16 };

export type AbiInt16 =
  | RawHexAbiInt16
  | BytesAbiInt16

export namespace AbiInt16 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt16.Create
    | RawHexAbiInt16.Create

  export type From =
    | BytesAbiInt16.From
    | RawHexAbiInt16.From

  export function create(value: AbiInt16.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt16.create(value)
    return RawHexAbiInt16.create(value)
  }

  export function fromOrThrow(value: AbiInt16.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt16.fromOrThrow(value)
    return RawHexAbiInt16.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int16`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt16.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt16.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt16 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt16 {
  readonly #class = BytesAbiInt16

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt16.Create) {
    return new BytesAbiInt16(value)
  }

  static fromOrThrow(value: BytesAbiInt16.From) {
    return new BytesAbiInt16(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt16(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt16(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt16.nibbles

    const content = cursor.readOrThrow(BytesAbiInt16.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt16(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt16.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt16.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt16.bytes)

    return new BytesAbiInt16(content)
  }

}

export namespace RawHexAbiInt16 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt16 {
  readonly #class = RawHexAbiInt16

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly bitsn = BigInt(16)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt16.Create) {
    return new RawHexAbiInt16(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt16(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt16(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt16.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt16.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt16(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt16.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt16.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt16(value.slice(2) as RawHexString)
    return RawHexAbiInt16.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int16`
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
    return new RawHexAbiInt16(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt16.bytes

    const content = cursor.readOrThrow(RawHexAbiInt16.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt16(value as RawHexString)
  }

}

export { BytesAbiInt24 as BytesInt24, AbiInt24 as Int24, RawHexAbiInt24 as RawHexInt24 };

export type AbiInt24 =
  | RawHexAbiInt24
  | BytesAbiInt24

export namespace AbiInt24 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt24.Create
    | RawHexAbiInt24.Create

  export type From =
    | BytesAbiInt24.From
    | RawHexAbiInt24.From

  export function create(value: AbiInt24.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt24.create(value)
    return RawHexAbiInt24.create(value)
  }

  export function fromOrThrow(value: AbiInt24.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt24.fromOrThrow(value)
    return RawHexAbiInt24.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int24`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt24.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt24.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt24 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt24 {
  readonly #class = BytesAbiInt24

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt24.Create) {
    return new BytesAbiInt24(value)
  }

  static fromOrThrow(value: BytesAbiInt24.From) {
    return new BytesAbiInt24(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt24(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt24(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt24.nibbles

    const content = cursor.readOrThrow(BytesAbiInt24.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt24(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt24.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt24.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt24.bytes)

    return new BytesAbiInt24(content)
  }

}

export namespace RawHexAbiInt24 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt24 {
  readonly #class = RawHexAbiInt24

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly bitsn = BigInt(24)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt24.Create) {
    return new RawHexAbiInt24(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt24(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt24(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt24.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt24.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt24(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt24.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt24.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt24(value.slice(2) as RawHexString)
    return RawHexAbiInt24.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int24`
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
    return new RawHexAbiInt24(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt24.bytes

    const content = cursor.readOrThrow(RawHexAbiInt24.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt24(value as RawHexString)
  }

}

export { BytesAbiInt32 as BytesInt32, AbiInt32 as Int32, RawHexAbiInt32 as RawHexInt32 };

export type AbiInt32 =
  | RawHexAbiInt32
  | BytesAbiInt32

export namespace AbiInt32 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt32.Create
    | RawHexAbiInt32.Create

  export type From =
    | BytesAbiInt32.From
    | RawHexAbiInt32.From

  export function create(value: AbiInt32.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt32.create(value)
    return RawHexAbiInt32.create(value)
  }

  export function fromOrThrow(value: AbiInt32.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt32.fromOrThrow(value)
    return RawHexAbiInt32.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int32`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt32.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt32.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt32 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt32 {
  readonly #class = BytesAbiInt32

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt32.Create) {
    return new BytesAbiInt32(value)
  }

  static fromOrThrow(value: BytesAbiInt32.From) {
    return new BytesAbiInt32(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt32(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt32(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt32.nibbles

    const content = cursor.readOrThrow(BytesAbiInt32.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt32(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt32.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt32.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt32.bytes)

    return new BytesAbiInt32(content)
  }

}

export namespace RawHexAbiInt32 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt32 {
  readonly #class = RawHexAbiInt32

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly bitsn = BigInt(32)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt32.Create) {
    return new RawHexAbiInt32(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt32(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt32(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt32.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt32.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt32(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt32.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt32.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt32(value.slice(2) as RawHexString)
    return RawHexAbiInt32.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int32`
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
    return new RawHexAbiInt32(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt32.bytes

    const content = cursor.readOrThrow(RawHexAbiInt32.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt32(value as RawHexString)
  }

}

export { BytesAbiInt40 as BytesInt40, AbiInt40 as Int40, RawHexAbiInt40 as RawHexInt40 };

export type AbiInt40 =
  | RawHexAbiInt40
  | BytesAbiInt40

export namespace AbiInt40 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt40.Create
    | RawHexAbiInt40.Create

  export type From =
    | BytesAbiInt40.From
    | RawHexAbiInt40.From

  export function create(value: AbiInt40.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt40.create(value)
    return RawHexAbiInt40.create(value)
  }

  export function fromOrThrow(value: AbiInt40.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt40.fromOrThrow(value)
    return RawHexAbiInt40.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int40`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt40.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt40.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt40 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt40 {
  readonly #class = BytesAbiInt40

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt40.Create) {
    return new BytesAbiInt40(value)
  }

  static fromOrThrow(value: BytesAbiInt40.From) {
    return new BytesAbiInt40(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt40(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt40(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int40`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt40.nibbles

    const content = cursor.readOrThrow(BytesAbiInt40.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt40(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt40.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt40.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt40.bytes)

    return new BytesAbiInt40(content)
  }

}

export namespace RawHexAbiInt40 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt40 {
  readonly #class = RawHexAbiInt40

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly bitsn = BigInt(40)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt40.Create) {
    return new RawHexAbiInt40(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt40(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt40(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt40.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt40.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt40(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt40.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt40.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt40(value.slice(2) as RawHexString)
    return RawHexAbiInt40.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int40`
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
    return new RawHexAbiInt40(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt40.bytes

    const content = cursor.readOrThrow(RawHexAbiInt40.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt40(value as RawHexString)
  }

}

export { BytesAbiInt48 as BytesInt48, AbiInt48 as Int48, RawHexAbiInt48 as RawHexInt48 };

export type AbiInt48 =
  | RawHexAbiInt48
  | BytesAbiInt48

export namespace AbiInt48 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt48.Create
    | RawHexAbiInt48.Create

  export type From =
    | BytesAbiInt48.From
    | RawHexAbiInt48.From

  export function create(value: AbiInt48.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt48.create(value)
    return RawHexAbiInt48.create(value)
  }

  export function fromOrThrow(value: AbiInt48.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt48.fromOrThrow(value)
    return RawHexAbiInt48.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int48`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt48.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt48.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt48 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt48 {
  readonly #class = BytesAbiInt48

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt48.Create) {
    return new BytesAbiInt48(value)
  }

  static fromOrThrow(value: BytesAbiInt48.From) {
    return new BytesAbiInt48(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt48(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt48(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int48`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt48.nibbles

    const content = cursor.readOrThrow(BytesAbiInt48.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt48(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt48.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt48.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt48.bytes)

    return new BytesAbiInt48(content)
  }

}

export namespace RawHexAbiInt48 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt48 {
  readonly #class = RawHexAbiInt48

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly bitsn = BigInt(48)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt48.Create) {
    return new RawHexAbiInt48(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt48(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt48(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt48.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt48.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt48(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt48.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt48.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt48(value.slice(2) as RawHexString)
    return RawHexAbiInt48.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int48`
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
    return new RawHexAbiInt48(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt48.bytes

    const content = cursor.readOrThrow(RawHexAbiInt48.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt48(value as RawHexString)
  }

}

export { BytesAbiInt56 as BytesInt56, AbiInt56 as Int56, RawHexAbiInt56 as RawHexInt56 };

export type AbiInt56 =
  | RawHexAbiInt56
  | BytesAbiInt56

export namespace AbiInt56 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt56.Create
    | RawHexAbiInt56.Create

  export type From =
    | BytesAbiInt56.From
    | RawHexAbiInt56.From

  export function create(value: AbiInt56.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt56.create(value)
    return RawHexAbiInt56.create(value)
  }

  export function fromOrThrow(value: AbiInt56.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt56.fromOrThrow(value)
    return RawHexAbiInt56.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int56`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt56.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt56.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt56 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt56 {
  readonly #class = BytesAbiInt56

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt56.Create) {
    return new BytesAbiInt56(value)
  }

  static fromOrThrow(value: BytesAbiInt56.From) {
    return new BytesAbiInt56(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt56(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt56(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int56`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt56.nibbles

    const content = cursor.readOrThrow(BytesAbiInt56.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt56(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt56.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt56.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt56.bytes)

    return new BytesAbiInt56(content)
  }

}

export namespace RawHexAbiInt56 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt56 {
  readonly #class = RawHexAbiInt56

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly bitsn = BigInt(56)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt56.Create) {
    return new RawHexAbiInt56(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt56(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt56(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt56.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt56.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt56(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt56.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt56.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt56(value.slice(2) as RawHexString)
    return RawHexAbiInt56.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int56`
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
    return new RawHexAbiInt56(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt56.bytes

    const content = cursor.readOrThrow(RawHexAbiInt56.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt56(value as RawHexString)
  }

}

export { BytesAbiInt64 as BytesInt64, AbiInt64 as Int64, RawHexAbiInt64 as RawHexInt64 };

export type AbiInt64 =
  | RawHexAbiInt64
  | BytesAbiInt64

export namespace AbiInt64 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt64.Create
    | RawHexAbiInt64.Create

  export type From =
    | BytesAbiInt64.From
    | RawHexAbiInt64.From

  export function create(value: AbiInt64.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt64.create(value)
    return RawHexAbiInt64.create(value)
  }

  export function fromOrThrow(value: AbiInt64.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt64.fromOrThrow(value)
    return RawHexAbiInt64.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int64`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt64.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt64.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt64 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt64 {
  readonly #class = BytesAbiInt64

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt64.Create) {
    return new BytesAbiInt64(value)
  }

  static fromOrThrow(value: BytesAbiInt64.From) {
    return new BytesAbiInt64(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt64(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt64(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int64`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt64.nibbles

    const content = cursor.readOrThrow(BytesAbiInt64.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt64(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt64.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt64.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt64.bytes)

    return new BytesAbiInt64(content)
  }

}

export namespace RawHexAbiInt64 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt64 {
  readonly #class = RawHexAbiInt64

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly bitsn = BigInt(64)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt64.Create) {
    return new RawHexAbiInt64(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt64(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt64(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt64.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt64.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt64(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt64.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt64.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt64(value.slice(2) as RawHexString)
    return RawHexAbiInt64.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int64`
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
    return new RawHexAbiInt64(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt64.bytes

    const content = cursor.readOrThrow(RawHexAbiInt64.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt64(value as RawHexString)
  }

}

export { BytesAbiInt72 as BytesInt72, AbiInt72 as Int72, RawHexAbiInt72 as RawHexInt72 };

export type AbiInt72 =
  | RawHexAbiInt72
  | BytesAbiInt72

export namespace AbiInt72 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt72.Create
    | RawHexAbiInt72.Create

  export type From =
    | BytesAbiInt72.From
    | RawHexAbiInt72.From

  export function create(value: AbiInt72.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt72.create(value)
    return RawHexAbiInt72.create(value)
  }

  export function fromOrThrow(value: AbiInt72.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt72.fromOrThrow(value)
    return RawHexAbiInt72.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int72`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt72.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt72.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt72 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt72 {
  readonly #class = BytesAbiInt72

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt72.Create) {
    return new BytesAbiInt72(value)
  }

  static fromOrThrow(value: BytesAbiInt72.From) {
    return new BytesAbiInt72(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt72(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt72(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int72`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt72.nibbles

    const content = cursor.readOrThrow(BytesAbiInt72.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt72(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt72.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt72.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt72.bytes)

    return new BytesAbiInt72(content)
  }

}

export namespace RawHexAbiInt72 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt72 {
  readonly #class = RawHexAbiInt72

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly bitsn = BigInt(72)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt72.Create) {
    return new RawHexAbiInt72(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt72(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt72(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt72.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt72.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt72(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt72.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt72.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt72(value.slice(2) as RawHexString)
    return RawHexAbiInt72.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int72`
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
    return new RawHexAbiInt72(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt72.bytes

    const content = cursor.readOrThrow(RawHexAbiInt72.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt72(value as RawHexString)
  }

}

export { BytesAbiInt80 as BytesInt80, AbiInt80 as Int80, RawHexAbiInt80 as RawHexInt80 };

export type AbiInt80 =
  | RawHexAbiInt80
  | BytesAbiInt80

export namespace AbiInt80 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt80.Create
    | RawHexAbiInt80.Create

  export type From =
    | BytesAbiInt80.From
    | RawHexAbiInt80.From

  export function create(value: AbiInt80.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt80.create(value)
    return RawHexAbiInt80.create(value)
  }

  export function fromOrThrow(value: AbiInt80.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt80.fromOrThrow(value)
    return RawHexAbiInt80.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int80`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt80.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt80.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt80 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt80 {
  readonly #class = BytesAbiInt80

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt80.Create) {
    return new BytesAbiInt80(value)
  }

  static fromOrThrow(value: BytesAbiInt80.From) {
    return new BytesAbiInt80(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt80(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt80(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int80`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt80.nibbles

    const content = cursor.readOrThrow(BytesAbiInt80.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt80(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt80.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt80.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt80.bytes)

    return new BytesAbiInt80(content)
  }

}

export namespace RawHexAbiInt80 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt80 {
  readonly #class = RawHexAbiInt80

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly bitsn = BigInt(80)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt80.Create) {
    return new RawHexAbiInt80(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt80(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt80(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt80.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt80.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt80(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt80.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt80.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt80(value.slice(2) as RawHexString)
    return RawHexAbiInt80.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int80`
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
    return new RawHexAbiInt80(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt80.bytes

    const content = cursor.readOrThrow(RawHexAbiInt80.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt80(value as RawHexString)
  }

}

export { BytesAbiInt88 as BytesInt88, AbiInt88 as Int88, RawHexAbiInt88 as RawHexInt88 };

export type AbiInt88 =
  | RawHexAbiInt88
  | BytesAbiInt88

export namespace AbiInt88 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt88.Create
    | RawHexAbiInt88.Create

  export type From =
    | BytesAbiInt88.From
    | RawHexAbiInt88.From

  export function create(value: AbiInt88.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt88.create(value)
    return RawHexAbiInt88.create(value)
  }

  export function fromOrThrow(value: AbiInt88.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt88.fromOrThrow(value)
    return RawHexAbiInt88.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int88`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt88.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt88.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt88 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt88 {
  readonly #class = BytesAbiInt88

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt88.Create) {
    return new BytesAbiInt88(value)
  }

  static fromOrThrow(value: BytesAbiInt88.From) {
    return new BytesAbiInt88(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt88(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt88(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int88`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt88.nibbles

    const content = cursor.readOrThrow(BytesAbiInt88.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt88(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt88.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt88.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt88.bytes)

    return new BytesAbiInt88(content)
  }

}

export namespace RawHexAbiInt88 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt88 {
  readonly #class = RawHexAbiInt88

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly bitsn = BigInt(88)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt88.Create) {
    return new RawHexAbiInt88(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt88(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt88(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt88.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt88.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt88(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt88.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt88.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt88(value.slice(2) as RawHexString)
    return RawHexAbiInt88.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int88`
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
    return new RawHexAbiInt88(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt88.bytes

    const content = cursor.readOrThrow(RawHexAbiInt88.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt88(value as RawHexString)
  }

}

export { BytesAbiInt96 as BytesInt96, AbiInt96 as Int96, RawHexAbiInt96 as RawHexInt96 };

export type AbiInt96 =
  | RawHexAbiInt96
  | BytesAbiInt96

export namespace AbiInt96 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt96.Create
    | RawHexAbiInt96.Create

  export type From =
    | BytesAbiInt96.From
    | RawHexAbiInt96.From

  export function create(value: AbiInt96.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt96.create(value)
    return RawHexAbiInt96.create(value)
  }

  export function fromOrThrow(value: AbiInt96.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt96.fromOrThrow(value)
    return RawHexAbiInt96.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int96`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt96.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt96.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt96 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt96 {
  readonly #class = BytesAbiInt96

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt96.Create) {
    return new BytesAbiInt96(value)
  }

  static fromOrThrow(value: BytesAbiInt96.From) {
    return new BytesAbiInt96(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt96(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt96(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int96`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt96.nibbles

    const content = cursor.readOrThrow(BytesAbiInt96.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt96(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt96.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt96.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt96.bytes)

    return new BytesAbiInt96(content)
  }

}

export namespace RawHexAbiInt96 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt96 {
  readonly #class = RawHexAbiInt96

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly bitsn = BigInt(96)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt96.Create) {
    return new RawHexAbiInt96(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt96(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt96(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt96.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt96.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt96(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt96.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt96.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt96(value.slice(2) as RawHexString)
    return RawHexAbiInt96.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int96`
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
    return new RawHexAbiInt96(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt96.bytes

    const content = cursor.readOrThrow(RawHexAbiInt96.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt96(value as RawHexString)
  }

}

export { BytesAbiInt104 as BytesInt104, AbiInt104 as Int104, RawHexAbiInt104 as RawHexInt104 };

export type AbiInt104 =
  | RawHexAbiInt104
  | BytesAbiInt104

export namespace AbiInt104 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt104.Create
    | RawHexAbiInt104.Create

  export type From =
    | BytesAbiInt104.From
    | RawHexAbiInt104.From

  export function create(value: AbiInt104.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt104.create(value)
    return RawHexAbiInt104.create(value)
  }

  export function fromOrThrow(value: AbiInt104.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt104.fromOrThrow(value)
    return RawHexAbiInt104.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int104`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt104.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt104.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt104 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt104 {
  readonly #class = BytesAbiInt104

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt104.Create) {
    return new BytesAbiInt104(value)
  }

  static fromOrThrow(value: BytesAbiInt104.From) {
    return new BytesAbiInt104(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt104(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt104(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int104`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt104.nibbles

    const content = cursor.readOrThrow(BytesAbiInt104.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt104(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt104.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt104.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt104.bytes)

    return new BytesAbiInt104(content)
  }

}

export namespace RawHexAbiInt104 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt104 {
  readonly #class = RawHexAbiInt104

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly bitsn = BigInt(104)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt104.Create) {
    return new RawHexAbiInt104(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt104(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt104(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt104.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt104.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt104(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt104.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt104.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt104(value.slice(2) as RawHexString)
    return RawHexAbiInt104.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int104`
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
    return new RawHexAbiInt104(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt104.bytes

    const content = cursor.readOrThrow(RawHexAbiInt104.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt104(value as RawHexString)
  }

}

export { BytesAbiInt112 as BytesInt112, AbiInt112 as Int112, RawHexAbiInt112 as RawHexInt112 };

export type AbiInt112 =
  | RawHexAbiInt112
  | BytesAbiInt112

export namespace AbiInt112 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt112.Create
    | RawHexAbiInt112.Create

  export type From =
    | BytesAbiInt112.From
    | RawHexAbiInt112.From

  export function create(value: AbiInt112.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt112.create(value)
    return RawHexAbiInt112.create(value)
  }

  export function fromOrThrow(value: AbiInt112.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt112.fromOrThrow(value)
    return RawHexAbiInt112.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int112`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt112.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt112.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt112 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt112 {
  readonly #class = BytesAbiInt112

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt112.Create) {
    return new BytesAbiInt112(value)
  }

  static fromOrThrow(value: BytesAbiInt112.From) {
    return new BytesAbiInt112(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt112(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt112(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int112`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt112.nibbles

    const content = cursor.readOrThrow(BytesAbiInt112.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt112(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt112.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt112.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt112.bytes)

    return new BytesAbiInt112(content)
  }

}

export namespace RawHexAbiInt112 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt112 {
  readonly #class = RawHexAbiInt112

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly bitsn = BigInt(112)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt112.Create) {
    return new RawHexAbiInt112(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt112(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt112(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt112.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt112.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt112(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt112.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt112.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt112(value.slice(2) as RawHexString)
    return RawHexAbiInt112.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int112`
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
    return new RawHexAbiInt112(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt112.bytes

    const content = cursor.readOrThrow(RawHexAbiInt112.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt112(value as RawHexString)
  }

}

export { BytesAbiInt120 as BytesInt120, AbiInt120 as Int120, RawHexAbiInt120 as RawHexInt120 };

export type AbiInt120 =
  | RawHexAbiInt120
  | BytesAbiInt120

export namespace AbiInt120 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt120.Create
    | RawHexAbiInt120.Create

  export type From =
    | BytesAbiInt120.From
    | RawHexAbiInt120.From

  export function create(value: AbiInt120.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt120.create(value)
    return RawHexAbiInt120.create(value)
  }

  export function fromOrThrow(value: AbiInt120.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt120.fromOrThrow(value)
    return RawHexAbiInt120.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int120`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt120.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt120.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt120 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt120 {
  readonly #class = BytesAbiInt120

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt120.Create) {
    return new BytesAbiInt120(value)
  }

  static fromOrThrow(value: BytesAbiInt120.From) {
    return new BytesAbiInt120(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt120(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt120(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int120`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt120.nibbles

    const content = cursor.readOrThrow(BytesAbiInt120.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt120(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt120.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt120.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt120.bytes)

    return new BytesAbiInt120(content)
  }

}

export namespace RawHexAbiInt120 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt120 {
  readonly #class = RawHexAbiInt120

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly bitsn = BigInt(120)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt120.Create) {
    return new RawHexAbiInt120(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt120(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt120(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt120.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt120.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt120(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt120.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt120.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt120(value.slice(2) as RawHexString)
    return RawHexAbiInt120.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int120`
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
    return new RawHexAbiInt120(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt120.bytes

    const content = cursor.readOrThrow(RawHexAbiInt120.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt120(value as RawHexString)
  }

}

export { BytesAbiInt128 as BytesInt128, AbiInt128 as Int128, RawHexAbiInt128 as RawHexInt128 };

export type AbiInt128 =
  | RawHexAbiInt128
  | BytesAbiInt128

export namespace AbiInt128 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt128.Create
    | RawHexAbiInt128.Create

  export type From =
    | BytesAbiInt128.From
    | RawHexAbiInt128.From

  export function create(value: AbiInt128.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt128.create(value)
    return RawHexAbiInt128.create(value)
  }

  export function fromOrThrow(value: AbiInt128.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt128.fromOrThrow(value)
    return RawHexAbiInt128.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int128`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt128.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt128.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt128 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt128 {
  readonly #class = BytesAbiInt128

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt128.Create) {
    return new BytesAbiInt128(value)
  }

  static fromOrThrow(value: BytesAbiInt128.From) {
    return new BytesAbiInt128(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt128(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt128(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int128`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt128.nibbles

    const content = cursor.readOrThrow(BytesAbiInt128.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt128(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt128.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt128.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt128.bytes)

    return new BytesAbiInt128(content)
  }

}

export namespace RawHexAbiInt128 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt128 {
  readonly #class = RawHexAbiInt128

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly bitsn = BigInt(128)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt128.Create) {
    return new RawHexAbiInt128(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt128(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt128(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt128.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt128.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt128(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt128.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt128.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt128(value.slice(2) as RawHexString)
    return RawHexAbiInt128.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int128`
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
    return new RawHexAbiInt128(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt128.bytes

    const content = cursor.readOrThrow(RawHexAbiInt128.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt128(value as RawHexString)
  }

}

export { BytesAbiInt136 as BytesInt136, AbiInt136 as Int136, RawHexAbiInt136 as RawHexInt136 };

export type AbiInt136 =
  | RawHexAbiInt136
  | BytesAbiInt136

export namespace AbiInt136 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt136.Create
    | RawHexAbiInt136.Create

  export type From =
    | BytesAbiInt136.From
    | RawHexAbiInt136.From

  export function create(value: AbiInt136.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt136.create(value)
    return RawHexAbiInt136.create(value)
  }

  export function fromOrThrow(value: AbiInt136.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt136.fromOrThrow(value)
    return RawHexAbiInt136.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int136`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt136.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt136.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt136 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt136 {
  readonly #class = BytesAbiInt136

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt136.Create) {
    return new BytesAbiInt136(value)
  }

  static fromOrThrow(value: BytesAbiInt136.From) {
    return new BytesAbiInt136(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt136(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt136(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int136`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt136.nibbles

    const content = cursor.readOrThrow(BytesAbiInt136.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt136(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt136.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt136.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt136.bytes)

    return new BytesAbiInt136(content)
  }

}

export namespace RawHexAbiInt136 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt136 {
  readonly #class = RawHexAbiInt136

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly bitsn = BigInt(136)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt136.Create) {
    return new RawHexAbiInt136(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt136(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt136(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt136.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt136.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt136(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt136.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt136.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt136(value.slice(2) as RawHexString)
    return RawHexAbiInt136.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int136`
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
    return new RawHexAbiInt136(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt136.bytes

    const content = cursor.readOrThrow(RawHexAbiInt136.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt136(value as RawHexString)
  }

}

export { BytesAbiInt144 as BytesInt144, AbiInt144 as Int144, RawHexAbiInt144 as RawHexInt144 };

export type AbiInt144 =
  | RawHexAbiInt144
  | BytesAbiInt144

export namespace AbiInt144 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt144.Create
    | RawHexAbiInt144.Create

  export type From =
    | BytesAbiInt144.From
    | RawHexAbiInt144.From

  export function create(value: AbiInt144.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt144.create(value)
    return RawHexAbiInt144.create(value)
  }

  export function fromOrThrow(value: AbiInt144.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt144.fromOrThrow(value)
    return RawHexAbiInt144.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int144`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt144.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt144.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt144 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt144 {
  readonly #class = BytesAbiInt144

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt144.Create) {
    return new BytesAbiInt144(value)
  }

  static fromOrThrow(value: BytesAbiInt144.From) {
    return new BytesAbiInt144(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt144(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt144(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int144`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt144.nibbles

    const content = cursor.readOrThrow(BytesAbiInt144.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt144(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt144.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt144.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt144.bytes)

    return new BytesAbiInt144(content)
  }

}

export namespace RawHexAbiInt144 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt144 {
  readonly #class = RawHexAbiInt144

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly bitsn = BigInt(144)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt144.Create) {
    return new RawHexAbiInt144(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt144(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt144(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt144.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt144.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt144(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt144.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt144.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt144(value.slice(2) as RawHexString)
    return RawHexAbiInt144.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int144`
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
    return new RawHexAbiInt144(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt144.bytes

    const content = cursor.readOrThrow(RawHexAbiInt144.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt144(value as RawHexString)
  }

}

export { BytesAbiInt152 as BytesInt152, AbiInt152 as Int152, RawHexAbiInt152 as RawHexInt152 };

export type AbiInt152 =
  | RawHexAbiInt152
  | BytesAbiInt152

export namespace AbiInt152 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt152.Create
    | RawHexAbiInt152.Create

  export type From =
    | BytesAbiInt152.From
    | RawHexAbiInt152.From

  export function create(value: AbiInt152.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt152.create(value)
    return RawHexAbiInt152.create(value)
  }

  export function fromOrThrow(value: AbiInt152.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt152.fromOrThrow(value)
    return RawHexAbiInt152.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int152`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt152.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt152.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt152 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt152 {
  readonly #class = BytesAbiInt152

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt152.Create) {
    return new BytesAbiInt152(value)
  }

  static fromOrThrow(value: BytesAbiInt152.From) {
    return new BytesAbiInt152(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt152(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt152(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int152`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt152.nibbles

    const content = cursor.readOrThrow(BytesAbiInt152.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt152(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt152.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt152.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt152.bytes)

    return new BytesAbiInt152(content)
  }

}

export namespace RawHexAbiInt152 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt152 {
  readonly #class = RawHexAbiInt152

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly bitsn = BigInt(152)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt152.Create) {
    return new RawHexAbiInt152(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt152(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt152(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt152.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt152.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt152(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt152.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt152.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt152(value.slice(2) as RawHexString)
    return RawHexAbiInt152.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int152`
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
    return new RawHexAbiInt152(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt152.bytes

    const content = cursor.readOrThrow(RawHexAbiInt152.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt152(value as RawHexString)
  }

}

export { BytesAbiInt160 as BytesInt160, AbiInt160 as Int160, RawHexAbiInt160 as RawHexInt160 };

export type AbiInt160 =
  | RawHexAbiInt160
  | BytesAbiInt160

export namespace AbiInt160 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt160.Create
    | RawHexAbiInt160.Create

  export type From =
    | BytesAbiInt160.From
    | RawHexAbiInt160.From

  export function create(value: AbiInt160.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt160.create(value)
    return RawHexAbiInt160.create(value)
  }

  export function fromOrThrow(value: AbiInt160.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt160.fromOrThrow(value)
    return RawHexAbiInt160.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int160`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt160.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt160.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt160 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt160 {
  readonly #class = BytesAbiInt160

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt160.Create) {
    return new BytesAbiInt160(value)
  }

  static fromOrThrow(value: BytesAbiInt160.From) {
    return new BytesAbiInt160(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt160(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt160(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int160`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt160.nibbles

    const content = cursor.readOrThrow(BytesAbiInt160.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt160(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt160.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt160.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt160.bytes)

    return new BytesAbiInt160(content)
  }

}

export namespace RawHexAbiInt160 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt160 {
  readonly #class = RawHexAbiInt160

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly bitsn = BigInt(160)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt160.Create) {
    return new RawHexAbiInt160(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt160(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt160(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt160.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt160.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt160(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt160.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt160.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt160(value.slice(2) as RawHexString)
    return RawHexAbiInt160.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int160`
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
    return new RawHexAbiInt160(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt160.bytes

    const content = cursor.readOrThrow(RawHexAbiInt160.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt160(value as RawHexString)
  }

}

export { BytesAbiInt168 as BytesInt168, AbiInt168 as Int168, RawHexAbiInt168 as RawHexInt168 };

export type AbiInt168 =
  | RawHexAbiInt168
  | BytesAbiInt168

export namespace AbiInt168 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt168.Create
    | RawHexAbiInt168.Create

  export type From =
    | BytesAbiInt168.From
    | RawHexAbiInt168.From

  export function create(value: AbiInt168.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt168.create(value)
    return RawHexAbiInt168.create(value)
  }

  export function fromOrThrow(value: AbiInt168.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt168.fromOrThrow(value)
    return RawHexAbiInt168.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int168`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt168.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt168.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt168 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt168 {
  readonly #class = BytesAbiInt168

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt168.Create) {
    return new BytesAbiInt168(value)
  }

  static fromOrThrow(value: BytesAbiInt168.From) {
    return new BytesAbiInt168(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt168(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt168(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int168`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt168.nibbles

    const content = cursor.readOrThrow(BytesAbiInt168.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt168(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt168.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt168.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt168.bytes)

    return new BytesAbiInt168(content)
  }

}

export namespace RawHexAbiInt168 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt168 {
  readonly #class = RawHexAbiInt168

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly bitsn = BigInt(168)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt168.Create) {
    return new RawHexAbiInt168(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt168(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt168(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt168.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt168.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt168(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt168.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt168.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt168(value.slice(2) as RawHexString)
    return RawHexAbiInt168.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int168`
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
    return new RawHexAbiInt168(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt168.bytes

    const content = cursor.readOrThrow(RawHexAbiInt168.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt168(value as RawHexString)
  }

}

export { BytesAbiInt176 as BytesInt176, AbiInt176 as Int176, RawHexAbiInt176 as RawHexInt176 };

export type AbiInt176 =
  | RawHexAbiInt176
  | BytesAbiInt176

export namespace AbiInt176 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt176.Create
    | RawHexAbiInt176.Create

  export type From =
    | BytesAbiInt176.From
    | RawHexAbiInt176.From

  export function create(value: AbiInt176.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt176.create(value)
    return RawHexAbiInt176.create(value)
  }

  export function fromOrThrow(value: AbiInt176.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt176.fromOrThrow(value)
    return RawHexAbiInt176.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int176`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt176.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt176.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt176 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt176 {
  readonly #class = BytesAbiInt176

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt176.Create) {
    return new BytesAbiInt176(value)
  }

  static fromOrThrow(value: BytesAbiInt176.From) {
    return new BytesAbiInt176(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt176(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt176(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int176`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt176.nibbles

    const content = cursor.readOrThrow(BytesAbiInt176.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt176(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt176.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt176.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt176.bytes)

    return new BytesAbiInt176(content)
  }

}

export namespace RawHexAbiInt176 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt176 {
  readonly #class = RawHexAbiInt176

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly bitsn = BigInt(176)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt176.Create) {
    return new RawHexAbiInt176(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt176(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt176(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt176.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt176.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt176(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt176.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt176.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt176(value.slice(2) as RawHexString)
    return RawHexAbiInt176.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int176`
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
    return new RawHexAbiInt176(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt176.bytes

    const content = cursor.readOrThrow(RawHexAbiInt176.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt176(value as RawHexString)
  }

}

export { BytesAbiInt184 as BytesInt184, AbiInt184 as Int184, RawHexAbiInt184 as RawHexInt184 };

export type AbiInt184 =
  | RawHexAbiInt184
  | BytesAbiInt184

export namespace AbiInt184 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt184.Create
    | RawHexAbiInt184.Create

  export type From =
    | BytesAbiInt184.From
    | RawHexAbiInt184.From

  export function create(value: AbiInt184.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt184.create(value)
    return RawHexAbiInt184.create(value)
  }

  export function fromOrThrow(value: AbiInt184.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt184.fromOrThrow(value)
    return RawHexAbiInt184.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int184`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt184.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt184.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt184 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt184 {
  readonly #class = BytesAbiInt184

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt184.Create) {
    return new BytesAbiInt184(value)
  }

  static fromOrThrow(value: BytesAbiInt184.From) {
    return new BytesAbiInt184(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt184(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt184(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int184`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt184.nibbles

    const content = cursor.readOrThrow(BytesAbiInt184.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt184(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt184.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt184.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt184.bytes)

    return new BytesAbiInt184(content)
  }

}

export namespace RawHexAbiInt184 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt184 {
  readonly #class = RawHexAbiInt184

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly bitsn = BigInt(184)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt184.Create) {
    return new RawHexAbiInt184(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt184(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt184(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt184.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt184.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt184(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt184.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt184.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt184(value.slice(2) as RawHexString)
    return RawHexAbiInt184.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int184`
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
    return new RawHexAbiInt184(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt184.bytes

    const content = cursor.readOrThrow(RawHexAbiInt184.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt184(value as RawHexString)
  }

}

export { BytesAbiInt192 as BytesInt192, AbiInt192 as Int192, RawHexAbiInt192 as RawHexInt192 };

export type AbiInt192 =
  | RawHexAbiInt192
  | BytesAbiInt192

export namespace AbiInt192 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt192.Create
    | RawHexAbiInt192.Create

  export type From =
    | BytesAbiInt192.From
    | RawHexAbiInt192.From

  export function create(value: AbiInt192.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt192.create(value)
    return RawHexAbiInt192.create(value)
  }

  export function fromOrThrow(value: AbiInt192.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt192.fromOrThrow(value)
    return RawHexAbiInt192.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int192`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt192.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt192.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt192 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt192 {
  readonly #class = BytesAbiInt192

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt192.Create) {
    return new BytesAbiInt192(value)
  }

  static fromOrThrow(value: BytesAbiInt192.From) {
    return new BytesAbiInt192(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt192(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt192(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int192`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt192.nibbles

    const content = cursor.readOrThrow(BytesAbiInt192.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt192(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt192.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt192.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt192.bytes)

    return new BytesAbiInt192(content)
  }

}

export namespace RawHexAbiInt192 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt192 {
  readonly #class = RawHexAbiInt192

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly bitsn = BigInt(192)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt192.Create) {
    return new RawHexAbiInt192(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt192(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt192(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt192.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt192.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt192(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt192.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt192.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt192(value.slice(2) as RawHexString)
    return RawHexAbiInt192.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int192`
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
    return new RawHexAbiInt192(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt192.bytes

    const content = cursor.readOrThrow(RawHexAbiInt192.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt192(value as RawHexString)
  }

}

export { BytesAbiInt200 as BytesInt200, AbiInt200 as Int200, RawHexAbiInt200 as RawHexInt200 };

export type AbiInt200 =
  | RawHexAbiInt200
  | BytesAbiInt200

export namespace AbiInt200 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt200.Create
    | RawHexAbiInt200.Create

  export type From =
    | BytesAbiInt200.From
    | RawHexAbiInt200.From

  export function create(value: AbiInt200.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt200.create(value)
    return RawHexAbiInt200.create(value)
  }

  export function fromOrThrow(value: AbiInt200.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt200.fromOrThrow(value)
    return RawHexAbiInt200.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int200`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt200.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt200.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt200 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt200 {
  readonly #class = BytesAbiInt200

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt200.Create) {
    return new BytesAbiInt200(value)
  }

  static fromOrThrow(value: BytesAbiInt200.From) {
    return new BytesAbiInt200(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt200(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt200(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int200`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt200.nibbles

    const content = cursor.readOrThrow(BytesAbiInt200.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt200(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt200.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt200.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt200.bytes)

    return new BytesAbiInt200(content)
  }

}

export namespace RawHexAbiInt200 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt200 {
  readonly #class = RawHexAbiInt200

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly bitsn = BigInt(200)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt200.Create) {
    return new RawHexAbiInt200(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt200(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt200(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt200.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt200.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt200(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt200.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt200.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt200(value.slice(2) as RawHexString)
    return RawHexAbiInt200.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int200`
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
    return new RawHexAbiInt200(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt200.bytes

    const content = cursor.readOrThrow(RawHexAbiInt200.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt200(value as RawHexString)
  }

}

export { BytesAbiInt208 as BytesInt208, AbiInt208 as Int208, RawHexAbiInt208 as RawHexInt208 };

export type AbiInt208 =
  | RawHexAbiInt208
  | BytesAbiInt208

export namespace AbiInt208 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt208.Create
    | RawHexAbiInt208.Create

  export type From =
    | BytesAbiInt208.From
    | RawHexAbiInt208.From

  export function create(value: AbiInt208.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt208.create(value)
    return RawHexAbiInt208.create(value)
  }

  export function fromOrThrow(value: AbiInt208.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt208.fromOrThrow(value)
    return RawHexAbiInt208.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int208`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt208.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt208.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt208 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt208 {
  readonly #class = BytesAbiInt208

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt208.Create) {
    return new BytesAbiInt208(value)
  }

  static fromOrThrow(value: BytesAbiInt208.From) {
    return new BytesAbiInt208(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt208(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt208(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int208`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt208.nibbles

    const content = cursor.readOrThrow(BytesAbiInt208.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt208(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt208.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt208.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt208.bytes)

    return new BytesAbiInt208(content)
  }

}

export namespace RawHexAbiInt208 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt208 {
  readonly #class = RawHexAbiInt208

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly bitsn = BigInt(208)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt208.Create) {
    return new RawHexAbiInt208(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt208(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt208(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt208.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt208.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt208(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt208.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt208.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt208(value.slice(2) as RawHexString)
    return RawHexAbiInt208.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int208`
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
    return new RawHexAbiInt208(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt208.bytes

    const content = cursor.readOrThrow(RawHexAbiInt208.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt208(value as RawHexString)
  }

}

export { BytesAbiInt216 as BytesInt216, AbiInt216 as Int216, RawHexAbiInt216 as RawHexInt216 };

export type AbiInt216 =
  | RawHexAbiInt216
  | BytesAbiInt216

export namespace AbiInt216 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt216.Create
    | RawHexAbiInt216.Create

  export type From =
    | BytesAbiInt216.From
    | RawHexAbiInt216.From

  export function create(value: AbiInt216.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt216.create(value)
    return RawHexAbiInt216.create(value)
  }

  export function fromOrThrow(value: AbiInt216.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt216.fromOrThrow(value)
    return RawHexAbiInt216.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int216`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt216.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt216.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt216 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt216 {
  readonly #class = BytesAbiInt216

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt216.Create) {
    return new BytesAbiInt216(value)
  }

  static fromOrThrow(value: BytesAbiInt216.From) {
    return new BytesAbiInt216(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt216(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt216(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int216`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt216.nibbles

    const content = cursor.readOrThrow(BytesAbiInt216.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt216(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt216.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt216.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt216.bytes)

    return new BytesAbiInt216(content)
  }

}

export namespace RawHexAbiInt216 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt216 {
  readonly #class = RawHexAbiInt216

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly bitsn = BigInt(216)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt216.Create) {
    return new RawHexAbiInt216(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt216(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt216(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt216.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt216.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt216(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt216.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt216.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt216(value.slice(2) as RawHexString)
    return RawHexAbiInt216.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int216`
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
    return new RawHexAbiInt216(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt216.bytes

    const content = cursor.readOrThrow(RawHexAbiInt216.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt216(value as RawHexString)
  }

}

export { BytesAbiInt224 as BytesInt224, AbiInt224 as Int224, RawHexAbiInt224 as RawHexInt224 };

export type AbiInt224 =
  | RawHexAbiInt224
  | BytesAbiInt224

export namespace AbiInt224 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt224.Create
    | RawHexAbiInt224.Create

  export type From =
    | BytesAbiInt224.From
    | RawHexAbiInt224.From

  export function create(value: AbiInt224.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt224.create(value)
    return RawHexAbiInt224.create(value)
  }

  export function fromOrThrow(value: AbiInt224.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt224.fromOrThrow(value)
    return RawHexAbiInt224.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int224`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt224.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt224.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt224 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt224 {
  readonly #class = BytesAbiInt224

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt224.Create) {
    return new BytesAbiInt224(value)
  }

  static fromOrThrow(value: BytesAbiInt224.From) {
    return new BytesAbiInt224(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt224(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt224(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int224`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt224.nibbles

    const content = cursor.readOrThrow(BytesAbiInt224.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt224(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt224.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt224.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt224.bytes)

    return new BytesAbiInt224(content)
  }

}

export namespace RawHexAbiInt224 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt224 {
  readonly #class = RawHexAbiInt224

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly bitsn = BigInt(224)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt224.Create) {
    return new RawHexAbiInt224(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt224(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt224(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt224.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt224.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt224(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt224.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt224.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt224(value.slice(2) as RawHexString)
    return RawHexAbiInt224.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int224`
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
    return new RawHexAbiInt224(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt224.bytes

    const content = cursor.readOrThrow(RawHexAbiInt224.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt224(value as RawHexString)
  }

}

export { BytesAbiInt232 as BytesInt232, AbiInt232 as Int232, RawHexAbiInt232 as RawHexInt232 };

export type AbiInt232 =
  | RawHexAbiInt232
  | BytesAbiInt232

export namespace AbiInt232 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt232.Create
    | RawHexAbiInt232.Create

  export type From =
    | BytesAbiInt232.From
    | RawHexAbiInt232.From

  export function create(value: AbiInt232.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt232.create(value)
    return RawHexAbiInt232.create(value)
  }

  export function fromOrThrow(value: AbiInt232.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt232.fromOrThrow(value)
    return RawHexAbiInt232.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int232`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt232.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt232.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt232 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt232 {
  readonly #class = BytesAbiInt232

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt232.Create) {
    return new BytesAbiInt232(value)
  }

  static fromOrThrow(value: BytesAbiInt232.From) {
    return new BytesAbiInt232(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt232(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt232(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int232`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt232.nibbles

    const content = cursor.readOrThrow(BytesAbiInt232.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt232(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt232.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt232.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt232.bytes)

    return new BytesAbiInt232(content)
  }

}

export namespace RawHexAbiInt232 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt232 {
  readonly #class = RawHexAbiInt232

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly bitsn = BigInt(232)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt232.Create) {
    return new RawHexAbiInt232(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt232(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt232(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt232.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt232.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt232(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt232.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt232.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt232(value.slice(2) as RawHexString)
    return RawHexAbiInt232.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int232`
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
    return new RawHexAbiInt232(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt232.bytes

    const content = cursor.readOrThrow(RawHexAbiInt232.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt232(value as RawHexString)
  }

}

export { BytesAbiInt240 as BytesInt240, AbiInt240 as Int240, RawHexAbiInt240 as RawHexInt240 };

export type AbiInt240 =
  | RawHexAbiInt240
  | BytesAbiInt240

export namespace AbiInt240 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt240.Create
    | RawHexAbiInt240.Create

  export type From =
    | BytesAbiInt240.From
    | RawHexAbiInt240.From

  export function create(value: AbiInt240.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt240.create(value)
    return RawHexAbiInt240.create(value)
  }

  export function fromOrThrow(value: AbiInt240.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt240.fromOrThrow(value)
    return RawHexAbiInt240.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int240`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt240.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt240.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt240 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt240 {
  readonly #class = BytesAbiInt240

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt240.Create) {
    return new BytesAbiInt240(value)
  }

  static fromOrThrow(value: BytesAbiInt240.From) {
    return new BytesAbiInt240(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt240(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt240(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int240`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt240.nibbles

    const content = cursor.readOrThrow(BytesAbiInt240.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt240(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt240.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt240.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt240.bytes)

    return new BytesAbiInt240(content)
  }

}

export namespace RawHexAbiInt240 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt240 {
  readonly #class = RawHexAbiInt240

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly bitsn = BigInt(240)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt240.Create) {
    return new RawHexAbiInt240(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt240(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt240(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt240.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt240.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt240(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt240.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt240.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt240(value.slice(2) as RawHexString)
    return RawHexAbiInt240.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int240`
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
    return new RawHexAbiInt240(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt240.bytes

    const content = cursor.readOrThrow(RawHexAbiInt240.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt240(value as RawHexString)
  }

}

export { BytesAbiInt248 as BytesInt248, AbiInt248 as Int248, RawHexAbiInt248 as RawHexInt248 };

export type AbiInt248 =
  | RawHexAbiInt248
  | BytesAbiInt248

export namespace AbiInt248 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt248.Create
    | RawHexAbiInt248.Create

  export type From =
    | BytesAbiInt248.From
    | RawHexAbiInt248.From

  export function create(value: AbiInt248.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt248.create(value)
    return RawHexAbiInt248.create(value)
  }

  export function fromOrThrow(value: AbiInt248.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt248.fromOrThrow(value)
    return RawHexAbiInt248.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int248`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt248.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt248.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt248 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt248 {
  readonly #class = BytesAbiInt248

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt248.Create) {
    return new BytesAbiInt248(value)
  }

  static fromOrThrow(value: BytesAbiInt248.From) {
    return new BytesAbiInt248(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt248(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt248(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int248`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt248.nibbles

    const content = cursor.readOrThrow(BytesAbiInt248.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt248(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt248.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt248.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt248.bytes)

    return new BytesAbiInt248(content)
  }

}

export namespace RawHexAbiInt248 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt248 {
  readonly #class = RawHexAbiInt248

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly bitsn = BigInt(248)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt248.Create) {
    return new RawHexAbiInt248(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt248(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt248(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt248.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt248.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt248(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt248.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt248.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt248(value.slice(2) as RawHexString)
    return RawHexAbiInt248.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int248`
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
    return new RawHexAbiInt248(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt248.bytes

    const content = cursor.readOrThrow(RawHexAbiInt248.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt248(value as RawHexString)
  }

}

export { BytesAbiInt256 as BytesInt256, AbiInt256 as Int256, RawHexAbiInt256 as RawHexInt256 };

export type AbiInt256 =
  | RawHexAbiInt256
  | BytesAbiInt256

export namespace AbiInt256 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiInt256.Create
    | RawHexAbiInt256.Create

  export type From =
    | BytesAbiInt256.From
    | RawHexAbiInt256.From

  export function create(value: AbiInt256.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiInt256.create(value)
    return RawHexAbiInt256.create(value)
  }

  export function fromOrThrow(value: AbiInt256.From) {
    if (value instanceof Uint8Array)
      return BytesAbiInt256.fromOrThrow(value)
    return RawHexAbiInt256.fromOrThrow(value)
  }

  export function codegen() {
    return `Abi.Int256`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiInt256.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiInt256.readOrThrow(cursor)
  }

}

export namespace BytesAbiInt256 {

  export type Create = Uint8Array

  export type From = Uint8Array

}

export class BytesAbiInt256 {
  readonly #class = BytesAbiInt256

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiInt256.Create) {
    return new BytesAbiInt256(value)
  }

  static fromOrThrow(value: BytesAbiInt256.From) {
    return new BytesAbiInt256(value)
  }

  intoOrThrow(): bigint {
    return new RawHexAbiInt256(this.encodePackedOrThrow()).intoOrThrow()
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return new RawHexAbiInt256(this.encodePackedOrThrow()).toJSON()
  }

  static codegen() {
    return `Abi.Int256`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padStart(64, "0") as RawHexString
  }

  encodePackedOrThrow(): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(this.value) as RawHexString
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - BytesAbiInt256.nibbles

    const content = cursor.readOrThrow(BytesAbiInt256.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    return new BytesAbiInt256(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 32 - BytesAbiInt256.bytes)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - BytesAbiInt256.bytes

    const content = cursor.readAndCopyOrThrow(BytesAbiInt256.bytes)

    return new BytesAbiInt256(content)
  }

}

export namespace RawHexAbiInt256 {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiInt256 {
  readonly #class = RawHexAbiInt256

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly bitsn = BigInt(256)
  static readonly dynamic = false
  static readonly size = 32

  readonly bytes = this.#class.bytes
  readonly nibbles = this.#class.nibbles
  readonly bits = this.#class.bits
  readonly bitsn = this.#class.bitsn
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiInt256.Create) {
    return new RawHexAbiInt256(value)
  }

  static fromBigIntOrThrow(value: bigint) {
    if (value >= BN_0)
      return new RawHexAbiInt256(value.toString(16) as RawHexString)

    const mask = (BN_1 << 256n) - BN_1
    const value2 = ((~(-value)) & mask) + BN_1

    return new RawHexAbiInt256(value2.toString(16) as RawHexString)
  }

  static fromNumberOrThrow(value: number) {
    return RawHexAbiInt256.fromBigIntOrThrow(BigInt(value))
  }

  static fromOrThrow(value: RawHexAbiInt256.From) {
    if (value instanceof Uint8Array)
      return new RawHexAbiInt256(Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString)
    if (typeof value === "bigint")
      return RawHexAbiInt256.fromBigIntOrThrow(value)
    if (typeof value === "number")
      return RawHexAbiInt256.fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return new RawHexAbiInt256(value.slice(2) as RawHexString)
    return RawHexAbiInt256.fromBigIntOrThrow(BigInts.decodeDecimal(value))
  }

  intoOrThrow(): bigint {
    const mask = (BN_1 << this.bitsn) - BN_1
    const value = BigInts.decodeRawHex(this.value)

    if ((value & mask) >> (this.bitsn - BN_1))
      return -(((~value) & mask) + BN_1)

    return value
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow().toString()
  }

  static codegen() {
    return `Abi.Int256`
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
    return new RawHexAbiInt256(cursor.readOrThrow(64))
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.fillOrThrow(0, 32 - slice.bytes.length)
    cursor.writeOrThrow(slice.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - RawHexAbiInt256.bytes

    const content = cursor.readOrThrow(RawHexAbiInt256.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    return new RawHexAbiInt256(value as RawHexString)
  }

}

export type IntByName = {
  int8: typeof AbiInt8,
  int16: typeof AbiInt16,
  int24: typeof AbiInt24,
  int32: typeof AbiInt32,
  int40: typeof AbiInt40,
  int48: typeof AbiInt48,
  int56: typeof AbiInt56,
  int64: typeof AbiInt64,
  int72: typeof AbiInt72,
  int80: typeof AbiInt80,
  int88: typeof AbiInt88,
  int96: typeof AbiInt96,
  int104: typeof AbiInt104,
  int112: typeof AbiInt112,
  int120: typeof AbiInt120,
  int128: typeof AbiInt128,
  int136: typeof AbiInt136,
  int144: typeof AbiInt144,
  int152: typeof AbiInt152,
  int160: typeof AbiInt160,
  int168: typeof AbiInt168,
  int176: typeof AbiInt176,
  int184: typeof AbiInt184,
  int192: typeof AbiInt192,
  int200: typeof AbiInt200,
  int208: typeof AbiInt208,
  int216: typeof AbiInt216,
  int224: typeof AbiInt224,
  int232: typeof AbiInt232,
  int240: typeof AbiInt240,
  int248: typeof AbiInt248,
  int256: typeof AbiInt256,
}

export const intByName: IntByName = {
  int8: AbiInt8,
  int16: AbiInt16,
  int24: AbiInt24,
  int32: AbiInt32,
  int40: AbiInt40,
  int48: AbiInt48,
  int56: AbiInt56,
  int64: AbiInt64,
  int72: AbiInt72,
  int80: AbiInt80,
  int88: AbiInt88,
  int96: AbiInt96,
  int104: AbiInt104,
  int112: AbiInt112,
  int120: AbiInt120,
  int128: AbiInt128,
  int136: AbiInt136,
  int144: AbiInt144,
  int152: AbiInt152,
  int160: AbiInt160,
  int168: AbiInt168,
  int176: AbiInt176,
  int184: AbiInt184,
  int192: AbiInt192,
  int200: AbiInt200,
  int208: AbiInt208,
  int216: AbiInt216,
  int224: AbiInt224,
  int232: AbiInt232,
  int240: AbiInt240,
  int248: AbiInt248,
  int256: AbiInt256,
}