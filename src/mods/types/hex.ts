import { Err, Ok } from "@hazae41/result"

export type ZeroHexString = `0x${string}`

export namespace ZeroHexString {

  export function from(maybeZeroHex: string): ZeroHexString {
    if (is(maybeZeroHex))
      return maybeZeroHex
    return `0x${maybeZeroHex}`
  }

  export function is(maybeZeroHex: string): maybeZeroHex is ZeroHexString {
    return maybeZeroHex.startsWith("0x")
  }

  export function castOrThrow(maybeZeroHex: string) {
    if (is(maybeZeroHex))
      return maybeZeroHex
    throw new Error(`Casting error`)
  }

  export function tryCast(maybeZeroHex: string) {
    if (is(maybeZeroHex))
      return new Ok(maybeZeroHex)
    return new Err(new Error(`Casting error`))
  }

}