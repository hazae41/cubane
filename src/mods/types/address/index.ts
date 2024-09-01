import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Nullable } from "libs/nullable/index.js";
import { RawHexAsInteger } from "../helpers/generic.js";
import { RawHexString, ZeroHexString } from "../string/index.js";

declare global {
  interface SymbolConstructor {
    readonly isAddress: symbol
  }
}

/**
 * A "0x"-prefixed and checksummed valid hex string of length 42
 */
export type Address = ZeroHexString<42> & { readonly [Symbol.isAddress]: true }

export namespace Address {

  export type From = RawHexAsInteger.From

  export namespace String {

    export function is(value: string): value is Address {
      if (!ZeroHexString.String.is(value))
        return false
      return value === checksumOrThrow(RawHexString.fromZeroHex(value))
    }

  }

  export namespace Unknown {

    export function is(value: unknown): value is Address {
      if (!ZeroHexString.Unknown.is(value))
        return false
      return value === checksumOrThrow(RawHexString.fromZeroHex(value))
    }

  }

  export function checksumOrThrow(raw: RawHexString) {
    const lowerCase = raw.toLowerCase()
    const upperCase = raw.toUpperCase()

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

  export function fromOrThrow(from: Address.From): Address {
    return checksumOrThrow(RawHexAsInteger.fromOrThrow(from))
  }

  export function fromOrNull(from: Address.From): Nullable<Address> {
    try {
      return fromOrThrow(from)
    } catch { }
  }

  /**
   * Compute address from uncompressed public key
   * @param uncompressedPublicKey 
   * @returns 
   */
  export function computeOrThrow(uncompressedPublicKey: Uint8Array) {
    using hashedSlice = Keccak256.get().getOrThrow().hashOrThrow(uncompressedPublicKey.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashedSlice.bytes.slice(-20))

    return checksumOrThrow(rawLowerCase as RawHexString)
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