import { Cursor } from "@hazae41/cursor"
import { TextCursor } from "libs/cursor/cursor.js"
import { AbiAddress, AbiBool, AbiFactory, AbiFunction, AbiString, AbiTuple, AbiUint256, AbiUint8 } from "../index.js"

export { AbiStruct as Struct }

export const erc20 = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_spender",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_from",
        "type": "address"
      },
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      },
      {
        "name": "_spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  }
] as const

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
    T extends ParameterDescriptor<infer N, "address", []> ? AbiNamed.Factory<N, typeof AbiAddress> :
    T extends ParameterDescriptor<infer N, "bool", []> ? AbiNamed.Factory<N, typeof AbiBool> :
    T extends ParameterDescriptor<infer N, "uint8", []> ? AbiNamed.Factory<N, typeof AbiUint8> :
    T extends ParameterDescriptor<infer N, "uint256", []> ? AbiNamed.Factory<N, typeof AbiUint256> :
    T extends ParameterDescriptor<infer N, "string", []> ? AbiNamed.Factory<N, typeof AbiString> :
    never

  export type Parseds<T extends readonly unknown[]> = {
    [I in keyof T]: Parsed<T[I]>
  }

}

export type Parsed<T> =
  T extends FunctionDescriptor<infer N, infer I, infer O> ? AbiFunction<N, AbiStruct.Factory<ParameterDescriptor.Parseds<I>>, AbiStruct.Factory<ParameterDescriptor.Parseds<O>>> :
  never

export type Parseds<T extends readonly unknown[]> = {
  [I in Exclude<keyof T, keyof []> as Named<T[I]>]: Parsed<T[I]>
}

export type Named<T> =
  T extends FunctionDescriptor<infer N, infer _, infer _> ? N :
  never

export namespace JsonAbi {

  export function $parse$(abi: any[]) {

  }

}

type AbiErc20 = typeof erc20

function f(erc20: Parseds<AbiErc20>) {
  erc20.transfer.args.from({ _to: "0x0", _value: 0n })
}



export class AbiNamed {

  private constructor() { }

  static create<N extends string, T extends AbiFactory>($name: N, $type: T) {
    return class AbiNamed {
      readonly #class = AbiNamed

      static readonly name = $name
      static readonly type = $type
      static readonly dynamic = $type.dynamic

      readonly dynamic = this.#class.dynamic

      constructor(
        readonly name: N,
        readonly type: AbiFactory.Instance<T>
      ) { }

      static from(value: AbiFactory.From<T>) {
        return new AbiNamed(this.name, this.type.from(value))
      }

      sizeOrThrow() {
        return this.type.sizeOrThrow()
      }

      writeOrThrow(cursor: Cursor) {
        return this.type.writeOrThrow(cursor)
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

  export namespace Factory {

    export type Name<T> = T extends AbiNamed.Factory<infer N, AbiFactory> ? N : never

  }

  export namespace Instance {

    export type Name<T> = T extends AbiNamed.Instance<infer N, AbiFactory> ? N : never

  }

}

export class AbiStruct {

  private constructor() { }

  static create<T extends readonly AbiNamed.Factory<string, AbiFactory>[]>(...$types: T) {
    return class AbiStruct {
      readonly #class = AbiStruct

      static readonly type = AbiTuple.create(...$types)

      static readonly types = $types
      static readonly dynamic = $types.some(it => it.dynamic)

      readonly types = this.#class.types
      readonly dynamic = this.#class.dynamic

      constructor(
        readonly type: AbiTuple.Instance<T>
      ) { }

      static from(value: AbiStruct.From<T> | AbiFactory.Froms<T>) {
        if (Array.isArray(value))
          return new AbiStruct(this.type.from(value as any))

        const values = []

        for (const type of this.types)
          values.push((value as any)[type.name])

        return new AbiStruct(this.type.from(values as any))
      }

      sizeOrThrow() {
        return this.type.sizeOrThrow()
      }

      writeOrThrow(cursor: Cursor) {
        return this.type.writeOrThrow(cursor)
      }

      encodeOrThrow() {
        return this.type.encodeOrThrow()
      }

      static codegen() {
        return this.type.codegen()
      }

      static decodeOrThrow(cursor: TextCursor) {
        return new AbiStruct(this.type.decodeOrThrow(cursor))
      }

      static readOrThrow(cursor: Cursor) {
        return new AbiStruct(this.type.readOrThrow(cursor))
      }

    }
  }

}

export namespace AbiStruct {

  export type From<T extends readonly AbiNamed.Factory<string, AbiFactory>[]> = {
    [I in Exclude<keyof T, keyof []> as AbiNamed.Factory.Name<T[I]>]: AbiFactory.From<T[I]>
  }

  export type Factory<T extends readonly AbiNamed.Factory<string, AbiFactory>[]> =
    ReturnType<typeof AbiStruct.create< T>>

  export type Instance<T extends readonly AbiNamed.Factory<string, AbiFactory>[]> =
    AbiFactory.Instance<Factory<T>>

}

