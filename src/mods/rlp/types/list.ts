import { BinaryWriteError } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { RlpType } from "../rlp.js";

class RlpList55 {

  private constructor(
    readonly value: RlpType[],
    readonly size: number
  ) { }

  static new(value: RlpType[], size: number) {
    return new RlpList55(value, 1 + size)
  }

  trySize(): Result<number, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + this.value.length).throw(t)

      for (const element of this.value)
        element.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

}

class RlpListUint8 {

  private constructor(
    readonly value: RlpType[],
    readonly size: number
  ) { }

  static new(value: RlpType[], size: number) {
    return new RlpListUint8(value, 1 + 1 + size)
  }

  trySize(): Result<number, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + 1).throw(t)
      cursor.tryWriteUint8(this.value.length).throw(t)

      for (const element of this.value)
        element.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

}

class RlpListUint16 {

  private constructor(
    readonly value: RlpType[],
    readonly size: number
  ) { }

  static new(value: RlpType[], size: number) {
    return new RlpListUint16(value, 1 + 2 + size)
  }

  trySize(): Result<number, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + 2).throw(t)
      cursor.tryWriteUint16(this.value.length).throw(t)

      for (const element of this.value)
        element.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

}

class RlpListUint32 {

  private constructor(
    readonly value: RlpType[],
    readonly size: number
  ) { }

  static new(value: RlpType[], size: number) {
    return new RlpListUint32(value, 1 + 4 + size)
  }

  trySize(): Result<number, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.tryWriteUint8(0xc0 + 4).throw(t)
      cursor.tryWriteUint32(this.value.length).throw(t)

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
      return RlpList55.new(value, size)
    if (value.length < 256)
      return RlpListUint8.new(value, size)
    if (value.length < 65_536)
      return RlpListUint16.new(value, size)
    return RlpListUint32.new(value, size)
  }

}