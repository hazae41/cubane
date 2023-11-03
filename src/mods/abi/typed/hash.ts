import { Copiable } from "@hazae41/box"
import { Bytes } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { Keccak256 } from "@hazae41/keccak256"
import { Records } from "libs/records/records.js"
import { IntByName, StaticAddress, StaticBool, UintByName, bytesByName, intByName, uintByName } from "../index.js"

export interface TypedData {
  readonly types: TypedDataTypes
  readonly primaryType: string
  readonly domain: { [x: string]: unknown }
  readonly message: { [x: string]: unknown }
}

export interface TypedDataTypes {
  readonly EIP712Domain: readonly TypedDataVariable[]
  readonly [x: string]: readonly TypedDataVariable[]
}

export interface TypedDataVariable {
  readonly name: string
  readonly type: string
}

export interface EIP712Domain {
  readonly name: string
  readonly version: string
  readonly chainId: number
  readonly verifyingContract: string
}

export namespace TypedData {

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

  export function resolveType(types: TypedDataTypes, name: string) {
    const imports = new Set<string>()
    _resolveType(types, name, imports)
    return imports
  }

  function _resolveType(types: TypedDataTypes, name: string, imports: Set<string>) {
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

      _resolveType(types, type, imports)
    }
  }

  export function encodeType(types: TypedDataTypes, name: string) {
    const imports = resolveType(types, name)
    const primary = _encodeType(types, name)

    if (imports.size === 0)
      return Bytes.fromUtf8(primary)

    let encoded = primary

    for (const name of [...imports].sort())
      encoded += _encodeType(types, name)

    return Bytes.fromUtf8(encoded)
  }

  function _encodeType(types: TypedDataTypes, name: string) {
    return `${name}(${types[name].map(({ name, type }) => `${type} ${name}`)})`
  }

  export function sizeType(types: TypedDataTypes, name: string) {
    let length = 0

    for (const _ of types[name])
      length += 32

    return length
  }

  export function hashStruct(types: TypedDataTypes, name: string, struct: { [x: string]: unknown }) {
    const length = TypedData.sizeType(types, name)

    const bytes = new Uint8Array(32 + length)
    const cursor = new Cursor(bytes)

    // TODO: memoize typeHash
    using typeHash = Keccak256.get().hashOrThrow(encodeType(types, name))
    cursor.writeOrThrow(typeHash.bytes)

    for (const variable of types[name]) {
      const { name, type } = variable
      const value = struct[name]

      if (types[type] != null) {
        using hash = hashStruct(types, type, value as { [x: string]: unknown })
        cursor.writeOrThrow(hash.bytes)
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

  export function encode(data: TypedData) {
    const { types, primaryType, domain, message } = data

    using domainHash = hashStruct(types, "EIP712Domain", domain)
    using messageHash = hashStruct(types, primaryType, message)

    const bytes = new Uint8Array(2 + domainHash.bytes.length + messageHash.bytes.length)
    const cursor = new Cursor(bytes)

    cursor.writeUint16OrThrow(6401)
    cursor.writeOrThrow(domainHash.bytes)
    cursor.writeOrThrow(messageHash.bytes)

    return bytes
  }

  export function hash(data: TypedData): Copiable<Keccak256.Output> {
    return Keccak256.get().hashOrThrow(encode(data))
  }

}