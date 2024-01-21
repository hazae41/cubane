import { Base16 } from "@hazae41/base16";
import { Bytes, Uint8Array } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { AbiFactory } from "mods/abi/types.js";
import { AbiTuple } from "../index.js";

export { AbiFunction as Function, AbiFunctionSelector as FunctionSelector, AbiFunctionSelectorAndArguments as FunctionSelectorAndArguments };

export class InvalidFunctionSelector extends Error {
  readonly #class = InvalidFunctionSelector
  readonly name = this.#class.name

  constructor() {
    super(`Invalid function selector`)
  }
}

export class AbiFunctionSelector {
  readonly #class = AbiFunctionSelector

  readonly size = 4

  private constructor(
    readonly value: Uint8Array<4>
  ) { }

  static create(value: Uint8Array<4>) {
    return new AbiFunctionSelector(value)
  }

  static from(values: readonly [number, number, number, number]) {
    return new AbiFunctionSelector(Bytes.from(values))
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

    return new AbiFunctionSelector(bytes as Uint8Array<4>)
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

    return new AbiFunctionSelector(bytes)
  }

}

export class AbiFunctionSelectorAndArguments {

  private constructor() { }

  static create<T extends readonly AbiFactory[]>($func: AbiFunctionSelector, $args: AbiTuple.Factory<T>) {
    return class AbiFunctionSelectorAndArguments {
      readonly #class = AbiFunctionSelectorAndArguments

      static readonly func = $func
      static readonly args = $args

      constructor(
        readonly func: AbiFunctionSelector,
        readonly args: AbiTuple.Instance<T>
      ) { }

      static create(...instances: AbiFactory.Instances<T>) {
        const args = AbiFunctionSelectorAndArguments.args.create(instances)

        return new AbiFunctionSelectorAndArguments($func, args)
      }

      static from(...primitives: AbiFactory.Froms<T>) {
        const args = AbiFunctionSelectorAndArguments.args.from(primitives)

        return new AbiFunctionSelectorAndArguments($func, args)
      }

      intoOrThrow() {
        return this.args.intoOrThrow()
      }

      toJSON() {
        return this.args.toJSON()
      }

      verify() {
        return Bytes.equals($func.value, this.func.value)
      }

      verifyOrThrow() {
        if (!this.verify())
          throw new Error(`Invalid function selector`)

        return this
      }

      static codegen() {
        return `Abi.FunctionSelectorAndArguments.create(${$func.codegen()},${$args.codegen()})`
      }

      get class() {
        return this.#class
      }

      encodeOrThrow() {
        return this.func.encodeOrThrow() + this.args.encodeOrThrow()
      }

      encodePackedOrThrow() {
        return this.func.encodePackedOrThrow() + this.args.encodePackedOrThrow()
      }

      static decodeOrThrow(cursor: TextCursor) {
        const func = AbiFunctionSelector.decodeOrThrow(cursor)
        const args = AbiFunctionSelectorAndArguments.args.decodeOrThrow(cursor)

        return new AbiFunctionSelectorAndArguments(func, args)
      }

      sizeOrThrow() {
        return this.func.sizeOrThrow() + this.args.sizeOrThrow()
      }

      writeOrThrow(cursor: Cursor) {
        this.func.writeOrThrow(cursor)
        this.args.writeOrThrow(cursor)
      }

      static readOrThrow(cursor: Cursor) {
        const func = AbiFunctionSelector.readOrThrow(cursor)
        const args = AbiFunctionSelectorAndArguments.args.readOrThrow(cursor)

        return new AbiFunctionSelectorAndArguments(func, args)
      }

    }
  }

}

export namespace AbiFunctionSelectorAndArguments {

  export type Factory<T extends readonly AbiFactory[]> =
    ReturnType<typeof AbiFunctionSelectorAndArguments.create<T>>

  export type Instance<T extends readonly AbiFactory[]> =
    AbiFactory.Instance<Factory<T>>

}

export class AbiFunction<N extends string, A extends readonly AbiFactory[], R extends readonly AbiFactory[]> {

  private constructor(
    readonly name: N,
    readonly func: AbiFunctionSelector,
    readonly args: AbiTuple.Factory<A>,
    readonly rets: R
  ) { }

  static create<N extends string, A extends readonly AbiFactory[], R extends readonly AbiFactory[]>(name: N, func: AbiFunctionSelector, args: AbiTuple.Factory<A>, rets: R) {
    return new AbiFunction(name, func, args, rets)
  }

}

export namespace AbiFunction {

  export type Args<T> = T extends AbiFunction<any, infer A, any> ? A : never

  export type Rets<T> = T extends AbiFunction<any, any, infer R> ? R : never

}