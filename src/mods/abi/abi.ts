import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Err, Ok, Result } from "@hazae41/result";
import { keccak_256 } from "@noble/hashes/sha3";
import { TextCursor } from "libs/cursor/cursor.js";
import { tryParseSignature } from "./parser/parser.js";
import { FunctionSelector, FunctionSelectorAndArgumentsInstance, InvalidFunctionSelector, createFunctionSelectorAndArguments } from "./types/function/function.js";

export type MaybeDynamic<T> = T & { readonly dynamic?: boolean }

export type Instance = MaybeDynamic<Writable<never, Error>> & {
  readonly size: number

  encode(): string
  encodePacked(): string
}

export type Factory<T extends Instance = Instance> = MaybeDynamic<Readable<T, Error>> & {
  decode(cursor: TextCursor): Instance
}

/**
 * Shorthand for writing some bytes
 * @param instances 
 * @returns 
 */
export function tryEncode(signature: string, ...instances: Instance[]): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    const [name, args] = tryParseSignature(signature).throw(t)

    const selector = FunctionSelector.new(keccak_256(signature).slice(0, 4) as Bytes<4>)

    const encoder = createFunctionSelectorAndArguments(args).new(selector, ...instances)
    const bytes = Writable.tryWriteToBytes(encoder).throw(t)

    return new Ok(bytes)
  })
}

/**
 * Shorthand for reading some bytes
 * @param bytes 
 * @param types 
 * @returns 
 */
export function tryDecode(signature: string, bytes: Uint8Array): Result<FunctionSelectorAndArgumentsInstance, Error> {
  return Result.unthrowSync(t => {
    const [name, args] = tryParseSignature(signature).throw(t)

    const selector = FunctionSelector.new(keccak_256(signature).slice(0, 4) as Bytes<4>)

    const decoder = createFunctionSelectorAndArguments(args)
    const decoded = Readable.tryReadFromBytes(decoder, bytes).throw(t)

    if (!Bytes.equals(selector.value, decoded.func.value))
      return new Err(new InvalidFunctionSelector())

    return new Ok(decoded)
  })
}