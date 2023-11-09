import { Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Factory } from "mods/abi/abi.js";
import { TupleFactory, TupleInstance } from "../tuple/tuple.js";

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

  readonly size = 4

  private constructor(
    readonly value: Bytes<4>
  ) { }

  static create(value: Bytes<4>) {
    return new FunctionSelector(value)
  }

  static from(values: [number, number, number, number]) {
    return new FunctionSelector(new Uint8Array(values) as Bytes<4>)
  }

  static codegen() {
    return `Abi.FunctionSelector`
  }

  codegen() {
    return `Abi.FunctionSelector.from([${this.value}])`
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
    const content = cursor.readOrThrow(8)
    const bytes = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    return new FunctionSelector(bytes as Bytes<4>)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(4)
    const bytes = Bytes.from(content)

    return new FunctionSelector(bytes)
  }

}

export type FunctionSelectorAndArgumentsInstance<T extends readonly Factory[] = Factory[]> =
  Readable.Output<FunctionSelectorAndArgumentsFactory<T>>

export type FunctionSelectorAndArgumentsFactory<T extends readonly Factory[] = Factory[]> =
  ReturnType<typeof createFunctionSelectorAndArguments<T>> & { readonly name: string }

export const createFunctionSelectorAndArguments = <T extends readonly Factory[]>($func: FunctionSelector, $args: TupleFactory<T>) => {
  return class FunctionSelectorAndArguments {
    readonly #class = FunctionSelectorAndArguments

    static readonly func = $func
    static readonly args = $args

    readonly func = this.#class.func
    readonly args = this.#class.args

    constructor(
      readonly inner: TupleInstance<T>
    ) { }

    static new(...instances: Factory.Instances<T>) {
      const args = FunctionSelectorAndArguments.args.new(instances)

      return new FunctionSelectorAndArguments(args)
    }

    static from(...primitives: Factory.Primitives<T>) {
      const args = FunctionSelectorAndArguments.args.from(primitives)

      return new FunctionSelectorAndArguments(args)
    }

    intoOrThrow() {
      return this.inner.intoOrThrow()
    }

    static codegen() {
      return `Abi.createFunctionSelectorAndArguments(${$func.codegen()},${$args.codegen()})`
    }

    get class() {
      return this.#class
    }

    encodeOrThrow() {
      return this.func.encodeOrThrow() + this.inner.encodeOrThrow()
    }

    encodePackedOrThrow() {
      return this.func.encodePackedOrThrow() + this.inner.encodePackedOrThrow()
    }

    static decodeOrThrow(cursor: TextCursor) {
      const func = FunctionSelector.decodeOrThrow(cursor)
      const args = FunctionSelectorAndArguments.args.decodeOrThrow(cursor)

      if (!Bytes.equals(func.value, this.func.value))
        throw new Error(`Invalid function selector`)

      return new FunctionSelectorAndArguments(args)
    }

    sizeOrThrow() {
      return this.func.sizeOrThrow() + this.inner.sizeOrThrow()
    }

    writeOrThrow(cursor: Cursor) {
      this.func.writeOrThrow(cursor)
      this.inner.writeOrThrow(cursor)
    }

    static readOrThrow(cursor: Cursor) {
      const func = FunctionSelector.readOrThrow(cursor)
      const args = FunctionSelectorAndArguments.args.readOrThrow(cursor)

      if (!Bytes.equals(func.value, this.func.value))
        throw new Error(`Invalid function selector`)

      return new FunctionSelectorAndArguments(args)
    }

  }
}