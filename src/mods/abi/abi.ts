import { Readable, Writable } from "@hazae41/binary";
import { TextCursor } from "libs/cursor/cursor.js";

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