import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Nullable } from "@hazae41/option";
import { Err, Ok, Result } from "@hazae41/result";
import { StrictZeroHexString } from "../zerohex/index.js";

/**
 * A "0x"-prefixed and checksumed valid hex string of length 42
 */
export type Address = StrictZeroHexString & { length: 42 } & { __isAddress: true }

export namespace Address {

  export function from(addressable: string | number | bigint | Uint8Array): Nullable<Address> {
    const strictZeroHex = StrictZeroHexString.from(addressable)

    if (strictZeroHex == null)
      return undefined
    if (strictZeroHex.length !== 42)
      return undefined

    return checksum(strictZeroHex as any)
  }

  export function tryFrom(addressable: string | number | bigint): Result<Address, Error> {
    const address = from(addressable)

    if (address == null)
      return new Err(new Error(`Could not convert to Address`))

    return new Ok(address)
  }

  export function fromOrThrow(addressable: string | number | bigint): Address {
    const address = from(addressable)

    if (address == null)
      throw new Error(`Could not convert to Address`)

    return address
  }

  /**
   * Guard against "0x"-prefixed and valid hex string of length 42
   * @param maybeAddress 
   * @returns 
   */
  export function is(maybeAddress: StrictZeroHexString & { length: 42 }): maybeAddress is Address {
    return maybeAddress === checksum(maybeAddress)
  }

  export function checksum(strictZeroHex: StrictZeroHexString & { length: 42 }): Address {
    const rawHex = strictZeroHex.slice(2)

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

  export namespace String {

    /**
     * Guard against string
     * @param maybeAddress 
     * @returns 
     */
    export function is(maybeAddress: string) {
      if (!StrictZeroHexString.is(maybeAddress))
        return false
      if (maybeAddress.length !== 42)
        return false
      return Address.is(maybeAddress as any)
    }

  }

}