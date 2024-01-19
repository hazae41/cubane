import { Readable, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";

export interface AbiInstance<I = unknown, J = unknown> extends Writable {
  readonly dynamic: boolean

  intoOrThrow(): I

  encodeOrThrow(): string
  encodePackedOrThrow(): string

  sizeOrThrow(): number
  writeOrThrow(cursor: Cursor): void

  toJSON(): J
}

export interface AbiFactory<F = unknown, S extends AbiInstance<any, any> = AbiInstance<any, any>> extends Readable<S> {
  readonly dynamic: boolean

  from(primitive: F): S

  decodeOrThrow(cursor: TextCursor): S

  readOrThrow(cursor: Cursor): S

  codegen(): string
}

export namespace AbiFactory {

  export type From<T> = T extends AbiFactory<infer F, any> ? F : never

  export type Froms<T extends readonly AbiFactory[]> = {
    readonly [Index in keyof T]: From<T[Index]>
  }

  export type Instance<T> = T extends AbiFactory<any, infer I> ? I : never

  export type Instances<T extends readonly AbiFactory[]> = {
    readonly [Index in keyof T]: Instance<T[Index]>
  }

  export type Into<T> = AbiInstance.Into<Instance<T>>

  export type Intos<T extends readonly AbiFactory[]> = {
    readonly [Index in keyof T]: Into<T[Index]>
  }

  export type Json<T> = AbiInstance.Json<Instance<T>>

  export type Jsons<T extends readonly AbiFactory[]> = {
    readonly [Index in keyof T]: Json<T[Index]>
  }

}

export namespace AbiInstance {

  export type Into<T> = T extends AbiInstance<infer I, any> ? I : never

  export type Json<T> = T extends AbiInstance<any, infer J> ? J : never

}