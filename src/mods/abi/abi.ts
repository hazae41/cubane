import { Readable, Writable } from "@hazae41/binary";
import { Ok, Result } from "@hazae41/result";
import { Instanced, createTuple, } from "./tuple/tuple.js";

export interface Instance extends Writable<Error, Error> {
  readonly class: Factory<this>
  readonly dynamic?: boolean
}

/**
 * Shorthand for creating a new tuple and writing some bytes
 * @param instances 
 * @returns 
 */
export function tryEncode(...instances: Instance[]): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    const encoder = createTuple([] as any).tryNew(instances).throw(t)
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
export function tryDecode<T extends Factory[]>(bytes: Uint8Array, ...types: T): Result<Instanced<T>, Error> {
  return Readable.tryReadFromBytes(createTuple(types), bytes).mapSync(x => x.inner)
}

