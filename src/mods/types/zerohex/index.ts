import { Base16 } from "@hazae41/base16"

/**
 * Does not check if the string is a valid hex string
 */
export type ZeroHexString<N extends number = number> = number extends N
  ? `0x${string}`
  : `0x${string}` & { readonly length: N }

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