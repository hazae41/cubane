import { Readable, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { ZeroHexString } from "mods/types/zerohex/index.js";

export interface Instance<P> extends Writable {
  readonly dynamic?: boolean

  readonly size: number

  intoOrThrow(): P

  encodeOrThrow(): string
  encodePackedOrThrow(): string
  sizeOrThrow(): number
  writeOrThrow(cursor: Cursor): void
}

export interface Factory<P, I extends Instance<P>> extends Readable<I> {
  readonly dynamic?: boolean

  from(primitive: P): I

  codegen(): string

  decodeOrThrow(cursor: TextCursor): I
  readOrThrow(cursor: Cursor): I
}

export namespace Factory {

  export type Primitive<T> = T extends Factory<infer P, any> ? P : never

  export type Primitives<T extends readonly Factory<any, any>[]> = {
    readonly [Index in keyof T]: Primitive<T[Index]>
  }

  export type Instance<T> = T extends Factory<any, infer T> ? T : never

  export type Instances<T extends readonly Factory<any, any>[]> = {
    readonly [Index in keyof T]: Instance<T[Index]>
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
  return Result.runAndDoubleWrapSync(() => {
    const cursor = new TextCursor(hex.slice(2))
    const decoded = decodable.decodeOrThrow(cursor)

    if (cursor.remaining >= 64)
      throw new Error(`Underflow`)

    return decoded
  })
}