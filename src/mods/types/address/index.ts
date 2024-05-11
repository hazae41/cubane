import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Nullable } from "@hazae41/option";
import { RawHexString, ZeroHexString } from "../string/index.js";

/**
 * A "0x"-prefixed and checksummed valid hex string of length 42
 */
export type Address = ZeroHexString<42> & { readonly __isAddress: true }

export namespace Address {

  export type From =
    | Uint8Array
    | ZeroHexString

  export namespace String {

    export function is(value: string): value is Address {
      if (!/^0x[0-9a-fA-F]{40}$/.test(value))
        return false
      return value === fromRawHexOrThrow(value.slice(2))
    }

  }

  export function is(value: unknown): value is Address {
    if (typeof value !== "string")
      return false
    if (!/^0x[0-9a-fA-F]{40}$/.test(value))
      return false
    return value === fromRawHexOrThrow(value.slice(2))
  }

  export function fromBytesOrThrow(value: Uint8Array): Address {
    return fromRawHexOrThrow(Base16.get().encodeOrThrow(value))
  }

  export function fromZeroHexOrThrow(value: ZeroHexString): Address {
    return fromRawHexOrThrow(value.slice(2))
  }

  export function fromRawHexOrThrow(raw: RawHexString) {
    const lowerCase = raw.toLowerCase()
    const upperCase = raw.toUpperCase()

    const bytes = Bytes.fromUtf8(lowerCase)
    using hashed = Keccak256.get().hashOrThrow(bytes)

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
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    return fromZeroHexOrThrow(from)
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
    using hashedSlice = Keccak256.get().hashOrThrow(uncompressedPublicKey.subarray(1))
    const rawLowerCase = Base16.get().encodeOrThrow(hashedSlice.bytes.slice(-20))

    return fromRawHexOrThrow(rawLowerCase)
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