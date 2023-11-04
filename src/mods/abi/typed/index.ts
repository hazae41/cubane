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
  readonly [x: string]: readonly TypedDataVariable[]
}

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

  export function sizeOrThrow(types: TypedDataTypes, name: string) {
    let length = 0

    for (const _ of types[name])
      length += 32

    return length
  }

  export function resolveOrThrow(types: TypedDataTypes, name: string) {
    const imports = new Set<string>()
    resolveAllOrThrow(types, name, imports)
    return imports
  }

  function resolveAllOrThrow(types: TypedDataTypes, name: string, imports: Set<string>) {
    for (const variable of types[name]) {
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

      resolveAllOrThrow(types, type, imports)
    }
  }

  export function encodeOrThrow(types: TypedDataTypes, name: string) {
    const imports = resolveOrThrow(types, name)
    const primary = simpleEncodeOrThrow(types, name)

    if (imports.size === 0)
      return Bytes.fromUtf8(primary)

    let encoded = primary

    for (const name of [...imports].sort())
      encoded += simpleEncodeOrThrow(types, name)

    return Bytes.fromUtf8(encoded)
  }

  function simpleEncodeOrThrow(types: TypedDataTypes, name: string) {
    return `${name}(${types[name].map(({ name, type }) => `${type} ${name}`)})`
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

  export function hashOrThrow(types: TypedDataTypes, name: string, struct: TypedDataStruct) {
    if (types[name] == null && name === "EIP712Domain")
      (types as any)[name] = TypedDataTypes.EIP712Domain

    const length = TypedDataTypes.sizeOrThrow(types, name)

    const bytes = new Uint8Array(32 + length)
    const cursor = new Cursor(bytes)

    // TODO: memoize typeHash
    const typeBytes = TypedDataTypes.encodeOrThrow(types, name)
    using typeHash = Keccak256.get().hashOrThrow(typeBytes)
    cursor.writeOrThrow(typeHash.bytes)

    for (const variable of types[name]) {
      const { name, type } = variable
      const value = struct[name]

      if (types[type] != null) {
        using hashed = hashOrThrow(types, type, value as any)
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