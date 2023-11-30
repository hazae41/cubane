import { Readable, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { ZeroHexString } from "mods/types/zerohex/index.js";

export interface Instance<I = unknown, J = unknown> extends Writable {
  readonly dynamic: boolean

  intoOrThrow(): I

  encodeOrThrow(): string
  encodePackedOrThrow(): string

  sizeOrThrow(): number
  writeOrThrow(cursor: Cursor): void

  toJSON(): J
}

export interface Factory<F = unknown, S extends Instance<any, any> = Instance<any, any>> extends Readable<S> {
  readonly dynamic: boolean

  from(primitive: F): S

  decodeOrThrow(cursor: TextCursor): S

  readOrThrow(cursor: Cursor): S

  codegen(): string
}

export namespace Factory {

  export type From<T> = T extends Factory<infer F, any> ? F : never

  export type Froms<T extends readonly Factory[]> = {
    readonly [Index in keyof T]: From<T[Index]>
  }

  export type Instance<T> = T extends Factory<any, infer I> ? I : never

  export type Instances<T extends readonly Factory[]> = {
    readonly [Index in keyof T]: Instance<T[Index]>
  }

  export type Into<T> = Instance.Into<Instance<T>>

  export type Intos<T extends readonly Factory[]> = {
    readonly [Index in keyof T]: Into<T[Index]>
  }

  export type Json<T> = Instance.Json<Instance<T>>

  export type Jsons<T extends readonly Factory[]> = {
    readonly [Index in keyof T]: Json<T[Index]>
  }

}

export namespace Instance {

  export type Into<T> = T extends Instance<infer I, any> ? I : never

  export type Json<T> = T extends Instance<any, infer J> ? J : never

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
  return Result.runAndDoubleWrapSync(() => {
    const cursor = new TextCursor(hex.slice(2))
    const decoded = decodable.decodeOrThrow(cursor)

    if (cursor.remaining >= 64)
      throw new Error(`Underflow`)

    return decoded
  })
}