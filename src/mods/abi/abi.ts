import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Err, Ok, Result } from "@hazae41/result";
import { keccak_256 } from "@noble/hashes/sha3";
import { DecodingError } from "./errors/errors.js";
import { tryParseSignature } from "./parser/parser.js";
import { FunctionSelector, FunctionSelectorAndArguments, InvalidFunctionSelector, createFunctionSelectorAndArguments } from "./types/function/function.js";

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