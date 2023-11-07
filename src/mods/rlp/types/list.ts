import { Cursor } from "@hazae41/cursor";
import { RlpType, readOrThrow } from "../rlp.js";

export class RlpList55 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

  isList(): this is RlpList55 {
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

}

export class RlpListUint8 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

  isList(): this is RlpListUint8 {
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

}

export class RlpListUint16 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

  isList(): this is RlpListUint16 {
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

}

export class RlpListUint24 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

  isList(): this is RlpListUint24 {
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

}

export class RlpListUint32 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

  isList(): this is RlpListUint32 {
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

}

export type RlpList =
  | RlpList55
  | RlpListUint8
  | RlpListUint16
  | RlpListUint24
  | RlpListUint32

export namespace RlpList {

  export function from(value: RlpType[]) {
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