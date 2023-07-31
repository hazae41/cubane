import { BinaryReadError, BinaryWriteError, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { ReadOutputs } from "libs/readable/readable.js";
import { Factory } from "mods/abi/abi.js";
import { DecodingError } from "mods/abi/errors/errors.js";
import { DynamicTuple, createDynamicTuple } from "../tuple/tuple.js";

export class InvalidFunctionSelector extends Error {
  readonly #class = InvalidFunctionSelector
  readonly name = this.#class.name

  constructor() {
    super(`Invalid function selector`)
  }
}

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
  readonly args: DynamicTuple<T>
}

export const createFunctionSelectorAndArguments = <T extends readonly Factory[]>(...factories: T) => class Class {
  readonly #class = Class

  static readonly Tuple = createDynamicTuple(...factories)

  constructor(
    readonly func: FunctionSelector,
    readonly args: DynamicTuple<T>
  ) { }

  static new(inner: FunctionSelector, ...instances: ReadOutputs<T>) {
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

  static tryRead(cursor: Cursor): Result<FunctionSelectorAndArguments<T>, DecodingError> {
    return Result.unthrowSync(t => {
      const func = FunctionSelector.tryRead(cursor).throw(t)
      const args = Class.Tuple.tryRead(cursor).throw(t)

      return new Ok(new Class(func, args))
    })
  }

}