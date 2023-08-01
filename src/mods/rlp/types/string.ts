import { BinaryWriteError } from "@hazae41/binary"
import { Cursor } from "@hazae41/cursor"
import { Ok, Result } from "@hazae41/result"

class RlpString1 {

  constructor(
    readonly value: Uint8Array
  ) { }

  trySize(): Result<number, never> {
    return new Ok(1)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return cursor.tryWrite(this.value)
  }

}

class RlpString55 {

  constructor(
    readonly value: Uint8Array
  ) { }

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

}

class RlpStringUint8 {

  constructor(
    readonly value: Uint8Array
  ) { }

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

}

class RlpStringUint16 {

  constructor(
    readonly value: Uint8Array
  ) { }

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

}

class RlpStringUint32 {

  constructor(
    readonly value: Uint8Array
  ) { }

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

}

export type RlpString =
  | RlpString1
  | RlpString55
  | RlpStringUint8
  | RlpStringUint16
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
    return new RlpStringUint32(value)
  }

}