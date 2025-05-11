import { Bytes } from "@hazae41/bytes";
import { $error } from "@hazae41/gardien";
import { RawHexString, ZeroHexString } from "@hazae41/hexane";
import { Keccak256 } from "@hazae41/keccak256";
import { Nullable } from "libs/nullable/index.js";
import { RawHexAsInteger } from "../convert/index.js";

export type AddressSymbol = symbol & { readonly name: "AddressSymbol" }

/**
 * A "0x"-prefixed and checksummed valid hex string of byte length 20
 */
export type Address = ZeroHexString<20> & { readonly [k: AddressSymbol]: true }

export namespace Address {

  export function is(value: string): value is Address {
    return value === fromOrNull(value)
  }

  export function asOrThrow(value: string): Address

  export function asOrThrow(value: ZeroHexString): Address

  export function asOrThrow(value: string): Address {
    if (!is(value))
      throw new Error()
    return value
  }

  export type From = RawHexAsInteger.From

  export function fromOrThrow(from: From) {
    return fromRawHexOrThrow(RawHexAsInteger.Length.fromOrThrow(from, 20))
  }

  export function fromOrNull(from: From): Nullable<Address> {
    try {
      return fromOrThrow(from)
    } catch { }
  }

  export function fromRawHexOrThrow(from: RawHexString<20>) {
    const lowerCase = from.toLowerCase()
    const upperCase = from.toUpperCase()

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

    return address as Address
  }

  export type Formatted = `0x${string}...${string}`

  /**
   * Format address as "0xFFFF...FFFF" for UI display
   * @param address 
   * @returns 
   */
  export function format(address: Address): Formatted {
    return `0x${address.slice(2, 6)}...${address.slice(-4)}`
  }

}

export function $address(message?: string) {
  return $error(Address, message)
}