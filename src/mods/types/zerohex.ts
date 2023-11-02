import { Nullable } from "@hazae41/option"

/**
 * A "0x"-prefixed string
 */
export type ZeroHexString = `0x${string}`

export namespace ZeroHexString {

  export function from(zeroHexable: string | number | bigint): ZeroHexString {
    if (typeof zeroHexable === "number")
      return `0x${zeroHexable.toString(16)}`
    if (typeof zeroHexable === "bigint")
      return `0x${zeroHexable.toString(16)}`

    if (is(zeroHexable))
      return zeroHexable

    return `0x${zeroHexable}`
  }

  export function is(maybeZeroHex: string): maybeZeroHex is ZeroHexString {
    return maybeZeroHex.startsWith("0x")
  }

}

/**
 * A "0x"-prefixed and valid hex string
 */
export type StrictZeroHexString = ZeroHexString & { __isStrictZeroHexString: true }

export namespace StrictZeroHexString {

  export function from(strictZeroHexable: string | number | bigint): Nullable<StrictZeroHexString> {
    if (typeof strictZeroHexable === "number")
      return `0x${strictZeroHexable.toString(16)}` as StrictZeroHexString
    if (typeof strictZeroHexable === "bigint")
      return `0x${strictZeroHexable.toString(16)}` as StrictZeroHexString

    if (is(strictZeroHexable))
      return strictZeroHexable

    const zeroHex = `0x${strictZeroHexable}`

    if (is(zeroHex))
      return zeroHex

    return undefined
  }

  export function is(maybeStrictZeroHex: string): maybeStrictZeroHex is StrictZeroHexString {
    return /^0x[0-9a-fA-F]*$/.test(maybeStrictZeroHex)
  }

}