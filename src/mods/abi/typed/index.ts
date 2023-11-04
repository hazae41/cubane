import { Copiable } from "@hazae41/box"
import { Bytes } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { Keccak256 } from "@hazae41/keccak256"
import { Result } from "@hazae41/result"
import { Records } from "libs/records/records.js"
import { IntByName, StaticAddress, StaticBool, UintByName, bytesByName, intByName, uintByName } from "../index.js"

export interface TypedData {
  readonly types: TypedDataTypes
  readonly primaryType: string
  readonly domain: TypedDataStruct
  readonly message: TypedDataStruct
}

export interface TypedDataTypes {
  readonly [x: string]: TypedDataType
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

export interface EIP712Domain {
  readonly name: string
  readonly version: string
  readonly chainId: number
  readonly verifyingContract: string
}

export namespace TypedDataTypes {

  export const EIP712Domain = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
  ] as const

  export function sizeOrThrow(vars: readonly TypedDataVariable[]) {
    let length = 0

    for (const _ of vars)
      length += 32

    return length
  }

  function resolveOrThrow(types: TypedDataTypes, type: string, imports = new Set<string>()) {
    for (const variable of types[type]) {
      const { type } = variable

      if (types[type] == null)
        continue

      /**
       * Save the size before adding the type
       */
      const size = imports.size

      imports.add(type)

      /**
       * Add didn't change the size, so the type was already imported
       */
      if (imports.size === size)
        continue

      resolveOrThrow(types, type, imports)
    }

    return imports
  }

  export function encodeOrThrow(types: TypedDataTypes, type: string) {
    const imports = resolveOrThrow(types, type)
    const primary = encodeSingleOrThrow(types, type)

    if (imports.size === 0)
      return Bytes.fromUtf8(primary)

    let encoded = primary

    for (const type of [...imports].sort())
      encoded += encodeSingleOrThrow(types, type)

    return Bytes.fromUtf8(encoded)
  }

  function encodeSingleOrThrow(types: TypedDataTypes, type: string) {
    return `${type}(${types[type].map(({ name, type }) => `${type} ${name}`)})`
  }

}

export namespace TypedDataStruct {

  const factoryByName: UintByName & IntByName & {
    bool: typeof StaticBool,
    address: typeof StaticAddress,
  } = {
    ...uintByName,
    ...intByName,
    ...bytesByName,
    bool: StaticBool,
    address: StaticAddress,
  } as const

  export function hashOrThrow(types: TypedDataTypes, type: string, struct: TypedDataStruct, typeSizeCache: Map<string, number> = new Map(), typeHashCache: Map<string, Uint8Array> = new Map()) {
    let typeSize: number

    const typeSizeCached = typeSizeCache.get(type)

    if (typeSizeCached != null) {
      typeSize = typeSizeCached
    } else {
      typeSize = TypedDataTypes.sizeOrThrow(types[type])
      typeSizeCache.set(type, typeSize)
    }

    const bytes = new Uint8Array(32 + typeSize)
    const cursor = new Cursor(bytes)

    const typeHashCached = typeHashCache.get(type)

    if (typeHashCached != null) {
      cursor.writeOrThrow(typeHashCached)
    } else {
      const typeBytes = TypedDataTypes.encodeOrThrow(types, type)
      const typeHash = Keccak256.get().hashOrThrow(typeBytes).copyAndDispose()
      typeHashCache.set(type, typeHash)
      cursor.writeOrThrow(typeHash)
    }

    for (const variable of types[type]) {
      const { name, type } = variable
      const value = struct[name]

      if (types[type] != null) {
        using hashed = hashOrThrow(types, type, value as any, typeSizeCache, typeHashCache)
        cursor.writeOrThrow(hashed.bytes)
        continue
      }

      if (type === "string") {
        const bytes = Bytes.fromUtf8(value as string)
        using hash = Keccak256.get().hashOrThrow(bytes)
        cursor.writeOrThrow(hash.bytes)
        continue
      }

      if (type === "bytes") {
        const bytes = value as Uint8Array
        using hash = Keccak256.get().hashOrThrow(bytes)
        cursor.writeOrThrow(hash.bytes)
        continue
      }

      const factory = Records.resolveOrThrow(factoryByName, type) as any
      factory.from(value).writeOrThrow(cursor)

      continue
    }

    return Keccak256.get().hashOrThrow(bytes)
  }

}

export namespace TypedData {

  export function encodeOrThrow(data: TypedData) {
    const { types, primaryType, domain, message } = data

    if (types["EIP712Domain"] == null)
      (types as any)["EIP712Domain"] = TypedDataTypes.EIP712Domain;

    using domainHash = TypedDataStruct.hashOrThrow(types, "EIP712Domain", domain)
    using messageHash = TypedDataStruct.hashOrThrow(types, primaryType, message)

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