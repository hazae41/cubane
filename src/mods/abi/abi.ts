import { Readable, Writable } from "@hazae41/binary";
import { Ok, Result } from "@hazae41/result";
import { Address } from "./address/address.js";
import { Bool } from "./bool/bool.js";
import { DynamicBytes } from "./bytes/bytes.js";
import { FunctionSelector, createFunctionSelectorAndArguments } from "./function/function.js";
import { Instanced } from "./tuple/tuple.js";

export interface Instance extends Writable<never, Error> {
  readonly class: Factory<this>
  readonly dynamic?: boolean
}

/**
 * Shorthand for creating a new tuple and writing some bytes
 * @param instances 
 * @returns 
 */
export function tryEncode(fun: FunctionSelector, ...instances: Instance[]): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    const encoder = createFunctionSelectorAndArguments(...[] as any).new(fun, ...instances)
    const bytes = Writable.tryWriteToBytes(encoder).throw(t)

    return new Ok(bytes)
  })
}

export interface Factory<Output extends Instance = Instance> extends Readable<Output, Error> {
  readonly dynamic?: boolean
}

/**
 * Shorthand for creating a new tuple and reading some bytes
 * @param bytes 
 * @param types 
 * @returns 
 */
export function tryDecode<T extends readonly Factory[]>(bytes: Uint8Array, ...types: T): Result<Instanced<T>, Error> {
  return Readable.tryReadFromBytes(createFunctionSelectorAndArguments(...types), bytes).mapSync(x => x.args.inner)
}

export const factoryByName = {
  "bool": Bool,
  "address": Address,
  "bytes": DynamicBytes,
  "string": String
} as const

export function resolve() {

}