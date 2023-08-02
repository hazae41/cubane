import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Err, Ok, Result } from "@hazae41/result";
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
    readonly value: Uint8Array & { readonly length: 4 }
  ) { }

  static new(value: Uint8Array & { readonly length: 4 }) {
    return new FunctionSelector(value)
  }

  static from(values: [number, number, number, number]) {
    return new FunctionSelector(new Uint8Array(values) as Uint8Array & { readonly length: 4 })
  }

  static codegen() {
    return `Cubane.Abi.FunctionSelector`
  }

  codegen() {
    return `Cubane.Abi.FunctionSelector.from([${this.value}])`
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

export const createFunctionSelectorAndArguments = <T extends readonly Factory[]>(func: FunctionSelector, args: DynamicTupleFactory<T>) => {
  return class FunctionSelectorAndArguments {
    readonly #class = FunctionSelectorAndArguments

    static readonly func = func
    static readonly args = args

    constructor(
      readonly args: DynamicTupleInstance<T>
    ) { }

    static new(instances: ReadOutputs<T>) {
      const args = FunctionSelectorAndArguments.args.new(instances)
      return new FunctionSelectorAndArguments(args)
    }

    static from(values: Factory.Primitives<T>) {
      const args = FunctionSelectorAndArguments.args.from(values)
      return new FunctionSelectorAndArguments(args)
    }

    static codegen() {
      return `Cubane.Abi.createFunctionSelectorAndArguments(${func.codegen()},${args.codegen()})`
    }

    get class() {
      return this.#class
    }

    get func() {
      return this.#class.func
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

    static tryDecode(cursor: TextCursor) {
      const func = FunctionSelector.decode(cursor)
      const args = FunctionSelectorAndArguments.args.decode(cursor)

      if (!Bytes.equals(func.value, this.func.value))
        return new Err(new Error(`Invalid function selector`))

      return new Ok(new FunctionSelectorAndArguments(args))
    }

    trySize(): Result<number, never> {
      return new Ok(this.func.size + this.args.size)
    }

    tryWrite(cursor: Cursor): Result<void, Error> {
      return Result.unthrowSync(t => {
        this.#class.func.tryWrite(cursor).throw(t)
        this.args.tryWrite(cursor).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<FunctionSelectorAndArguments, Error> {
      return Result.unthrowSync(t => {
        const func = FunctionSelector.tryRead(cursor).throw(t)
        const args = FunctionSelectorAndArguments.args.tryRead(cursor).throw(t)

        if (!Bytes.equals(func.value, this.func.value))
          return new Err(new Error(`Invalid function selector`))

        return new Ok(new FunctionSelectorAndArguments(args))
      })
    }

  }
}