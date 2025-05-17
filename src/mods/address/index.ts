import { Bytes } from "@hazae41/bytes";
import { $error } from "@hazae41/gardien";
import { RawHexString, ZeroHexString } from "@hazae41/hexane";
import { Keccak256 } from "@hazae41/keccak256";
import { RawHexAsInteger } from "../convert/index.js";

export function $address(message?: string) {
  return $error(AddressString, message)
}

export type AddressSymbol = symbol & { readonly name: "AddressSymbol" }

/**
 * A "0x"-prefixed and checksummed valid hex string of byte length 20
 */
export type AddressString = ZeroHexString<20> & { readonly [k: AddressSymbol]: true }

export namespace AddressString {

  export type From = RawHexAsInteger.From

  export function fromOrThrow(value: From) {
    return fromRawHexOrThrow(RawHexAsInteger.Length.fromOrThrow(value, 20))
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return fromRawHexOrThrow(RawHexAsInteger.Length.fromOrThrow(value, 20))
  }

  export function fromRawHexOrThrow(value: RawHexString<20>) {
    const lowerCase = value.toLowerCase()
    const upperCase = value.toUpperCase()

    const bytes = Bytes.fromUtf8(lowerCase)
    using hashed = Keccak256.get().getOrThrow().hashOrThrow(bytes)

    let address = "0x"

    for (let i = 0; i < 40; i += 2) {
      const byte = hashed.bytes[i >> 1]

      address += (byte >> 4) > 7
        ? upperCase[i]
        : lowerCase[i]

      address += (byte & 0x0f) > 7
        ? upperCase[i + 1]
        : lowerCase[i + 1]
    }

    return address as AddressString
  }

}

export namespace AddressString {

  export function is(value: string): value is AddressString {
    try {
      return value === fromOrThrow(value)
    } catch {
      return false
    }
  }

  export function asOrThrow(value: string): AddressString

  export function asOrThrow(value: `0x${string}`): AddressString

  export function asOrThrow(value: string): AddressString {
    if (!is(value))
      throw new Error()
    return value
  }

}

export namespace AddressString {

  export type Formated = `0x${string}...${string}`

  export function format(value: AddressString): Formated {
    return `0x${value.slice(2, 6)}...${value.slice(-4)}`
  }

}

export type UncheckedAddressString = ZeroHexString<20>