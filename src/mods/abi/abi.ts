import { Readable, Writable } from "@hazae41/binary";
import { Ok, Result } from "@hazae41/result";
import { ReadableTuple, WritableTuple } from "./tuple/tuple.js";

export interface Instance extends Writable<Error, Error> {
  dynamic?: boolean
}

/**
 * Shorthand for creating a new writable and writing some bytes
 * @param instances 
 * @returns 
 */
export function tryEncode(...instances: Instance[]): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    const encoder = WritableTuple.tryNew(instances).throw(t)
    const bytes = Writable.tryWriteToBytes(encoder).throw(t)

    return new Ok(bytes)
  })
}

export interface Factory extends Readable<Instance, Error> {
  dynamic?: boolean
}

/**
 * Shorthand for creating a new readable and reading some bytes
 * @param bytes 
 * @param types 
 * @returns 
 */
export function tryDecode(bytes: Uint8Array, ...types: Factory[]): Result<Instance[], Error> {
  return Result.unthrowSync(t => {
    const decoder = ReadableTuple.tryNew(types).throw(t)
    const instances = Readable.tryReadFromBytes(decoder, bytes).throw(t)

    return new Ok(instances)
  })
}