import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "../abi.js";
import { Instanced, Tuple, createTuple } from "../tuple/tuple.js";

export class FunctionSelector {
  readonly #class = FunctionSelector

  private constructor(
    readonly value: Bytes<4>
  ) { }

  static new(value: Bytes<4>) {
    return new FunctionSelector(value)
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

  static tryRead(cursor: Cursor): Result<FunctionSelector, BinaryReadError> {
    return cursor.tryRead(4).mapSync(FunctionSelector.new)
  }

}

export interface FunctionSelectorAndArguments<T extends readonly Factory[]> extends Writable<never, Error> {
  readonly class: Factory<FunctionSelectorAndArguments<T>>
  readonly func: FunctionSelector,
  readonly args: Tuple<T>
}

export const createFunctionSelectorAndArguments = <T extends readonly Factory[]>(...factories: T) => class Class {
  readonly #class = Class

  static readonly Tuple = createTuple(...factories)

  constructor(
    readonly func: FunctionSelector,
    readonly args: Tuple<T>
  ) { }

  static new(inner: FunctionSelector, ...instances: Instanced<T>) {
    return new Class(inner, Class.Tuple.new(...instances))
  }

  get class() {
    return this.#class
  }

  trySize(): Result<number, never> {
    return new Ok(this.func.trySize().get() + this.args.trySize().get())
  }

  tryWrite(cursor: Cursor): Result<void, Error> {
    return Result.unthrowSync(t => {
      this.func.tryWrite(cursor).throw(t)
      this.args.tryWrite(cursor).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<FunctionSelectorAndArguments<T>, Error> {
    return Result.unthrowSync(t => {
      const func = FunctionSelector.tryRead(cursor).throw(t)
      const args = Class.Tuple.tryRead(cursor).throw(t)

      return new Ok(new Class(func, args))
    })
  }

}