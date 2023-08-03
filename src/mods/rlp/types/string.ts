import { BinaryReadError, BinaryWriteError } from "@hazae41/binary"
import { Cursor } from "@hazae41/cursor"
import { Ok, Result } from "@hazae41/result"

export class RlpString1 {

  constructor(
    readonly value: Uint8Array
  ) { }

  isList(): false {
    return false
  }

  isString(): this is RlpString1 {
    return true
  }

  trySize(): Result<number, never> {
    return new Ok(1)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return cursor.tryWrite(this.value)
  }

  static tryRead(cursor: Cursor): Result<RlpString1, BinaryReadError> {
    return cursor.tryRead(1).mapSync(x => new RlpString1(x))
  }

}

export class RlpString55 {

  constructor(
    readonly value: Uint8Array
  ) { }

  isList(): false {
    return false
  }

  isString(): this is RlpString55 {
    return true
  }

  trySize(): Result<number, never> {
    return new Ok(1 + this.value.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0x80 + this.value.length).throw(t)
      cursor.tryWrite(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpString55, BinaryReadError> {
    return Result.unthrowSync(t => {
      const length = 0x80 - cursor.tryReadUint8().throw(t)
      const value = cursor.tryRead(length).throw(t)

      return new Ok(new RlpString55(value))
    })
  }

}

export class RlpStringUint8 {

  constructor(
    readonly value: Uint8Array
  ) { }

  isList(): false {
    return false
  }

  isString(): this is RlpStringUint8 {
    return true
  }

  trySize(): Result<number, never> {
    return new Ok(1 + 1 + this.value.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xb7 + 1).throw(t)
      cursor.tryWriteUint8(this.value.length).throw(t)
      cursor.tryWrite(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpStringUint8, BinaryReadError> {
    return Result.unthrowSync(t => {
      const first = cursor.tryReadUint8().throw(t)
      const length = cursor.tryReadUint8().throw(t)
      const value = cursor.tryRead(length).throw(t)

      return new Ok(new RlpStringUint8(value))
    })
  }

}

export class RlpStringUint16 {

  constructor(
    readonly value: Uint8Array
  ) { }

  isList(): false {
    return false
  }

  isString(): this is RlpStringUint16 {
    return true
  }

  trySize(): Result<number, never> {
    return new Ok(1 + 2 + this.value.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xb7 + 2).throw(t)
      cursor.tryWriteUint16(this.value.length).throw(t)
      cursor.tryWrite(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpStringUint16, BinaryReadError> {
    return Result.unthrowSync(t => {
      const first = cursor.tryReadUint8().throw(t)
      const length = cursor.tryReadUint16().throw(t)
      const value = cursor.tryRead(length).throw(t)

      return new Ok(new RlpStringUint16(value))
    })
  }

}

export class RlpStringUint24 {

  constructor(
    readonly value: Uint8Array
  ) { }

  isList(): false {
    return false
  }

  isString(): this is RlpStringUint24 {
    return true
  }

  trySize(): Result<number, never> {
    return new Ok(1 + 3 + this.value.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xb7 + 3).throw(t)
      cursor.tryWriteUint24(this.value.length).throw(t)
      cursor.tryWrite(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpStringUint24, BinaryReadError> {
    return Result.unthrowSync(t => {
      const first = cursor.tryReadUint8().throw(t)
      const length = cursor.tryReadUint24().throw(t)
      const value = cursor.tryRead(length).throw(t)

      return new Ok(new RlpStringUint24(value))
    })
  }

}

export class RlpStringUint32 {

  constructor(
    readonly value: Uint8Array
  ) { }

  isList(): false {
    return false
  }

  isString(): this is RlpStringUint32 {
    return true
  }

  trySize(): Result<number, never> {
    return new Ok(1 + 4 + this.value.length)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xb7 + 4).throw(t)
      cursor.tryWriteUint32(this.value.length).throw(t)
      cursor.tryWrite(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<RlpStringUint32, BinaryReadError> {
    return Result.unthrowSync(t => {
      const first = cursor.tryReadUint8().throw(t)
      const length = cursor.tryReadUint32().throw(t)
      const value = cursor.tryRead(length).throw(t)

      return new Ok(new RlpStringUint32(value))
    })
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

  export function from(value: Uint8Array): RlpString {
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