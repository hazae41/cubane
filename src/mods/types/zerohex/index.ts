import { Base16 } from "@hazae41/base16"
import { Nullable } from "@hazae41/option"

/**
 * A "0x"-prefixed string
 */
export type ZeroHexString = `0x${string}`

export namespace ZeroHexString {

  export type From = string | number | bigint | Uint8Array

  export function from(fromable: From): ZeroHexString {
    if (typeof fromable === "number")
      return `0x${fromable.toString(16)}`
    if (typeof fromable === "bigint")
      return `0x${fromable.toString(16)}`
    if (fromable instanceof Uint8Array)
      return `0x${Base16.get().encodeOrThrow(fromable)}`

    if (is(fromable))
      return fromable

    return `0x${fromable}`
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

  export type From = string | number | bigint | Uint8Array

  export function from(fromable: From): Nullable<StrictZeroHexString> {
    if (typeof fromable === "number")
      return `0x${fromable.toString(16)}` as StrictZeroHexString
    if (typeof fromable === "bigint")
      return `0x${fromable.toString(16)}` as StrictZeroHexString
    if (fromable instanceof Uint8Array)
      return `0x${Base16.get().encodeOrThrow(fromable)}` as StrictZeroHexString

    if (is(fromable))
      return fromable

    const zeroHex = `0x${fromable}`

    if (is(zeroHex))
      return zeroHex

    return undefined
  }

  export function is(maybeStrictZeroHex: string): maybeStrictZeroHex is StrictZeroHexString {
    return /^0x[0-9a-fA-F]*$/.test(maybeStrictZeroHex)
  }

}