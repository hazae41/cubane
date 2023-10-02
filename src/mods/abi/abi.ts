import { Readable, Writable } from "@hazae41/binary";
import { Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { ZeroHexString } from "mods/types/hex.js";

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

export interface Encodable {
  encodeOrThrow(): string
}

export function tryEncode(encodable: Encodable): Result<ZeroHexString, Error> {
  return Result.runAndDoubleWrapSync(() => ZeroHexString.from(encodable.encodeOrThrow()))
}

export interface Decodable<T> {
  decodeOrThrow(text: TextCursor): T
}

export function tryDecode<T>(decodable: Decodable<T>, hex: ZeroHexString): Result<T, Error> {
  return Result.runAndDoubleWrapSync(() => decodable.decodeOrThrow(new TextCursor(hex.slice(2))))
}