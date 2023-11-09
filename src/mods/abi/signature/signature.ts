import { Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Keccak256 } from "@hazae41/keccak256";
import { Err, Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { Records } from "libs/records/records.js";
import { Factory } from "../abi.js";
import { AbiAddress } from "../types/address/address.js";
import { createArray } from "../types/array/array.js";
import { AbiBool } from "../types/bool/bool.js";
import { AbiBytes } from "../types/bytes/dynamic.js";
import { bytesByName } from "../types/bytes/static.js";
import { FunctionSelector, FunctionSelectorAndArgumentsFactory, FunctionSelectorAndArgumentsInstance, createFunctionSelectorAndArguments } from "../types/function/function.js";
import { IntByName, intByName } from "../types/int/int.js";
import { AbiString } from "../types/string/string.js";
import { TupleFactory, createTuple } from "../types/tuple/tuple.js";
import { UintByName, uintByName } from "../types/uint/uint.js";
import { createVector } from "../types/vector/vector.js";

export namespace FunctionSignature {

  export const factoryByName: UintByName & IntByName & {
    bool: typeof AbiBool,
    address: typeof AbiAddress,
    bytes: typeof AbiBytes,
    string: typeof AbiString,
  } = {
    ...uintByName,
    ...intByName,
    ...bytesByName,
    bool: AbiBool,
    address: AbiAddress,
    bytes: AbiBytes,
    string: AbiString,
  } as const

  export function create<T extends readonly Factory[]>(name: string, args: FunctionSelectorAndArgumentsFactory<T>) {
    return createFunctionSignature(name, args)
  }

  export function $parse$(signature: string): FunctionSignatureFactory {
    return tryParse(signature).unwrap().codegen() as any
  }

  export function tryParse(signature: string): Result<FunctionSignatureFactory, Error> {
    return Result.unthrowSync(t => {
      const [name, ...tokens] = signature.trim().split(/(,|\(|\)|\[|\])/g).filter(Boolean)

      if (tokens.shift() !== "(")
        return new Err(new Error(`Expected parenthesis`))

      const bytes = Bytes.fromUtf8(signature)
      using hash = Keccak256.get().tryHash(bytes).throw(t)
      const func = FunctionSelector.create(hash.bytes.slice(0, 4) as Bytes<4>)
      const args = tryParseArguments(tokens).throw(t)

      const inner = createFunctionSelectorAndArguments(func, args)

      return new Ok(createFunctionSignature(name, inner))
    })
  }

  function tryParseArguments(tokens: string[]): Result<TupleFactory<Factory[]>, Error> {
    return Result.unthrowSync(t => {
      const factories = new Array<Factory>()

      while (tokens.length) {
        const token = tokens.shift()!

        if (!token)
          continue
        else if (token === ",")
          continue
        else if (token === "(")
          factories.push(doParseArrayOrVectorOrSingle(tokens, tryParseArguments(tokens).throw(t)))
        else if (token === ")")
          return new Ok(createTuple(...factories))
        else if (token === "[")
          return new Err(new Error(`Unexpected brackets`))
        else if (token === "]")
          return new Err(new Error(`Unexpected brackets`))
        else
          factories.push(doParseArrayOrVectorOrSingle(tokens, Records.tryResolve(FunctionSignature.factoryByName, token).throw(t)))
      }

      return new Ok(createTuple(...factories))
    })
  }

  function doParseArrayOrVectorOrSingle<T extends Factory>(tokens: string[], factory: T) {
    if (tokens[0] === "[" && tokens[1] === "]") {
      tokens.shift()
      tokens.shift()
      return createVector(factory)
    }

    if (tokens[0] === "[" && tokens[2] === "]") {
      tokens.shift()
      const length = parseInt(tokens.shift()!)
      tokens.shift()
      return createArray(factory, length)
    }

    return factory
  }

}

export type FunctionSignatureInstance<T extends readonly Factory[] = Factory[]> =
  Readable.Output<FunctionSignatureFactory<T>>

export type FunctionSignatureFactory<T extends readonly Factory[] = Factory[]> =
  ReturnType<typeof createFunctionSignature<T>> & { readonly name: string }

export function createFunctionSignature<T extends readonly Factory[] = Factory[]>($name: string, $funcAndArgs: FunctionSelectorAndArgumentsFactory<T>) {
  return class FunctionSignature {
    readonly #class = FunctionSignature

    static readonly name = $name
    static readonly funcAndArgs = $funcAndArgs

    readonly name = this.#class.name
    readonly funcAndArgs = this.#class.funcAndArgs

    constructor(
      readonly inner: FunctionSelectorAndArgumentsInstance<T>
    ) { }

    static create(...instances: Factory.Instances<T>) {
      const args = FunctionSignature.funcAndArgs.new(...instances)

      return new FunctionSignature(args)
    }

    static from(...primitives: Factory.Primitives<T>) {
      const args = FunctionSignature.funcAndArgs.from(...primitives)

      return new FunctionSignature(args)
    }

    static codegen() {
      return `Abi.createFunctionSignature("${$name}",${$funcAndArgs.codegen()})`
    }

    encodeOrThrow() {
      return this.inner.encodeOrThrow()
    }

    encodePackedOrThrow() {
      return this.inner.encodePackedOrThrow()
    }

    static decodeOrThrow(cursor: TextCursor) {
      return $funcAndArgs.decodeOrThrow(cursor)
    }

    sizeOrThrow() {
      return this.inner.sizeOrThrow()
    }

    writeOrThrow(cursor: Cursor) {
      return this.inner.writeOrThrow(cursor)
    }

    static readOrThrow(cursor: Cursor) {
      return $funcAndArgs.readOrThrow(cursor)
    }

  }
}