import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { ReadOutputs } from "libs/readable/readable.js";
import { Factory } from "mods/abi/abi.js";
import { DynamicTupleFactory, DynamicTupleInstance } from "../tuple/tuple.js";

import type { Writable } from "@hazae41/binary";
import { TextCursor } from "libs/cursor/cursor.js";

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

  readonly size = 4 as const

  private constructor(
    readonly value: Bytes<4>
  ) { }

  static new(value: Bytes<4>) {
    return new FunctionSelector(value)
  }

  static from(value: Bytes<4>) {
    return new FunctionSelector(value)
  }

  static codegen() {
    return `Cubane.Abi.FunctionSelector`
  }

  get class() {
    return this.#class
  }

  encode() {
    return Bytes.toHex(this.value)
  }

  encodePacked() {
    return Bytes.toHex(this.value)
  }

  static decode(cursor: TextCursor) {
    return new FunctionSelector(Bytes.fromHex(cursor.read(8)) as Bytes<4>)
  }

  trySize(): Result<4, never> {
    return new Ok(this.size)
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

    static new(inner: FunctionSelector, instances: ReadOutputs<T>) {
      const args = FunctionSelectorAndArguments.args.new(instances)
      return new FunctionSelectorAndArguments(inner, args)
    }

    static from(x: [inner: FunctionSelector, instances: Factory.Primitives<T>]) {
      const [inner, instances] = x
      const args = FunctionSelectorAndArguments.args.from(instances)
      return new FunctionSelectorAndArguments(inner, args)
    }

    static codegen() {
      return `Cubane.Abi.createFunctionSelectorAndArguments(${args.codegen()})`
    }

    get class() {
      return this.#class
    }

    get size() {
      return this.func.size + this.args.size
    }

    encode() {
      return this.func.encode() + this.args.encode()
    }

    encodePacked() {
      return this.func.encodePacked() + this.args.encodePacked()
    }

    static decode(cursor: TextCursor) {
      const func = FunctionSelector.decode(cursor)
      const args = FunctionSelectorAndArguments.args.decode(cursor)

      return new FunctionSelectorAndArguments(func, args)
    }

    trySize(): Result<number, never> {
      return new Ok(this.func.size + this.args.size)
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