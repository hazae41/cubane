import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Nullable } from "@hazae41/option";
import { Err, Ok, Result } from "@hazae41/result";
import { ZeroHexString } from "../zerohex/index.js";

/**
 * A "0x"-prefixed and checksummed valid hex string of length 42
 */
export type Address = ZeroHexString<42> & { readonly __isAddress: true }

export namespace Address {

  export type From = string | bigint | Uint8Array

  export function from(fromable: From): Nullable<Address> {
    const zeroHex = ZeroHexString.from(fromable)

    if (zeroHex == null)
      return undefined
    if (!/^0x[0-9a-fA-F]{40}$/.test(zeroHex))
      return undefined

    return checksum(zeroHex.slice(2))
  }

  export function tryFrom(fromable: From): Result<Address, Error> {
    const address = from(fromable)

    if (address == null)
      return new Err(new Error(`Could not convert to Address`))

    return new Ok(address)
  }

  export function fromOrThrow(fromable: From): Address {
    const address = from(fromable)

    if (address == null)
      throw new Error(`Could not convert to Address`)

    return address
  }

  export function is(maybeAddress: string): maybeAddress is Address {
    if (!/^0x[0-9a-fA-F]{40}$/.test(maybeAddress))
      return false
    return maybeAddress === checksum(maybeAddress.slice(2))
  }

  export function checksum(rawHex: string) {
    const lowerCase = rawHex.toLowerCase()
    const upperCase = rawHex.toUpperCase()

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

  export type Formatted = `0x${string}...${string}`

  /**
   * Format address as "0xFFFF...FFFF" for UI display
   * @param address 
   * @returns 
   */
  export function format(address: Address): Formatted {
    return `0x${address.slice(2, 6)}...${address.slice(-4)}`
  }

  /**
   * Compute address from uncompressed public key
   * @param uncompressedPublicKey 
   * @returns 
   */
  export function compute(uncompressedPublicKey: Uint8Array) {
    using hashedSlice = Keccak256.get().hashOrThrow(uncompressedPublicKey.subarray(1))
    const rawLowerCase = Base16.get().encodeOrThrow(hashedSlice.bytes.slice(-20))

    return checksum(rawLowerCase)
  }

}