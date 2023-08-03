import { BinaryWriteError } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { RlpType, tryRead } from "../rlp.js";

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

  trySize(): Result<number, never> {
    return new Ok(1 + this.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + this.length).throw(t)

      for (const element of this.value)
        element.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpList55, Error> {
    return Result.unthrowSync(t => {
      const length = cursor.tryReadUint8().throw(t) - 0xc0

      const value = new Array(length)

      for (let i = 0; i < length; i++)
        value[i] = tryRead(cursor).throw(t)

      return new Ok(new RlpList55(value, length))
    })
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

  trySize(): Result<number, never> {
    return new Ok(1 + 1 + this.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + 1).throw(t)
      cursor.tryWriteUint8(this.length).throw(t)

      for (const element of this.value)
        element.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpListUint8, Error> {
    return Result.unthrowSync(t => {
      const first = cursor.tryReadUint8().throw(t)
      const length = cursor.tryReadUint8().throw(t)

      const value = new Array(length)

      for (let i = 0; i < length; i++)
        value[i] = tryRead(cursor).throw(t)

      return new Ok(new RlpListUint8(value, length))
    })
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

  trySize(): Result<number, never> {
    return new Ok(1 + 2 + this.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + 2).throw(t)
      cursor.tryWriteUint16(this.length).throw(t)

      for (const element of this.value)
        element.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpListUint16, Error> {
    return Result.unthrowSync(t => {
      const first = cursor.tryReadUint8().throw(t)
      const length = cursor.tryReadUint16().throw(t)

      const value = new Array(length)

      for (let i = 0; i < length; i++)
        value[i] = tryRead(cursor).throw(t)

      return new Ok(new RlpListUint16(value, length))
    })
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

  trySize(): Result<number, never> {
    return new Ok(1 + 3 + this.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + 3).throw(t)
      cursor.tryWriteUint24(this.length).throw(t)

      for (const element of this.value)
        element.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpListUint24, Error> {
    return Result.unthrowSync(t => {
      const first = cursor.tryReadUint8().throw(t)
      const length = cursor.tryReadUint24().throw(t)

      const value = new Array(length)

      for (let i = 0; i < length; i++)
        value[i] = tryRead(cursor).throw(t)

      return new Ok(new RlpListUint24(value, length))
    })
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

  trySize(): Result<number, never> {
    return new Ok(1 + 4 + this.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + 4).throw(t)
      cursor.tryWriteUint32(this.length).throw(t)

      for (const element of this.value)
        element.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpListUint32, Error> {
    return Result.unthrowSync(t => {
      const first = cursor.tryReadUint8().throw(t)
      const length = cursor.tryReadUint32().throw(t)

      const value = new Array(length)

      for (let i = 0; i < length; i++)
        value[i] = tryRead(cursor).throw(t)

      return new Ok(new RlpListUint32(value, length))
    })
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
    const size = value.reduce((a, b) => a + b.trySize().get(), 0)

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