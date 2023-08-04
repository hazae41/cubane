import { Bytes } from "@hazae41/bytes";
import { Err, Ok, Result } from "@hazae41/result";
import { keccak_256 } from "@noble/hashes/sha3";
import { Records } from "libs/records/records.js";
import { Factory } from "../abi.js";
import { StaticAddress } from "../types/address/address.js";
import { createDynamicArray } from "../types/array/array.js";
import { StaticBool } from "../types/bool/bool.js";
import { DynamicBytes, bytesByName } from "../types/bytes/bytes.js";
import { FunctionSelector, FunctionSelectorAndArgumentsFactory, createFunctionSelectorAndArguments } from "../types/function/function.js";
import { intByName } from "../types/int/int.js";
import { DynamicString } from "../types/string/string.js";
import { DynamicTupleFactory, createDynamicTuple } from "../types/tuple/tuple.js";
import { uintByName } from "../types/uint/uint.js";
import { createDynamicVector } from "../types/vector/vector.js";

export class FunctionSignature<T extends readonly Factory[] = Factory[]> {

  static readonly factoryByName = {
    ...uintByName,
    ...intByName,
    ...bytesByName,
    bool: StaticBool,
    address: StaticAddress,
    bytes: DynamicBytes,
    string: DynamicString,
  } as const

  private constructor(
    readonly name: string,
    readonly signature: string,
    readonly inner: FunctionSelectorAndArgumentsFactory<T>,
  ) { }

  static new<T extends readonly Factory[]>(name: string, signature: string, inner: FunctionSelectorAndArgumentsFactory<T>) {
    return new FunctionSignature(name, signature, inner)
  }

  static tryParse(signature: string): Result<FunctionSignature, Error> {
    return Result.unthrowSync(t => {
      const [name, ...tokens] = signature.trim().split(/(,|\(|\)|\[|\])/g).filter(Boolean)

      if (tokens.shift() !== "(")
        return new Err(new Error(`Expected parenthesis`))

      const func = FunctionSelector.new(keccak_256(signature).slice(0, 4) as Bytes<4>)
      const args = this.#tryParseArguments(tokens).throw(t)

      const inner = createFunctionSelectorAndArguments(func, args)

      return new Ok(new FunctionSignature(name, signature, inner))
    })
  }

  static #tryParseArguments(tokens: string[]): Result<DynamicTupleFactory<Factory[]>, Error> {
    return Result.unthrowSync(t => {
      const factories = new Array<Factory>()

      while (tokens.length) {
        const token = tokens.shift()!

        if (!token)
          continue
        else if (token === ",")
          continue
        else if (token === "(")
          factories.push(this.#doParseArrayOrVectorOrSingle(tokens, this.#tryParseArguments(tokens).throw(t)))
        else if (token === ")")
          return new Ok(createDynamicTuple(...factories))
        else if (token === "[")
          return new Err(new Error(`Unexpected brackets`))
        else if (token === "]")
          return new Err(new Error(`Unexpected brackets`))
        else
          factories.push(this.#doParseArrayOrVectorOrSingle(tokens, Records.tryResolve(FunctionSignature.factoryByName, token).throw(t)))
      }

      return new Ok(createDynamicTuple(...factories))
    })
  }

  static #doParseArrayOrVectorOrSingle<T extends Factory>(tokens: string[], factory: T) {
    if (tokens[0] === "[" && tokens[1] === "]") {
      tokens.shift()
      tokens.shift()
      return createDynamicVector(factory)
    }

    if (tokens[0] === "[" && tokens[2] === "]") {
      tokens.shift()
      const length = parseInt(tokens.shift()!)
      tokens.shift()
      return createDynamicArray(factory, length)
    }

    return factory
  }

  codegen() {
    return `export const ${this.name} = Cubane.Abi.FunctionSignature.new("${this.name}","${this.signature}",${this.inner.codegen()})`
  }

}