import { Base16 } from "@hazae41/base16"
import { Bytes } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { Keccak256 } from "@hazae41/keccak256"
import { Copiable } from "libs/copiable/index.js"
import { Nullable } from "libs/nullable/index.js"
import { Records } from "libs/records/records.js"
import { AbiFactory } from "../types.js"
import { AbiAddress } from "../types/address/address.js"
import { AbiBool } from "../types/bool/bool.js"
import { AbiBytes32, bytesByName } from "../types/bytes/index.js"
import { AbiInt256, intByName } from "../types/int/int.js"
import { AbiString } from "../types/string/string.js"
import { AbiUint256, uintByName } from "../types/uint/uint.js"

export interface TypedData {
  readonly types: TypedDataTypes
  readonly primaryType: string
  readonly domain: EIP712Domain
  readonly message: TypedDataStruct
}

export interface TypedDataTypes {
  readonly [x: string]: Nullable<TypedDataType>
}

export type TypedDataType =
  readonly TypedDataVariable[]

export interface TypedDataVariable {
  readonly name: string
  readonly type: string
}

export interface TypedDataStruct {
  readonly [x: string]: unknown
}

export interface EIP712Domain extends TypedDataStruct {
  readonly name?: AbiString.From
  readonly version?: AbiString.From
  readonly chainId?: AbiUint256.From
  readonly verifyingContract?: AbiAddress.From
  readonly salt?: AbiBytes32.From
}

/**
 * a.k.a. signTypedData_v4 / EIP-712
 */
export namespace TypedData {

  const factoryByName: Record<string, AbiFactory> = {
    ...uintByName,
    ...intByName,
    ...bytesByName,
    bool: AbiBool,
    address: AbiAddress,
    uint: AbiUint256,
    int: AbiInt256,
  }

