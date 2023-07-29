import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Err, Ok, Result } from "@hazae41/result";

export class InvalidBoolValueError extends Error {
  readonly #class = InvalidBoolValueError
  readonly name = this.#class.name

  constructor(
    readonly byte: number
  ) {
    super(`Invalid Bool value ${byte}`)
  }

}

export class Bool {
  readonly #class = Bool

  private constructor(
    readonly value: boolean
  ) { }

  static new(value: boolean) {
    return new Bool(value)
  }

  get class() {
    return this.#class
  }

  trySize(): Result<number, never> {
    return new Ok(32)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 31)

      const byte = this.value ? 1 : 0
      cursor.tryWriteUint8(byte).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Bool, BinaryReadError | InvalidBoolValueError> {
    return Result.unthrowSync(t => {
      cursor.offset += 31

      const byte = cursor.tryReadUint8().throw(t)

      if (byte === 0)
        return new Ok(new Bool(false))
      if (byte === 1)
        return new Ok(new Bool(true))
      return new Err(new InvalidBoolValueError(byte))
    })
  }

}