import { Base16 } from "@hazae41/base16"
import { BigInts } from "libs/bigint/bigint.js"
import { Wrapped } from "../wrapped/generic.js"

export namespace BigIntAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedBigIntAsIntegerOrThrow()
  }

}

export namespace NumberAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedNumberAsIntegerOrThrow()
  }

}

export namespace ZeroHexAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toWrappedZeroHexAsIntegerOrThrow()
  }

}

export namespace RawHexAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(from: From) {
    if (typeof from === "number")
      return from.toString(16) as RawHexString
    if (typeof from === "bigint")
      return from.toString(16) as RawHexString
    if (from instanceof Uint8Array)
      return Base16.get().encodeOrThrow(from) as RawHexString
    if (ZeroHexString.String.is(from))
      return from.slice(2) as RawHexString
    return BigInts.decodeDecimal(from).toString(16) as RawHexString
  }

}

export type BytesInteger = Uint8Array

/**
 * Decode an integerable to bytes
 */
export namespace BytesInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | ZeroHexString

  export function is(value: unknown): value is BytesInteger {
    return value instanceof Uint8Array
  }

  export function fromOrThrow(value: BytesInteger.From): BytesInteger {
    if (value instanceof Uint8Array)
      return value
    if (typeof value === "bigint")
      return Base16.get().padStartAndDecodeOrThrow(value.toString(16)).copyAndDispose()
    if (typeof value === "number")
      return Base16.get().padStartAndDecodeOrThrow(value.toString(16)).copyAndDispose()
    if (ZeroHexString.String.is(value))
      return Base16.get().padStartAndDecodeOrThrow(value.slice(2)).copyAndDispose()
    return Base16.get().padStartAndDecodeOrThrow(BigInts.decodeDecimal(value).toString(16)).copyAndDispose()
  }

}

export type StringInteger = string

/**
 * Convert an integerable to a decimal string
 */
export namespace StringInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | ZeroHexString

  export function is(value: unknown): value is StringInteger {
    return typeof value === "string"
  }

  export function fromOrThrow(value: StringInteger.From): StringInteger {
    if (value instanceof Uint8Array)
      return BigInts.decodeRawHex(Base16.get().encodeOrThrow(value)).toString()
    if (typeof value === "bigint")
      return value.toString()
    if (typeof value === "number")
      return value.toString()
    if (ZeroHexString.String.is(value))
      return BigInts.decodeZeroHex(value).toString()
    return value
  }

}