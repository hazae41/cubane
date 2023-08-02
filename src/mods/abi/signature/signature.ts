import { Err, Ok, Result } from "@hazae41/result";
import { Factory } from "../abi.js";
import { tryGetFactory } from "../parser/parser.js";
import { createDynamicArray } from "../types/array/array.js";
import { FunctionSelectorAndArgumentsFactory, createFunctionSelectorAndArguments } from "../types/function/function.js";
import { DynamicTupleFactory, createDynamicTuple } from "../types/tuple/tuple.js";
import { createDynamicVector } from "../types/vector/vector.js";

export class FunctionSignature<T extends readonly Factory[] = Factory[]> {

  constructor(
    readonly raw: string,
    readonly name: string,
    readonly inner: FunctionSelectorAndArgumentsFactory<T>,
  ) { }

  static tryParse(signature: string): Result<FunctionSignature, Error> {
    return Result.unthrowSync(t => {
      const [name, ...tokens] = signature.trim().split(/(,|\(|\)|\[|\])/g).filter(Boolean)

      if (tokens.shift() !== "(")
        return new Err(new Error(`Expected parenthesis`))

      const args = this.#tryParseArguments(tokens).throw(t)
      const inner = createFunctionSelectorAndArguments(args)

      return new Ok(new FunctionSignature(signature, name, inner))
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
          factories.push(this.#doParseArrayOrVectorOrSingle(tokens, tryGetFactory(token).throw(t)))
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

}