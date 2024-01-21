import { Cursor } from "@hazae41/cursor"
import { TextCursor } from "libs/cursor/cursor.js"
import { AbiAddress, AbiBool, AbiFactory, AbiFunction, AbiUint256, AbiUint8, Named } from "../index.js"

export type StateMutability =
  | "pure"
  | "view"
  | "nonpayable"
  | "payable"

export interface ParameterDescriptor<N extends string, T extends string, C extends readonly ParameterDescriptor<any, any, any>[]> {
  readonly name: N
  readonly type: T
  readonly components?: C
}

export interface FunctionDescriptor<N extends string, I extends readonly ParameterDescriptor<any, any, any>[], O extends readonly ParameterDescriptor<any, any, any>[]> {
  readonly type: "function"
  readonly name: N
  readonly inputs: I
  readonly outputs: O
  readonly stateMutability: StateMutability
}

export interface EventParameterDescriptor<N extends string, T extends string, C extends readonly ParameterDescriptor<any, any, any>[]> {
  readonly name: N
  readonly type: T
  readonly components?: C
  readonly indexed: boolean
}

export interface EventDescriptor<N extends string, I extends readonly ParameterDescriptor<any, any, any>[]> {
  readonly type: "event"
  readonly name: N
  readonly inputs: I
  readonly anonymous: boolean
}

export interface ConstructorDescriptor<I extends readonly ParameterDescriptor<any, any, any>[]> {
  readonly type: "constructor"
  readonly inputs: I
  readonly stateMutability: StateMutability
}

export interface ReceiveDescriptor {
  readonly type: "receive"
  readonly stateMutability: StateMutability
}

export interface FallbackDescriptor {
  readonly type: "fallback"
  readonly stateMutability: StateMutability
}

export interface ErrorDescriptor<N extends string, I extends readonly ParameterDescriptor<any, any, any>[]> {
  readonly type: "error"
  readonly name: N
  readonly inputs: I
}

export namespace ParameterDescriptor {

  export type Parsed<T> =
    T extends ParameterDescriptor<infer N, "address", []> ? Named<N, typeof AbiAddress> :
    T extends ParameterDescriptor<infer N, "bool", []> ? Named<N, typeof AbiBool> :
    T extends ParameterDescriptor<infer N, "uint8", []> ? Named<N, typeof AbiUint8> :
    T extends ParameterDescriptor<infer N, "uint256", []> ? Named<N, typeof AbiUint256> :
    never

  export type Parseds<T extends readonly unknown[]> = {
    [I in keyof T]: Parsed<T[I]>
  }

}

export type Parsed<T> =
  T extends FunctionDescriptor<infer N, infer I, infer O> ? AbiFunction<N, ParameterDescriptor.Parseds<I>, ParameterDescriptor.Parseds<O>> :
  never

export type Parseds<T extends readonly unknown[]> = {
  [I in keyof T]: Parsed<T[I]>
}

export type Nameds<T extends readonly unknown[]> = {
  [I in keyof T]: Parsed<T[I]>
}

export namespace JsonAbi {

  export function $parse$(abi: any[]) {

  }

}

type lol = Parsed<FunctionDescriptor<"f", [{ name: "a", type: "uint256", components?: [] }], []>>

function f(x: lol) {
  x.args.from([123])
}

export class AbiNamed {

  private constructor() { }

  static create<N extends string, T extends AbiFactory>($name: N, $type: T) {
    return class AbiNamed {

      static readonly name = $name
      static readonly type = $type

      constructor(
        readonly name: N,
        readonly type: AbiFactory.Instance<T>
      ) { }

      static get dynamic() {
        return this.type.dynamic
      }

      static from(value: AbiFactory.From<T>) {
        return new AbiNamed(this.name, this.type.from(value))
      }

      encodeOrThrow() {
        return this.type.encodeOrThrow()
      }

      static codegen() {
        return this.type.codegen()
      }

      static decodeOrThrow(cursor: TextCursor) {
        return new AbiNamed(this.name, this.type.decodeOrThrow(cursor))
      }

      static readOrThrow(cursor: Cursor) {
        return new AbiNamed(this.name, this.type.readOrThrow(cursor))
      }

    }
  }
}

export namespace AbiNamed {

  export type Factory<N extends string, T extends AbiFactory> =
    ReturnType<typeof AbiNamed.create<N, T>>

  export type Instance<N extends string, T extends AbiFactory> =
    AbiFactory.Instance<Factory<N, T>>

}