import { Cursor } from "@hazae41/cursor"
import { TextCursor } from "libs/cursor/cursor.js"
import { AbiAddress, AbiArray, AbiBool, AbiBytes, AbiBytes32, AbiFactory, AbiFunction, AbiInt16, AbiInt24, AbiInt256, AbiInt32, AbiInt8, AbiString, AbiTuple, AbiUint16, AbiUint24, AbiUint256, AbiUint32, AbiUint8, AbiVector } from "../index.js"

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
        "type": "uint256[3]"
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

export const nestedTupleArrayAbi = [
  {
    inputs: [
      {
        name: 's',
        type: 'tuple',
        components: [
          {
            name: 'a',
            type: 'uint8',
          },
          {
            name: 'b',
            type: 'uint8[]',
          },
          {
            name: 'c',
            type: 'tuple[]',
            components: [
              {
                name: 'x',
                type: 'uint8',
              },
              {
                name: 'y',
                type: 'uint8',
              },
            ],
          },
        ],
      },
      {
        name: 't',
        type: 'tuple',
        components: [
          {
            name: 'x',
            type: 'uint',
          },
          {
            name: 'y',
            type: 'uint',
          },
        ],
      },
      {
        name: 'a',
        type: 'uint256',
      },
    ],
    name: 'f',
    outputs: [
      {
        name: 't',
        type: 'tuple[]',
        components: [
          {
            name: 'x',
            type: 'uint256',
          },
          {
            name: 'y',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        name: 's',
        type: 'tuple[2]',
        components: [
          {
            name: 'a',
            type: 'uint8',
          },
          {
            name: 'b',
            type: 'uint8[]',
          },
        ],
      },
      {
        name: 't',
        type: 'tuple',
        components: [
          {
            name: 'x',
            type: 'uint',
          },
          {
            name: 'y',
            type: 'uint',
          },
        ],
      },
      {
        name: 'a',
        type: 'uint256',
      },
    ],
    name: 'v',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
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

  export type Subparsed<T extends string, C extends readonly ParameterDescriptor<any, any, any>[]> =
    T extends "address" ? typeof AbiAddress :
    T extends "bool" ? typeof AbiBool :
    T extends "bytes" ? typeof AbiBytes :
    T extends "bytes32" ? typeof AbiBytes32 :
    T extends "int" ? typeof AbiInt256 :
    T extends "int8" ? typeof AbiInt8 :
    T extends "int16" ? typeof AbiInt16 :
    T extends "int24" ? typeof AbiInt24 :
    T extends "int32" ? typeof AbiInt32 :
    T extends "int256" ? typeof AbiInt256 :
    T extends "string" ? typeof AbiString :
    T extends "uint" ? typeof AbiUint256 :
    T extends "uint8" ? typeof AbiUint8 :
    T extends "uint16" ? typeof AbiUint16 :
    T extends "uint24" ? typeof AbiUint24 :
    T extends "uint32" ? typeof AbiUint32 :
    T extends "uint256" ? typeof AbiUint256 :
    T extends `${infer X}[]` ? AbiVector.Factory<Subparsed<X, C>> :
    T extends `${infer X}[${infer Y extends number}]` ? AbiArray.Factory<Subparsed<X, C>, Y> :
    T extends "tuple" ? AbiStruct.Factory<Parseds<C>> :
    never

  export type Parsed<T> =
    T extends ParameterDescriptor<infer N, infer T, infer C> ? AbiNamed.Factory<N, Subparsed<T, C>> :
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


function f(abi: Parseds<typeof erc20>) {
  abi.transfer.args.from({ _to: "0x0", _value: [0n, 0n, 0n] })
}

function g(abi: Parseds<typeof nestedTupleArrayAbi>) {
  abi.f.args.from({ s: { a: 0, b: [0], c: [{ x: 0, y: 0 }] }, a: 0, t: { x: 0n, y: 0n } })
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

      static create(value: AbiFactory.Instance<T>) {
        return new AbiNamed(this.name, this.type.create(value))
      }

      static from(value: AbiFactory.From<T>) {
        return new AbiNamed(this.name, this.type.from(value))
      }

      intoOrThrow() {
        return this.type.intoOrThrow()
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

      encodePackedOrThrow() {
        return this.type.encodePackedOrThrow()
      }

      toJSON() {
        return this.type.toJSON()
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

      static create(value: AbiStruct.Create<T> | AbiTuple.Create<T>) {
        if (Array.isArray(value))
          return new AbiStruct(this.type.create(value as any))

        const values = []

        for (const type of this.types)
          values.push((value as any)[type.name])

        return new AbiStruct(this.type.create(values as any))
      }

      static from(value: AbiStruct.From<T> | AbiTuple.From<T>) {
        if (Array.isArray(value))
          return new AbiStruct(this.type.from(value as any))

        const values = []

        for (const type of this.types)
          values.push((value as any)[type.name])

        return new AbiStruct(this.type.from(values as any))
      }

      intoOrThrow() {
        return this.type.intoOrThrow()
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

      encodePackedOrThrow() {
        return this.type.encodePackedOrThrow()
      }

      toJSON() {
        return this.type.toJSON()
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

  export type Create<T extends readonly AbiNamed.Factory<string, AbiFactory>[]> = {
    readonly [I in Exclude<keyof T, keyof []> as AbiNamed.Factory.Name<T[I]>]: AbiFactory.Create<T[I]>
  }

  export type From<T extends readonly AbiNamed.Factory<string, AbiFactory>[]> = {
    readonly [I in Exclude<keyof T, keyof []> as AbiNamed.Factory.Name<T[I]>]: AbiFactory.From<T[I]>
  }

  export type Factory<T extends readonly AbiNamed.Factory<string, AbiFactory>[]> =
    ReturnType<typeof AbiStruct.create< T>>

  export type Instance<T extends readonly AbiNamed.Factory<string, AbiFactory>[]> =
    AbiFactory.Instance<Factory<T>>

}
