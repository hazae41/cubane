import { Base16 } from "@hazae41/base16"
import { Bytes } from "@hazae41/bytes"

/**
 * Does not check if the string is a valid hex string
 */
export type ZeroHexString<N extends number = number> = number extends N
  ? `0x${string}`
  : `0x${string}` & { readonly length: N }

export namespace ZeroHexString {

  export namespace String {

    export function is(value: string): value is ZeroHexString {
      return value.startsWith("0x")
    }

  }

  export function is(value: unknown): value is ZeroHexString {
    return typeof value === "string" && value.startsWith("0x")
  }

  export function fromRawHex(value: RawHexString): ZeroHexString {
    return `0x${value}`
  }

}

/**
 * Does not check if the string is a valid hex string
 */
export type RawHexString<N extends number = number> = number extends N
  ? string
  : string & { readonly length: N }

export namespace RawHexString {

  export namespace String {

    export function is(value: string): value is RawHexString {
      return true
    }

  }

  export function is(value: unknown): value is RawHexString {
    return typeof value === "string"
  }

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
export type ZeroHexUf8 = ZeroHexString

/**
 * Decode an utf-8 stringable to a zero-hex string
 */
export namespace ZeroHexUtf8 {

  export type From =
    | string
    | number
    | bigint
    | Uint8Array

  export function fromOrThrow(from: ZeroHexUtf8.From): ZeroHexUf8 {
    if (typeof from === "number")
      return `0x${Base16.get().encodeOrThrow(Bytes.fromUtf8(from.toString()))}`
    if (typeof from === "bigint")
      return `0x${Base16.get().encodeOrThrow(Bytes.fromUtf8(from.toString()))}`
    if (from instanceof Uint8Array)
      return `0x${Base16.get().encodeOrThrow(from)}`
    if (ZeroHexString.String.is(from))
      return from
    return `0x${Base16.get().encodeOrThrow(Bytes.fromUtf8(from))}`
  }

}

export type BytesUtf8 = Uint8Array

/**
 * Decode an utf-8 stringable to bytes
 */
export namespace BytesUtf8 {

  export type From =
    | string
    | number
    | bigint
    | Uint8Array

  export function fromOrThrow(from: BytesUtf8.From): BytesUtf8 {
    if (from instanceof Uint8Array)
      return from
    if (typeof from === "bigint")
      return Bytes.fromUtf8(from.toString())
    if (typeof from === "number")
      return Bytes.fromUtf8(from.toString())
    if (ZeroHexString.String.is(from))
      return Base16.get().padStartAndDecodeOrThrow(from.slice(2)).copyAndDispose()
    return Bytes.fromUtf8(from)
  }

}