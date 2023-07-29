import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Err, Ok, Result } from "@hazae41/result";
import { keccak_256 } from "@noble/hashes/sha3";
import { DecodingError } from "./errors/errors.js";
import { Address } from "./types/address/address.js";
import { Bool } from "./types/bool/bool.js";
import { DynamicBytes } from "./types/bytes/bytes.js";
import { FunctionSelector, FunctionSelectorAndArguments, InvalidFunctionSelector, createFunctionSelectorAndArguments } from "./types/function/function.js";
import { Int104, Int112, Int120, Int128, Int136, Int144, Int152, Int16, Int160, Int168, Int176, Int184, Int192, Int200, Int208, Int216, Int224, Int232, Int24, Int240, Int248, Int256, Int32, Int40, Int48, Int56, Int64, Int72, Int8, Int80, Int88, Int96 } from "./types/int/int.js";
import { DynamicString } from "./types/string/string.js";
import { Uint104, Uint112, Uint120, Uint128, Uint136, Uint144, Uint152, Uint16, Uint160, Uint168, Uint176, Uint184, Uint192, Uint200, Uint208, Uint216, Uint224, Uint232, Uint24, Uint240, Uint248, Uint256, Uint32, Uint40, Uint48, Uint56, Uint64, Uint72, Uint8, Uint80, Uint88, Uint96 } from "./types/uint/uint.js";

export interface Instance extends Writable<never, Error> {
  readonly class: Factory<this>
  readonly dynamic?: boolean
}

/**
 * Shorthand for writing some bytes
 * @param instances 
 * @returns 
 */
export function tryEncode(signature: string, ...instances: Instance[]): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    const selector = FunctionSelector.new(keccak_256(signature).slice(0, 4) as Bytes<4>)
    const encoder = createFunctionSelectorAndArguments(...[] as any).new(selector, ...instances)
    const bytes = Writable.tryWriteToBytes(encoder).throw(t)

    return new Ok(bytes)
  })
}

export interface Factory<Output extends Instance = Instance> extends Readable<Output, DecodingError> {
  readonly dynamic?: boolean
}

/**
 * Shorthand for reading some bytes
 * @param bytes 
 * @param types 
 * @returns 
 */
export function tryDecode<T extends readonly Factory[]>(signature: string, bytes: Uint8Array): Result<FunctionSelectorAndArguments<T>, Error> {
  return Result.unthrowSync(t => {
    const factories = tryParseSignature(signature).throw(t)
    const selector = FunctionSelector.new(keccak_256(signature).slice(0, 4) as Bytes<4>)
    const decoder = createFunctionSelectorAndArguments(...factories)
    const decoded = Readable.tryReadFromBytes(decoder, bytes).throw(t)

    if (!Bytes.equals(selector.value, decoded.func.value))
      return new Err(new InvalidFunctionSelector())

    return new Ok(decoded as FunctionSelectorAndArguments<T>)
  })
}

export const factoryByName: {
  bool: typeof Bool,
  address: typeof Address,
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
  bool: Bool,
  address: Address,
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

interface Ref<T> {
  current: T
}

export function tryParseSignature(signature: string) {
  const index = { current: 0 }

  while (index.current < signature.length) {
    const char = signature[index.current]
    console.log("outer", char)

    if (char === "(") {
      index.current++
      break
    }

    index.current++
  }

  return tryParseNames(signature, index)
}

function tryParseNames(signature: string, index: Ref<number>): Result<Factory[], Error> {
  return Result.unthrowSync(t => {
    const factories = new Array<Factory>()

    while (index.current < signature.length) {
      const char = signature[index.current]
      console.log("names", char)

      if (char === ")")
        return new Ok(factories)

      if (char === ",") {
        index.current++
        continue
      }

      factories.push(tryParseName(signature, index).throw(t))
    }

    return new Err(new Error("Could not parse names"))
  })
}

function tryParseName(signature: string, index: Ref<number>): Result<Factory, Error> {
  let name = ""

  while (index.current < signature.length) {
    const char = signature[index.current]
    console.log("name", char)

    if (char === ")" || char === ",")
      return new Ok((factoryByName as Record<string, Factory>)[name])
    if (char === ",")
      return new Ok((factoryByName as Record<string, Factory>)[name])

    name += char
    index.current++
  }

  return new Err(new Error("Could not parse name"))
}