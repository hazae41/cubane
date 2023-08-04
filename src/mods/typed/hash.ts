import { Bytes } from "@hazae41/bytes"
import { keccak_256 } from "@noble/hashes/sha3"
import { Records } from "libs/records/records.js"
import { bytesByName, intByName, uintByName } from "mods/abi/index.js"

export interface TypedData {
  readonly types: TypedDataTypes
  readonly primaryType: string
  readonly domain: {}
  readonly message: {}
}

export interface TypedDataTypes {
  readonly EIP712Domain: TypedDataVariable[]
  readonly [x: string]: TypedDataVariable[]
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

export function hashStruct(types: TypedDataTypes, name: string, struct: {}) {
  const typeHash = keccak_256(encodeType(types, name))

  // const encodedData = encodeData(struct)
}

/**
 * The type of a struct is encoded as name ‖ "(" ‖ member₁ ‖ "," ‖ member₂ ‖ "," ‖ … ‖ memberₙ ")" where each member is written as type ‖ " " ‖ name. For example, the above Mail struct is encoded as Mail(address from,address to,string contents).
 * If the struct type references other struct types (and these in turn reference even more struct types), then the set of referenced struct types is collected, sorted by name and appended to the encoding. An example encoding is Transaction(Person from,Person to,Asset tx)Asset(address token,uint256 amount)Person(address wallet,string name).
 * @param types 
 * @param type 
 */
export function encodeType(types: TypedDataTypes, name: string) {
  return Bytes.fromUtf8(`${name}(${types[name].map(({ name, type }) => `${type} ${name}`)})`)
}

export function encodeData(types: TypedDataTypes, name: string, struct: {}) {

}

const factoryByName = {
  ...uintByName,
  ...intByName,
  ...bytesByName
} as const

export function encodeVariable(type: string, value: unknown) {
  const factory = Records.tryResolve(factoryByName, type).unwrap()
}
