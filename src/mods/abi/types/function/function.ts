import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { ReadOutputs } from "libs/readable/readable.js";
import { Factory } from "mods/abi/abi.js";
import { DynamicTupleFactory, DynamicTupleInstance } from "../tuple/tuple.js";

import type { Writable } from "@hazae41/binary";

type Unuseds = Writable

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

  tryEncodePacked() {
    return new Ok(Bytes.toHex(this.value))
  }

  tryEncode() {
    return new Ok(Bytes.toHex(this.value))
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return cursor.tryWrite(this.value)
  }

  static tryRead(cursor: Cursor): Result<FunctionSelector, BinaryReadError> {
    return cursor.tryRead(4).mapSync(FunctionSelector.new)
  }

}

export type FunctionSelectorAndArgumentsInstance<T extends readonly Factory[] = Factory[]> =
  Readable.ReadOutput<FunctionSelectorAndArgumentsFactory<T>>

export type FunctionSelectorAndArgumentsFactory<T extends readonly Factory[] = Factory[]> =
  ReturnType<typeof createFunctionSelectorAndArguments<T>> & { readonly name: string }

export const createFunctionSelectorAndArguments = <T extends readonly Factory[]>(args: DynamicTupleFactory<T>) => {
  return class FunctionSelectorAndArguments {
    readonly #class = FunctionSelectorAndArguments

    static readonly args = args

    constructor(
      readonly func: FunctionSelector,
      readonly args: DynamicTupleInstance<T>
    ) { }

    static tryNew(inner: FunctionSelector, ...instances: ReadOutputs<T>): Result<FunctionSelectorAndArguments, Error> {
      return Result.unthrowSync(t => {
        const args = FunctionSelectorAndArguments.args.tryNew(...instances).throw(t)

        return new Ok(new FunctionSelectorAndArguments(inner, args))
      })
    }

    get class() {
      return this.#class
    }

    trySize(): Result<number, never> {
      return new Ok(this.func.trySize().get() + this.args.trySize().get())
    }

    tryEncodePacked() {
      return new Ok(this.func.tryEncodePacked().get() + this.args.tryEncodePacked().get())
    }

    tryEncode() {
      return new Ok(this.func.tryEncode().get() + this.args.tryEncode().get())
    }

    tryWrite(cursor: Cursor): Result<void, Error> {
      return Result.unthrowSync(t => {
        this.func.tryWrite(cursor).throw(t)
        this.args.tryWrite(cursor).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<FunctionSelectorAndArguments, Error> {
      return Result.unthrowSync(t => {
        const func = FunctionSelector.tryRead(cursor).throw(t)
        const args = FunctionSelectorAndArguments.args.tryRead(cursor).throw(t)

        return new Ok(new FunctionSelectorAndArguments(func, args))
      })
    }

  }
}