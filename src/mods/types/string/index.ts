import { Base16 } from "@hazae41/base16"
import { Bytes } from "@hazae41/bytes"

/**
 * Does not check if the string is a valid hex string
 */
export type RawHexString<N extends number = number> = number extends N
  ? string
  : string & { readonly length: N }

export namespace RawHexString {

  export function padStart(text: RawHexString) {
    return text.padStart(text.length + (text.length % 2), "0")
  }

  export function padEnd(text: RawHexString) {
    return text.padEnd(text.length + (text.length % 2), "0")
  }

}

/**
 * Does not check if the string is a valid hex string
 */
export type ZeroHexString<N extends number = number> = number extends N
  ? `0x${string}`
  : `0x${string}` & { readonly length: N }

/**
 * Decode an utf-8 stringable to a zero-hex string
 */
export namespace ZeroHexString {

  export type From =
    | string
    | number
    | bigint
    | Uint8Array

  export function is(maybeZeroHex: string): maybeZeroHex is ZeroHexString {
    return maybeZeroHex.startsWith("0x")
  }

  export function fromOrThrow(from: ZeroHexString.From): ZeroHexString {
    if (typeof from === "number")
      return `0x${Base16.get().encodeOrThrow(Bytes.fromUtf8(from.toString()))}`
    if (typeof from === "bigint")
      return `0x${Base16.get().encodeOrThrow(Bytes.fromUtf8(from.toString()))}`
    if (from instanceof Uint8Array)
      return `0x${Base16.get().encodeOrThrow(from)}`
    if (ZeroHexString.is(from))
      return from
    return `0x${Base16.get().encodeOrThrow(Bytes.fromUtf8(from))}`
  }

}

export type BytesString = Uint8Array

/**
 * Decode an utf-8 stringable to bytes
 */
export namespace BytesString {

  export type From =
    | string
    | number
    | bigint
    | Uint8Array

  export function fromOrThrow(from: BytesString.From): BytesString {
    if (from instanceof Uint8Array)
      return from
    if (typeof from === "bigint")
      return Bytes.fromUtf8(from.toString())
    if (typeof from === "number")
      return Bytes.fromUtf8(from.toString())
    if (ZeroHexString.is(from))
      return Base16.get().padStartAndDecodeOrThrow(from.slice(2)).copyAndDispose()
    return Bytes.fromUtf8(from)
  }

}