import { BinaryReadError, BinaryWriteError, Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Err, Ok, Result } from "@hazae41/result";
import { Factory } from "mods/abi/abi.js";
import { DynamicTupleFactory, DynamicTupleInstance } from "../tuple/tuple.js";

import { Base16 } from "@hazae41/base16";
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const bytes = Base16.get().padStartAndDecodeOrThrow(cursor.readOrThrow(8)).copyAndDispose()

    return new FunctionSelector(bytes as Uint8Array & { length: 4 })
  }

  sizeOrThrow() {
    return this.size
  }

  trySize(): Result<4, never> {
    return new Ok(this.size)
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return cursor.tryWrite(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    return cursor.readOrThrow(4)
  }

  static tryRead(cursor: Cursor): Result<FunctionSelector, BinaryReadError> {
    return cursor.tryRead(4).mapSync(FunctionSelector.new)
  }

}

export type FunctionSelectorAndArgumentsInstance<T extends readonly Factory<any, any>[] = Factory<any, any>[]> =
  Readable.ReadOutput<FunctionSelectorAndArgumentsFactory<T>>

export type FunctionSelectorAndArgumentsFactory<T extends readonly Factory<any, any>[] = Factory<any, any>[]> =
  ReturnType<typeof createFunctionSelectorAndArguments<T>> & { readonly name: string }

export const createFunctionSelectorAndArguments = <T extends readonly Factory<any, any>[]>(func: FunctionSelector, args: DynamicTupleFactory<T>) => {
  return class FunctionSelectorAndArguments {
    readonly #class = FunctionSelectorAndArguments

    static readonly func = func
    static readonly args = args

    constructor(
      readonly args: DynamicTupleInstance<T>
    ) { }

    static new(instances: Factory.Instances<T>) {
      const args = FunctionSelectorAndArguments.args.new(instances)
      return new FunctionSelectorAndArguments(args)
    }

    static from(...primitives: Factory.Primitives<T>) {
      const args = FunctionSelectorAndArguments.args.from(primitives)
      return new FunctionSelectorAndArguments(args)
    }

    into() {
      return this.args.into()
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

    encodeOrThrow() {
      return this.func.encodeOrThrow() + this.args.encodeOrThrow()
    }

    encodePackedOrThrow() {
      return this.func.encodePackedOrThrow() + this.args.encodePackedOrThrow()
    }

    static decodeOrThrow(cursor: TextCursor) {
      const func = FunctionSelector.decodeOrThrow(cursor)
      const args = FunctionSelectorAndArguments.args.decodeOrThrow(cursor)

      if (!Bytes.equals(func.value, this.func.value))
        throw new Error(`Invalid function selector`)

      return new FunctionSelectorAndArguments(args)
    }

    sizeOrThrow() {
      return this.func.size + this.args.size
    }

    trySize(): Result<number, never> {
      return new Ok(this.func.size + this.args.size)
    }

    writeOrThrow(cursor: Cursor) {
      this.func.writeOrThrow(cursor)
      this.args.writeOrThrow(cursor)
    }

    tryWrite(cursor: Cursor): Result<void, Error> {
      return Result.unthrowSync(t => {
        this.#class.func.tryWrite(cursor).throw(t)
        this.args.tryWrite(cursor).throw(t)

        return Ok.void()
      })
    }

    static readOrThrow(cursor: Cursor) {
      const func = FunctionSelector.readOrThrow(cursor)
      const args = FunctionSelectorAndArguments.args.readOrThrow(cursor)

      if (!Bytes.equals(func, this.func.value))
        throw new Error(`Invalid function selector`)

      return new FunctionSelectorAndArguments(args)
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