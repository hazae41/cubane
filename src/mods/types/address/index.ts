import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { RawHexString, ZeroHexString } from "@hazae41/hex";
import { Keccak256 } from "@hazae41/keccak256";
import { Nullable } from "libs/nullable/index.js";
import { BytesAsInteger, RawHexAsInteger } from "../formats/index.js";

declare global {

  interface SymbolConstructor {
    readonly isAddress: symbol
  }

}

/**
 * A "0x"-prefixed and checksummed valid hex string of length 42
 */
export type Address = ZeroHexString<20> & { readonly [Symbol.isAddress]: true }

export namespace Address {

  export function is(value: string): value is Address {
    return ZeroHexString.is(value) && value === fromOrNull(value)
  }

  export type From = RawHexAsInteger.From

  export function fromOrThrow(from: From) {
    return fromRawHexOrThrow(RawHexAsInteger.fromOrThrow(from))
  }

  export function fromOrNull(from: Address.From): Nullable<Address> {
    try { return fromOrThrow(from) } catch { }
  }

  export function fromBytesOrThrow(from: Uint8Array) {
    return fromRawHexOrThrow(RawHexAsInteger.fromBytesOrThrow(from))
  }

  export function fromRawHexOrThrow(from: RawHexString) {
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

  /**
   * Compute address from uncompressed public key
   * @param uncompressedPublicKey 
   * @returns 
   */
  export function computeOrThrow(uncompressedPublicKey: BytesAsInteger.From) {
    const uncompressedPublicKeyBytes = BytesAsInteger.fromOrThrow(uncompressedPublicKey)

    using hashedSlice = Keccak256.get().getOrThrow().hashOrThrow(uncompressedPublicKeyBytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashedSlice.bytes.slice(-20))

    return fromRawHexOrThrow(rawLowerCase as RawHexString)
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