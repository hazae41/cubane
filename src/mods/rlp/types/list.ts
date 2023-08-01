import { BinaryWriteError } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { RlpType } from "../rlp.js";

class RlpList55 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

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

}

class RlpListUint8 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

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

}

class RlpListUint16 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

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

}

class RlpListUint32 {

  constructor(
    readonly value: RlpType[],
    readonly length: number
  ) { }

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

}

export type RlpList =
  | RlpList55
  | RlpListUint8
  | RlpListUint16
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
    return new RlpListUint32(value, size)
  }

}