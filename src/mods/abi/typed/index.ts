import { Base16 } from "@hazae41/base16"
import { Copiable } from "@hazae41/box"
import { Bytes } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { Keccak256 } from "@hazae41/keccak256"
import { Nullable } from "@hazae41/option"
import { Result } from "@hazae41/result"
import { Records } from "libs/records/records.js"
import { Factory } from "../abi.js"
import { StaticAddress } from "../types/address/address.js"
import { StaticBool } from "../types/bool/bool.js"
import { StaticBytes32, bytesByName } from "../types/bytes/index.js"
import { intByName } from "../types/int/int.js"
import { DynamicString } from "../types/string/string.js"
import { StaticUint256, uintByName } from "../types/uint/uint.js"

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
  readonly name?: DynamicString.From
  readonly version?: DynamicString.From
  readonly chainId?: StaticUint256.From
  readonly verifyingContract?: StaticAddress.From
  readonly salt?: StaticBytes32.From
}

/**
 * a.k.a. signTypedData_v4 / EIP-712
 */
export namespace TypedData {

  const factoryByName: Record<string, Factory> = {
    ...uintByName,
    ...intByName,
    ...bytesByName,
    bool: StaticBool,
    address: StaticAddress,
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

  function sizeAnyWithCacheOrThrow(types: TypedDataTypes, type: string, cache: Map<string, number>) {
    if (types[type] != null)
      return sizeStructWithCacheOrThrow(types, type, cache)
    return 32
  }

  function resolveTypeOrThrow(types: TypedDataTypes, type: string, imports = new Set<string>()) {
    for (const variable of types[type]!) {
      const { type } = variable

      let realtype = type

      if (type.endsWith("]")) {
        const index = type.lastIndexOf("[")
        const subtype = type.slice(0, index)
        realtype = subtype
        continue
      }

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
    const hashed = Keccak256.get().hashOrThrow(bytes).copyAndDispose()
    cache.set(type, hashed)
    return hashed
  }

  export function encodeDataOrThrow(types: TypedDataTypes, type: string, value: unknown, cursor: Cursor, typeSizeCache = new Map<string, number>(), typeHashCache = new Map<string, Uint8Array>()) {
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
        using hash = Keccak256.get().hashOrThrow(value)
        cursor.writeOrThrow(hash.bytes)
        return
      }

      if (typeof value === "string") {
        const bytes = Bytes.fromUtf8(value as string)
        using hash = Keccak256.get().hashOrThrow(bytes)
        cursor.writeOrThrow(hash.bytes)
        return
      }

      throw new Error(`Could not encode string`)
    }

    if (type === "bytes") {
      if (value instanceof Uint8Array) {
        using hash = Keccak256.get().hashOrThrow(value)
        cursor.writeOrThrow(hash.bytes)
        return
      }

      if (typeof value === "string") {
        using slice = Base16.get().padStartAndDecodeOrThrow(value.slice(2))
        using hash = Keccak256.get().hashOrThrow(slice.bytes)
        cursor.writeOrThrow(hash.bytes)
        return
      }

      throw new Error(`Could not encode bytes`)
    }

    Records.resolveOrThrow(factoryByName, type).from(value).writeOrThrow(cursor)
  }

  export function hashArrayOrThrow(types: TypedDataTypes, type: string, array: readonly unknown[], typeSizeCache = new Map<string, number>(), typeHashCache = new Map<string, Uint8Array>()) {
    const typeSize = sizeAnyWithCacheOrThrow(types, type, typeSizeCache)

    const bytes = new Uint8Array(typeSize * array.length)
    const cursor = new Cursor(bytes)

    for (const value of array)
      encodeDataOrThrow(types, type, value, cursor, typeSizeCache, typeHashCache)

    return Keccak256.get().hashOrThrow(bytes)
  }

  export function hashStructOrThrow(types: TypedDataTypes, type: string, struct: TypedDataStruct, typeSizeCache = new Map<string, number>(), typeHashCache = new Map<string, Uint8Array>()) {
    const typeSize = sizeStructWithCacheOrThrow(types, type, typeSizeCache)
    const typeHash = encodeTypeWithCacheOrThrow(types, type, typeHashCache)

    const bytes = new Uint8Array(32 + typeSize)
    const cursor = new Cursor(bytes)
    cursor.writeOrThrow(typeHash)

    for (const variable of types[type]!) {
      const { name, type } = variable
      const value = struct[name]

      encodeDataOrThrow(types, type, value, cursor, typeSizeCache, typeHashCache)
    }

    return Keccak256.get().hashOrThrow(bytes)
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
    return Keccak256.get().hashOrThrow(encodeOrThrow(data))
  }

  export class HashError extends Error {
    readonly #class = HashError
    readonly name = this.#class.name

    constructor(options: ErrorOptions) {
      super(`Could not hash TypedData`, options)
    }

    static from(cause: unknown) {
      return new HashError({ cause })
    }

  }

  /**
   * This is the function you are probably looking for
   * @param data 
   * @returns 
   */
  export function tryHash(data: TypedData): Result<Copiable<Keccak256.Output>, HashError> {
    return Result.runAndWrapSync(() => {
      return hashOrThrow(data)
    }).mapErrSync(HashError.from)
  }

}