import { Readable, Writable } from "@hazae41/binary";
import { Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { ZeroHexString } from "mods/types/hex.js";
import { FunctionSignature } from "./signature/signature.js";
import { FunctionSelectorAndArgumentsInstance } from "./types/function/function.js";

export type MaybeDynamic<T> = T & { readonly dynamic?: boolean }

export type Instance = MaybeDynamic<Writable<never, Error>> & {
  readonly size: number

  encodeOrThrow(): string
  encodePackedOrThrow(): string
}

export type Factory<T extends Instance = Instance, P = unknown> = MaybeDynamic<Readable<T, Error>> & {
  from(primitive: P): Instance

  codegen(): string

  decodeOrThrow(cursor: TextCursor): Instance
}

export namespace Factory {

  export type Primitive<T> = T extends Factory<any, infer P> ? P : never

  export type Primitives<T extends readonly Factory[]> = {
    readonly [Index in keyof T]: Primitive<T[Index]>
  }

}

/**
 * Shorthand for writing to 0x-prefix hex string
 * @param signature 
 * @param values 
 * @returns 
 */
export function tryEncode<T extends readonly Factory[]>(signature: FunctionSignature<T>, ...values: Factory.Primitives<T>): Result<ZeroHexString, Error> {
  // p42:ignore-next-statement
  return Result.runAndDoubleWrapSync(() => "0x" + signature.inner.from(values).encodeOrThrow() as ZeroHexString)
}

/**
 * Shorthand for reading from 0x-prefix hex string
 * @param signature 
 * @param hex 
 * @returns 
 */
export function tryDecode<T extends readonly Factory[]>(signature: FunctionSignature<T>, hex: ZeroHexString): Result<FunctionSelectorAndArgumentsInstance<T>, Error> {
  return Result.runAndDoubleWrapSync(() => signature.inner.decodeOrThrow(new TextCursor(hex.slice(2))))
}

/**
 * Shorthand for writing some bytes
 * @param values 
 * @returns 
 */
export function tryWriteToBytes<T extends readonly Factory[]>(signature: FunctionSignature<T>, ...values: Factory.Primitives<T>): Result<Uint8Array, Error> {
  return Writable.tryWriteToBytes(signature.inner.from(values))
}

/**
 * Shorthand for reading some bytes
 * @param bytes 
 * @param types 
 * @returns 
 */
export function tryReadFromBytes<T extends readonly Factory[]>(signature: FunctionSignature<T>, bytes: Uint8Array): Result<FunctionSelectorAndArgumentsInstance<T>, Error> {
  return Readable.tryReadFromBytes(signature.inner, bytes)
}