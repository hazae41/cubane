import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "../abi.js";
import { Instanced, Tuple, createTuple } from "../tuple/tuple.js";

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

export interface FunctionAndParameters<T extends readonly Factory[]> extends Writable<never, Error> {
  readonly class: Factory<FunctionAndParameters<T>>
  readonly inner: Function,
  readonly params: Tuple<T>
}

export const createFunctionAndParams = <T extends readonly Factory[]>(...factories: T) => class Class {
  readonly #class = Class

  static readonly Tuple = createTuple(...factories)

  constructor(
    readonly inner: Function,
    readonly params: Tuple<T>
  ) { }

  static new(inner: Function, ...instances: Instanced<T>) {
    return new Class(inner, Class.Tuple.new(...instances))
  }

  get class() {
    return this.#class
  }

  trySize(): Result<number, never> {
    return new Ok(this.inner.trySize().get() + this.params.trySize().get())
  }

  tryWrite(cursor: Cursor): Result<void, Error> {
    return Result.unthrowSync(t => {
      this.inner.tryWrite(cursor).throw(t)
      this.params.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<FunctionAndParameters<T>, Error> {
    return Result.unthrowSync(t => {
      const inner = Function.tryRead(cursor).throw(t)
      const params = Class.Tuple.tryRead(cursor).throw(t)

      return new Ok(new Class(inner, params))
    })
  }

}