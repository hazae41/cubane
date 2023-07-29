import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";

export class Function {
  readonly #class = Function

  private constructor(
    readonly value: Bytes<4>
  ) { }

  static new(value: Bytes<4>) {
    return new Function(value)
  }

  get class() {
    return this.#class
  }

  trySize(): Result<number, never> {
    return new Ok(4)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return cursor.tryWrite(this.value)
  }

  static tryRead(cursor: Cursor): Result<Function, BinaryReadError> {
    return cursor.tryRead(4).mapSync(Function.new)
  }

}