import { Bytes, Uint8Array } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Records } from "libs/records/records.js";
import { AbiFactory } from "../types.js";
import { AbiAddress } from "../types/address/address.js";
import { AbiArray } from "../types/array/array.js";
import { AbiBool } from "../types/bool/bool.js";
import { AbiBytes } from "../types/bytes/dynamic.js";
import { bytesByName } from "../types/bytes/static.js";
import { AbiFunctionSelector, AbiFunctionSelectorAndArguments } from "../types/function/function.js";
import { AbiInt256, intByName } from "../types/int/int.js";
import { AbiString } from "../types/string/string.js";
import { AbiTuple } from "../types/tuple/tuple.js";
import { AbiUint256, uintByName } from "../types/uint/uint.js";
import { AbiVector } from "../types/vector/vector.js";

export namespace FunctionSignature {

  const factoryByName: Record<string, AbiFactory> = {
    ...uintByName,
    ...intByName,
    ...bytesByName,
    bool: AbiBool,
    address: AbiAddress,
    bytes: AbiBytes,
    string: AbiString,
    uint: AbiUint256,
    int: AbiInt256,
  } as const

  export function $parse$(signature: string): AbiFunctionSelectorAndArguments.Factory<any> {
    return parseOrThrow(signature).codegen() as any
  }

  export function parseOrThrow(signature: string): AbiFunctionSelectorAndArguments.Factory<any> {
    const [, ...tokens] = signature.trim().split(/(,|\(|\)|\[|\])/g).filter(Boolean)

    if (tokens.shift() !== "(")
      throw new Error(`Expected parenthesis`)

    const bytes = Bytes.fromUtf8(signature)
    using hash = Keccak256.get().getOrThrow().hashOrThrow(bytes)
    const func = AbiFunctionSelector.create(hash.bytes.slice(0, 4) as Uint8Array<4>)
    const args = parseArgumentsOrThrow(tokens)

    return AbiFunctionSelectorAndArguments.create(func, args)
  }

  function parseArgumentsOrThrow(tokens: string[]): AbiTuple.Factory<AbiFactory[]> {
    const factories = new Array<AbiFactory>()

    while (tokens.length) {
      const token = tokens.shift()!

      if (!token)
        continue
      else if (token === ",")
        continue
      else if (token === "(")
        factories.push(parseArrayOrVectorOrSingleOrThrow(tokens, parseArgumentsOrThrow(tokens)))
      else if (token === ")")
        return AbiTuple.create(...factories)
      else if (token === "[")
        throw new Error(`Unexpected brackets`)
      else if (token === "]")
        throw new Error(`Unexpected brackets`)
      else
        factories.push(parseArrayOrVectorOrSingleOrThrow(tokens, Records.resolveOrThrow(factoryByName, token)))
    }

    return AbiTuple.create(...factories)
  }

  function parseArrayOrVectorOrSingleOrThrow(tokens: string[], factory: AbiFactory) {
    while (tokens.length) {
      if (tokens[0] === "[" && tokens[1] === "]") {
        tokens.shift()
        tokens.shift()

        factory = AbiVector.create(factory)
        continue
      }

      if (tokens[0] === "[" && tokens[2] === "]") {
        tokens.shift()

        const length = parseInt(tokens.shift()!)

        if (length > 256)
          throw new Error("Invalid length")

        tokens.shift()

        factory = AbiArray.create(factory, length)
        continue
      }

      return factory
    }

    return factory
  }

}