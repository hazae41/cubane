import { Cursor } from "@hazae41/cursor";
import { BytesOrBytesArray, readOrThrow, RlpType } from "../rlp.js";

export abstract class AbstractRlpList<T extends RlpType[] = RlpType[]> {
  abstract readonly value: T
}

export class RlpList55<T extends RlpType[] = RlpType[]> extends AbstractRlpList<T> {

  constructor(
    readonly value: T,
    readonly length: number
  ) {
    super()
  }

  isList(): this is RlpList55<T> {
    return true
  }

  isString(): false {
    return false
  }

  sizeOrThrow(): number {
    return 1 + this.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xc0 + this.length)

    for (const element of this.value)
      element.writeOrThrow(cursor)

    return
  }

  static readOrThrow(cursor: Cursor) {
    const length = cursor.readUint8OrThrow() - 0xc0

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(readOrThrow(cursor))

    return new RlpList55(value, length)
  }

  intoOrThrow(): BytesOrBytesArray[] {
    return this.value.map(x => x.intoOrThrow())
  }

}

export class RlpListUint8<T extends RlpType[] = RlpType[]> extends AbstractRlpList<T> {

  constructor(
    readonly value: T,
    readonly length: number
  ) {
    super()
  }

  isList(): this is RlpListUint8<T> {
    return true
  }

  isString(): false {
    return false
  }

  sizeOrThrow(): number {
    return 1 + 1 + this.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xf7 + 1)
    cursor.writeUint8OrThrow(this.length)

    for (const element of this.value)
      element.writeOrThrow(cursor)

    return
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint8OrThrow()

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(readOrThrow(cursor))

    return new RlpListUint8(value, length)
  }

  intoOrThrow(): BytesOrBytesArray[] {
    return this.value.map(x => x.intoOrThrow())
  }

}

export class RlpListUint16<T extends RlpType[] = RlpType[]> extends AbstractRlpList<T> {

  constructor(
    readonly value: T,
    readonly length: number
  ) {
    super()
  }

  isList(): this is RlpListUint16<T> {
    return true
  }

  isString(): false {
    return false
  }

  sizeOrThrow(): number {
    return 1 + 2 + this.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xf7 + 2)
    cursor.writeUint16OrThrow(this.length)

    for (const element of this.value)
      element.writeOrThrow(cursor)

    return
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint16OrThrow()

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(readOrThrow(cursor))

    return new RlpListUint16(value, length)
  }

  intoOrThrow(): BytesOrBytesArray[] {
    return this.value.map(x => x.intoOrThrow())
  }

}

export class RlpListUint24<T extends RlpType[] = RlpType[]> extends AbstractRlpList<T> {

  constructor(
    readonly value: T,
    readonly length: number
  ) {
    super()
  }

  isList(): this is RlpListUint24<T> {
    return true
  }

  isString(): false {
    return false
  }

  sizeOrThrow(): number {
    return 1 + 3 + this.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xf7 + 3)
    cursor.writeUint24OrThrow(this.length)

    for (const element of this.value)
      element.writeOrThrow(cursor)

    return
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint24OrThrow()

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(readOrThrow(cursor))

    return new RlpListUint24(value, length)
  }

  intoOrThrow(): BytesOrBytesArray[] {
    return this.value.map(x => x.intoOrThrow())
  }

}

export class RlpListUint32<T extends RlpType[] = RlpType[]> extends AbstractRlpList<T> {

  constructor(
    readonly value: T,
    readonly length: number
  ) {
    super()
  }

  isList(): this is RlpListUint32<T> {
    return true
  }

  isString(): false {
    return false
  }

  sizeOrThrow(): number {
    return 1 + 4 + this.length
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(0xf7 + 4)
    cursor.writeUint32OrThrow(this.length)

    for (const element of this.value)
      element.writeOrThrow(cursor)

    return
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset++

    const length = cursor.readUint32OrThrow()

    const start = cursor.offset
    const value = new Array<RlpType>()

    while (cursor.offset - start < length)
      value.push(readOrThrow(cursor))

    return new RlpListUint32(value, length)
  }

  intoOrThrow(): BytesOrBytesArray[] {
    return this.value.map(x => x.intoOrThrow())
  }

}

export type RlpList<T extends RlpType[] = RlpType[]> =
  | RlpList55<T>
  | RlpListUint8<T>
  | RlpListUint16<T>
  | RlpListUint24<T>
  | RlpListUint32<T>

export namespace RlpList {

  export function empty(): RlpList {
    return new RlpList55([], 0)
  }

}

export namespace RlpList {

  export function is(value: unknown): value is RlpList {
    return value instanceof AbstractRlpList
  }

  export function asOrThrow(value: unknown): RlpList {
    if (!is(value))
      throw new Error()
    return value
  }

}

export namespace RlpList {

  export function fromOrThrow<T extends RlpType[]>(value: T): RlpList<T> {
    const size = value.reduce((a, b) => a + b.sizeOrThrow(), 0)

    if (size < 56)
      return new RlpList55(value, size)
    if (value.length < 256)
      return new RlpListUint8(value, size)
    if (value.length < 65_536)
      return new RlpListUint16(value, size)
    if (value.length < 16_777_216)
      return new RlpListUint24(value, size)
    return new RlpListUint32(value, size)
  }

}