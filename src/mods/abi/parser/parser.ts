import { Err, Ok, Result } from "@hazae41/result";
import { StaticAddress } from "../types/address/address.js";
import { StaticBool } from "../types/bool/bool.js";
import { DynamicBytes } from "../types/bytes/bytes.js";
import { Int104, Int112, Int120, Int128, Int136, Int144, Int152, Int16, Int160, Int168, Int176, Int184, Int192, Int200, Int208, Int216, Int224, Int232, Int24, Int240, Int248, Int256, Int32, Int40, Int48, Int56, Int64, Int72, Int8, Int80, Int88, Int96 } from "../types/int/int.js";
import { DynamicString } from "../types/string/string.js";
import { Uint104, Uint112, Uint120, Uint128, Uint136, Uint144, Uint152, Uint16, Uint160, Uint168, Uint176, Uint184, Uint192, Uint200, Uint208, Uint216, Uint224, Uint232, Uint24, Uint240, Uint248, Uint256, Uint32, Uint40, Uint48, Uint56, Uint64, Uint72, Uint8, Uint80, Uint88, Uint96 } from "../types/uint/uint.js";

import type { Readable, Writable } from "@hazae41/binary";
import type { Cursor } from "@hazae41/cursor";
import { Factory } from "../abi.js";
import { createDynamicArray } from "../types/array/array.js";
import { DynamicTupleFactory, createDynamicTuple } from "../types/tuple/tuple.js";
import { createDynamicVector } from "../types/vector/vector.js";

type Unuseds = Readable | Writable | Cursor

export class NameParseError extends Error {
  readonly #class = NameParseError
  readonly name = this.#class.name

  constructor() {
    super(`Could not parse name`)
  }

}

export class NamesParseError extends Error {
  readonly #class = NamesParseError
  readonly name = this.#class.name

  constructor() {
    super(`Could not parse names`)
  }

}

export class SignatureParseError extends Error {
  readonly #class = SignatureParseError
  readonly name = this.#class.name

  constructor() {
    super(`Could not parse signature`)
  }

}

export function tryGetFactory(name: string) {
  const factory = (factoryByName as any)[name]

  if (factory != null)
    return new Ok(factory)
  return new Err(new Error(`Unknown type ${name}`))
}

export const factoryByName: {
  bool: typeof StaticBool,
  address: typeof StaticAddress,
  bytes: typeof DynamicBytes
  string: typeof DynamicString

  uint8: typeof Uint8,
  uint16: typeof Uint16,
  uint24: typeof Uint24,
  uint32: typeof Uint32,
  uint40: typeof Uint40,
  uint48: typeof Uint48,
  uint56: typeof Uint56,
  uint64: typeof Uint64,
  uint72: typeof Uint72,
  uint80: typeof Uint80,
  uint88: typeof Uint88,
  uint96: typeof Uint96,
  uint104: typeof Uint104,
  uint112: typeof Uint112,
  uint120: typeof Uint120,
  uint128: typeof Uint128,
  uint136: typeof Uint136,
  uint144: typeof Uint144,
  uint152: typeof Uint152,
  uint160: typeof Uint160,
  uint168: typeof Uint168,
  uint176: typeof Uint176,
  uint184: typeof Uint184,
  uint192: typeof Uint192,
  uint200: typeof Uint200,
  uint208: typeof Uint208,
  uint216: typeof Uint216,
  uint224: typeof Uint224,
  uint232: typeof Uint232,
  uint240: typeof Uint240,
  uint248: typeof Uint248,
  uint256: typeof Uint256,

  int8: typeof Int8,
  int16: typeof Int16,
  int24: typeof Int24,
  int32: typeof Int32,
  int40: typeof Int40,
  int48: typeof Int48,
  int56: typeof Int56,
  int64: typeof Int64,
  int72: typeof Int72,
  int80: typeof Int80,
  int88: typeof Int88,
  int96: typeof Int96,
  int104: typeof Int104,
  int112: typeof Int112,
  int120: typeof Int120,
  int128: typeof Int128,
  int136: typeof Int136,
  int144: typeof Int144,
  int152: typeof Int152,
  int160: typeof Int160,
  int168: typeof Int168,
  int176: typeof Int176,
  int184: typeof Int184,
  int192: typeof Int192,
  int200: typeof Int200,
  int208: typeof Int208,
  int216: typeof Int216,
  int224: typeof Int224,
  int232: typeof Int232,
  int240: typeof Int240,
  int248: typeof Int248,
  int256: typeof Int256,
} = {
  bool: StaticBool,
  address: StaticAddress,
  bytes: DynamicBytes,
  string: DynamicString,

  uint8: Uint8,
  uint16: Uint16,
  uint24: Uint24,
  uint32: Uint32,
  uint40: Uint40,
  uint48: Uint48,
  uint56: Uint56,
  uint64: Uint64,
  uint72: Uint72,
  uint80: Uint80,
  uint88: Uint88,
  uint96: Uint96,
  uint104: Uint104,
  uint112: Uint112,
  uint120: Uint120,
  uint128: Uint128,
  uint136: Uint136,
  uint144: Uint144,
  uint152: Uint152,
  uint160: Uint160,
  uint168: Uint168,
  uint176: Uint176,
  uint184: Uint184,
  uint192: Uint192,
  uint200: Uint200,
  uint208: Uint208,
  uint216: Uint216,
  uint224: Uint224,
  uint232: Uint232,
  uint240: Uint240,
  uint248: Uint248,
  uint256: Uint256,

  int8: Int8,
  int16: Int16,
  int24: Int24,
  int32: Int32,
  int40: Int40,
  int48: Int48,
  int56: Int56,
  int64: Int64,
  int72: Int72,
  int80: Int80,
  int88: Int88,
  int96: Int96,
  int104: Int104,
  int112: Int112,
  int120: Int120,
  int128: Int128,
  int136: Int136,
  int144: Int144,
  int152: Int152,
  int160: Int160,
  int168: Int168,
  int176: Int176,
  int184: Int184,
  int192: Int192,
  int200: Int200,
  int208: Int208,
  int216: Int216,
  int224: Int224,
  int232: Int232,
  int240: Int240,
  int248: Int248,
  int256: Int256,
} as const

export function tryParseSignature(signature: string): Result<[string, DynamicTupleFactory], Error> {
  return Result.unthrowSync(t => {
    const [name, ...tokens] = signature.trim().split(/(\s+|,|\(|\)|\[|\])/g)

    if (tokens.shift() !== "(")
      return new Err(new Error(`Expected parenthesis`))

    const args = tryParseArguments(tokens).throw(t)

    console.log(signature)
    console.log(args)

    return new Ok([name, args])
  })
}

export function tryParseArguments(tokens: string[]): Result<DynamicTupleFactory<Factory[]>, Error> {
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
        return new Ok(createDynamicTuple(...factories))
      else if (token === "[")
        return new Err(new Error(`Unexpected brackets`))
      else if (token === "]")
        return new Err(new Error(`Unexpected brackets`))
      else
        factories.push(doParseArrayOrVectorOrSingle(tokens, tryGetFactory(token).throw(t)))
    }

    return new Ok(createDynamicTuple(...factories))
  })
}

export function doParseArrayOrVectorOrSingle<T extends Factory>(tokens: string[], factory: T) {
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
