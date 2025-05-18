import { Cursor } from "@hazae41/cursor"
import { ZeroHexString } from "@hazae41/hexane"
import { BigIntAsInteger, BytesAsInteger, IntegerLike, ZeroHexAsInteger } from "mods/convert/index.js"

export abstract class AbstractRlpString { }

export class RlpString1 extends AbstractRlpString {

  constructor(
    readonly value: Uint8Array
  ) {
    super()
  }

  isList(): false {
    return false
  }

  isString(): this is RlpString1 {
    return true
  }

  sizeOrThrow(): number {
    return this.value.length
  }

  writeOrThrow(cursor: Cursor): void {
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(1)
    const bytes = new Uint8Array(content)

    return new RlpString1(bytes)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

}

export class RlpString55 extends AbstractRlpString {

  constructor(
    readonly value: Uint8Array
  ) {
    super()
  }

  isList(): false {
    return false
  }

  isString(): this is RlpString55 {
    return true
  }

  sizeOrThrow(): number {
    return 1 + this.value.length
  }

  writeOrThrow(cursor: Cursor): void {
    cursor.writeUint8OrThrow(0x80 + this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    const length = cursor.readUint8OrThrow() - 0x80
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpString55(bytes)
  }

  intoOrThrow() {
    return this.value
  }

}

export class RlpStringUint8 extends AbstractRlpString {

  constructor(
    readonly value: Uint8Array
  ) {
    super()
  }

  isList(): false {
    return false
  }

  isString(): this is RlpStringUint8 {
    return true
  }

  sizeOrThrow(): number {
    return 1 + 1 + this.value.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xb7 + 1)
    cursor.writeUint8OrThrow(this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint8OrThrow()
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpStringUint8(bytes)
  }

  intoOrThrow() {
    return this.value
  }

}

export class RlpStringUint16 extends AbstractRlpString {

  constructor(
    readonly value: Uint8Array
  ) {
    super()
  }

  isList(): false {
    return false
  }

  isString(): this is RlpStringUint16 {
    return true
  }

  sizeOrThrow() {
    return 1 + 2 + this.value.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xb7 + 2)
    cursor.writeUint16OrThrow(this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint16OrThrow()
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpStringUint16(bytes)
  }

  intoOrThrow() {
    return this.value
  }

}

export class RlpStringUint24 extends AbstractRlpString {

  constructor(
    readonly value: Uint8Array
  ) {
    super()
  }

  isList(): false {
    return false
  }

  isString(): this is RlpStringUint24 {
    return true
  }

  sizeOrThrow() {
    return 1 + 3 + this.value.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xb7 + 3)
    cursor.writeUint24OrThrow(this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint24OrThrow()
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpStringUint24(bytes)
  }

  intoOrThrow() {
    return this.value
  }

}

export class RlpStringUint32 extends AbstractRlpString {

  constructor(
    readonly value: Uint8Array
  ) {
    super()
  }

  isList(): false {
    return false
  }

  isString(): this is RlpStringUint32 {
    return true
  }

  sizeOrThrow() {
    return 1 + 4 + this.value.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xb7 + 4)
    cursor.writeUint32OrThrow(this.value.length)
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint32OrThrow()
    const value = cursor.readOrThrow(length)
    const bytes = new Uint8Array(value)

    return new RlpStringUint32(bytes)
  }

  intoOrThrow() {
    return this.value
  }

}

export type RlpString =
  | RlpString1
  | RlpString55
  | RlpStringUint8
  | RlpStringUint16
  | RlpStringUint24
  | RlpStringUint32

export namespace RlpString {

  export function empty() {
    return new RlpString1(new Uint8Array([0]))
  }

}

export namespace RlpString {

  export type From = Uint8Array

  export function fromOrThrow(value: Uint8Array): RlpString {
    if (value.length === 1 && value[0] < 0x80)
      return new RlpString1(value)
    if (value.length < 56)
      return new RlpString55(value)
    if (value.length < 256)
      return new RlpStringUint8(value)
    if (value.length < 65_536)
      return new RlpStringUint16(value)
    if (value.length < 16_777_216)
      return new RlpStringUint24(value)
    return new RlpStringUint32(value)
  }

}

export namespace RlpString {

  export function is(value: unknown): value is RlpString {
    return value instanceof AbstractRlpString
  }

  export function asOrThrow(value: unknown): RlpString {
    if (!is(value))
      throw new Error()
    return value
  }

}

export namespace RlpStringAsSelfOrInteger {

  export type From =
    | RlpString
    | IntegerLike

  export function fromOrThrow(from: From): RlpString {
    if (RlpString.is(from))
      return from
    return RlpString.fromOrThrow(BytesAsInteger.fromOrThrow(from))
  }

}

export namespace BytesAsRlpStringOrInteger {

  export type From =
    | RlpString
    | IntegerLike

  export function fromOrThrow(from: From): Uint8Array {
    if (RlpString.is(from))
      return from.value
    return BytesAsInteger.fromOrThrow(from)
  }

}

export namespace BigIntAsRlpStringOrInteger {

  export type From =
    | RlpString
    | IntegerLike

  export function fromOrThrow(from: From): bigint {
    if (RlpString.is(from))
      return BigIntAsInteger.fromOrThrow(from.value)
    return BigIntAsInteger.fromOrThrow(from)
  }

}

export namespace ZeroHexAsRlpStringOrInteger {

  export type From =
    | RlpString
    | IntegerLike

  export function fromOrThrow(from: From): ZeroHexString {
    if (RlpString.is(from))
      return ZeroHexAsInteger.fromOrThrow(from.value)
    return ZeroHexAsInteger.fromOrThrow(from)
  }

  export namespace Length {

    export function fromOrThrow<N extends number>(value: From, byteLength: N): ZeroHexString<N> {
      return ZeroHexString.Length.asOrThrow(ZeroHexAsRlpStringOrInteger.fromOrThrow(value), byteLength)
    }

  }

}