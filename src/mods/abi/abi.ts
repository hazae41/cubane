import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Err, Ok, Result } from "@hazae41/result";
import { keccak_256 } from "@noble/hashes/sha3";
import { TextCursor } from "libs/cursor/cursor.js";
import { ZeroHexString } from "mods/types/hex.js";
import { tryParseSignature } from "./parser/parser.js";
import { FunctionSelector, FunctionSelectorAndArgumentsInstance, InvalidFunctionSelector, createFunctionSelectorAndArguments } from "./types/function/function.js";

export type MaybeDynamic<T> = T & { readonly dynamic?: boolean }

export type Instance = MaybeDynamic<Writable<never, Error>> & {
  readonly size: number

  encode(): string
  encodePacked(): string
}

export type Factory<T extends Instance = Instance, P = unknown> = MaybeDynamic<Readable<T, Error>> & {
  from(primitive: P): Instance

  decode(cursor: TextCursor): Instance
}

export namespace Factory {

  export type Primitive<T> = T extends Factory<any, infer P> ? P : never

  export type Primitives<T extends readonly Factory[]> = {
    [Index in keyof T]: Primitive<T[Index]>
  }

}

/**
 * Shorthand for writing to 0x-prefix hex string
 * @param signature 
 * @param values 
 * @returns 
 */
export function tryEncode(signature: string, ...values: unknown[]): Result<ZeroHexString, Error> {
  return Result.unthrowSync(t => {
    const [name, args] = tryParseSignature(signature).throw(t)

    const selector = FunctionSelector.new(keccak_256(signature).slice(0, 4) as Bytes<4>)
    const encoder = createFunctionSelectorAndArguments(args).from([selector, values])

    // p42:ignore-next-statement
    return new Ok("0x" + encoder.encode() as ZeroHexString)
  })
}

/**
 * Shorthand for reading from 0x-prefix hex string
 * @param signature 
 * @param hex 
 * @returns 
 */
export function tryDecode(signature: string, hex: ZeroHexString): Result<FunctionSelectorAndArgumentsInstance, Error> {
  return Result.unthrowSync(t => {
    const [name, args] = tryParseSignature(signature).throw(t)

    const selector = FunctionSelector.new(keccak_256(signature).slice(0, 4) as Bytes<4>)
    const decoded = createFunctionSelectorAndArguments(args).decode(new TextCursor(hex.slice(2)))

    if (!Bytes.equals(selector.value, decoded.func.value))
      return new Err(new InvalidFunctionSelector())

    return new Ok(decoded)
  })
}

/**
 * Shorthand for writing some bytes
 * @param values 
 * @returns 
 */
export function tryWriteToBytes(signature: string, ...values: unknown[]): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    const [name, args] = tryParseSignature(signature).throw(t)

    const selector = FunctionSelector.new(keccak_256(signature).slice(0, 4) as Bytes<4>)

    const encoder = createFunctionSelectorAndArguments(args).from([selector, values])
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
export function tryReadFromBytes(signature: string, bytes: Uint8Array): Result<FunctionSelectorAndArgumentsInstance, Error> {
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