import { Readable, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";

export interface AbiInstance<I = any, J = any> extends Writable {
  readonly dynamic: boolean

  intoOrThrow(): I

  encodeOrThrow(): string
  encodePackedOrThrow(): string

  sizeOrThrow(): number
  writeOrThrow(cursor: Cursor): void

  toJSON(): J
}

export interface AbiFactory<C = any, F = any, S extends AbiInstance<any, any> = any> extends Readable<S> {
  readonly dynamic: boolean

  create(create: C): S

  fromOrThrow(from: F): S

  decodeOrThrow(cursor: TextCursor): S

  readOrThrow(cursor: Cursor): S

  codegen(): string
}

export namespace AbiFactory {

  export type Create<T> = T extends AbiFactory<infer C, any, any> ? C : never

  export type Creates<T extends readonly AbiFactory[]> = {
    readonly [I in keyof T]: Create<T[I]>
  }

  export type From<T> = T extends AbiFactory<any, infer F, any> ? F : never

  export type Froms<T extends readonly AbiFactory[]> = {
    readonly [I in keyof T]: From<T[I]>
  }

  export type Instance<T> = T extends AbiFactory<any, any, infer I> ? I : never

  export type Instances<T extends readonly AbiFactory[]> = {
    readonly [I in keyof T]: Instance<T[I]>
  }

  export type Into<T> = AbiInstance.Into<Instance<T>>

  export type Intos<T extends readonly AbiFactory[]> = {
    readonly [I in keyof T]: Into<T[I]>
  }

  export type Json<T> = AbiInstance.Json<Instance<T>>

  export type Jsons<T extends readonly AbiFactory[]> = {
    readonly [I in keyof T]: Json<T[I]>
  }

}

export namespace AbiInstance {

  export type Into<T> = T extends AbiInstance<infer I, infer _> ? I : never

  export type Json<T> = T extends AbiInstance<infer _, infer J> ? J : never

}