  export const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
    { name: 'salt', type: 'bytes32' },
  ] as const

  function sizeStructOrThrow(types: TypedDataTypes, type: string) {
    let length = 0

    for (const _ of types[type]!)
      length += 32

    return length
  }

  function sizeStructWithCacheOrThrow(types: TypedDataTypes, type: string, cache: Map<string, number>) {
    const cached = cache.get(type)

    if (cached != null)
      return cached

    const sized = sizeStructOrThrow(types, type)
    cache.set(type, sized)
    return sized
  }

  function resolveTypeOrThrow(types: TypedDataTypes, type: string, imports = new Set<string>()) {
    for (const variable of types[type]!) {
      const { type } = variable

      const bracket = type.indexOf("[")

      const realtype = bracket !== -1
        ? type.slice(0, bracket)
        : type

      if (types[realtype] == null)
        continue

      /**
       * Save the size before adding the type
       */
      const size = imports.size

      imports.add(realtype)

      /**
       * Add didn't change the size, so the type was already imported
       */
      if (imports.size === size)
        continue

      resolveTypeOrThrow(types, realtype, imports)
    }

    return imports
  }

  function encodeTypeOrThrow(types: TypedDataTypes, type: string) {
    const imports = resolveTypeOrThrow(types, type)
    const primary = `${type}(${types[type]!.map(({ name, type }) => `${type} ${name}`)})`

    if (imports.size === 0)
      return Bytes.fromUtf8(primary)

    let encoded = primary

    for (const type of [...imports].sort())
      encoded += `${type}(${types[type]!.map(({ name, type }) => `${type} ${name}`)})`

    return Bytes.fromUtf8(encoded)
  }

  export function encodeTypeWithCacheOrThrow(types: TypedDataTypes, type: string, cache: Map<string, Uint8Array>) {
    const cached = cache.get(type)

    if (cached != null)
      return cached

    const bytes = encodeTypeOrThrow(types, type)
    const hashed = Copiable.copyAndDispose(Keccak256.get().getOrThrow().hashOrThrow(bytes))
    cache.set(type, hashed)
    return hashed
  }

  export function encodeFieldOrThrow(types: TypedDataTypes, type: string, value: unknown, cursor: Cursor, typeSizeCache = new Map<string, number>(), typeHashCache = new Map<string, Uint8Array>()) {
    /**
     * Struct
     */
    if (types[type] != null) {
      const struct = value as TypedDataStruct
      using hashed = hashStructOrThrow(types, type, struct, typeSizeCache, typeHashCache)
      cursor.writeOrThrow(hashed.bytes)
      return
    }

    /**
     * Array
     */
    if (type.endsWith("]")) {
      const index = type.lastIndexOf("[")
      const subtype = type.slice(0, index)
      const array = value as readonly unknown[]
      using hash = hashArrayOrThrow(types, subtype, array, typeSizeCache, typeHashCache)
      cursor.writeOrThrow(hash.bytes)
      return
    }

    if (type === "string") {
      if (value instanceof Uint8Array) {
        using hash = Keccak256.get().getOrThrow().hashOrThrow(value)
        cursor.writeOrThrow(hash.bytes)
        return
      }

      if (typeof value === "string") {
        const bytes = Bytes.fromUtf8(value as string)
        using hash = Keccak256.get().getOrThrow().hashOrThrow(bytes)
        cursor.writeOrThrow(hash.bytes)
        return
      }

      throw new Error(`Could not encode string`)
    }

    if (type === "bytes") {
      if (value instanceof Uint8Array) {
        using hash = Keccak256.get().getOrThrow().hashOrThrow(value)
        cursor.writeOrThrow(hash.bytes)
        return
      }

      if (typeof value === "string") {
        using memory = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))
        using hash = Keccak256.get().getOrThrow().hashOrThrow(memory.bytes)
        cursor.writeOrThrow(hash.bytes)
        return
      }

      throw new Error(`Could not encode bytes`)
    }

    Records.resolveOrThrow(factoryByName, type).fromOrThrow(value).writeOrThrow(cursor)
  }

  export function hashArrayOrThrow(types: TypedDataTypes, type: string, array: readonly unknown[], typeSizeCache = new Map<string, number>(), typeHashCache = new Map<string, Uint8Array>()): Copiable<Keccak256.Output> {
    const bytes = new Uint8Array(32 * array.length)
    const cursor = new Cursor(bytes)

    for (const value of array)
      encodeFieldOrThrow(types, type, value, cursor, typeSizeCache, typeHashCache)

    return Keccak256.get().getOrThrow().hashOrThrow(bytes)
  }

  export function hashStructOrThrow(types: TypedDataTypes, type: string, struct: TypedDataStruct, typeSizeCache = new Map<string, number>(), typeHashCache = new Map<string, Uint8Array>()): Copiable<Keccak256.Output> {
    const typeSize = sizeStructWithCacheOrThrow(types, type, typeSizeCache)
    const typeHash = encodeTypeWithCacheOrThrow(types, type, typeHashCache)

    const bytes = new Uint8Array(32 + typeSize)
    const cursor = new Cursor(bytes)
    cursor.writeOrThrow(typeHash)

    for (const variable of types[type]!) {
      const { name, type } = variable
      const value = struct[name]

      encodeFieldOrThrow(types, type, value, cursor, typeSizeCache, typeHashCache)
    }

    return Keccak256.get().getOrThrow().hashOrThrow(bytes)
  }


  export function encodeOrThrow(data: TypedData) {
    const { types, primaryType, domain, message } = data

    if (types["EIP712Domain"] == null)
      (types as any)["EIP712Domain"] = EIP712Domain.filter(({ name }) => domain[name] != null)

    using domainHash = hashStructOrThrow(types, "EIP712Domain", domain)
    using messageHash = hashStructOrThrow(types, primaryType, message)

    const bytes = new Uint8Array(2 + domainHash.bytes.length + messageHash.bytes.length)
    const cursor = new Cursor(bytes)

    cursor.writeUint16OrThrow(6401)
    cursor.writeOrThrow(domainHash.bytes)
    cursor.writeOrThrow(messageHash.bytes)

    return bytes
  }

  /**
   * This is the function you are probably looking for
   * @param data 
   * @returns 
   */
  export function hashOrThrow(data: TypedData): Copiable<Keccak256.Output> {
    return Keccak256.get().getOrThrow().hashOrThrow(encodeOrThrow(data))
  }

}