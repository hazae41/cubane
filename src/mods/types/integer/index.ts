import { Base16 } from "@hazae41/base16"
import { BigInts } from "libs/bigint/bigint.js"
import { Numbers } from "libs/number/number.js"

export type Integer =
  | BigIntInteger
  | NumberInteger
  | ZeroHexInteger
  | BytesInteger
  | StringInteger

export namespace Integer {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | `0x${string}`

  export function fromOrThrow(value: Integer.From): Integer {
    return value
  }

}

export type BigIntInteger = bigint

export namespace BigIntInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | `0x${string}`

  export function is(value: unknown): value is BigIntInteger {
    return typeof value === "bigint"
  }

  export function fromOrThrow(value: BigIntInteger.From) {
    if (typeof value === "bigint")
      return value
    if (typeof value === "number")
      return BigInt(value)
    if (typeof value === "string")
      return BigInts.decodeZeroHexOrDecimal(value)
    return BigInts.decodeRawHex(Base16.get().encodeOrThrow(value))
  }

}

export type NumberInteger = number

export namespace NumberInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | `0x${string}`

  export function is(value: unknown): value is NumberInteger {
    return typeof value === "number"
  }

  export function fromOrThrow(value: NumberInteger.From): NumberInteger {
    if (typeof value === "number")
      return value
    if (typeof value === "bigint")
      return Number(value)
    if (typeof value === "string")
      return Numbers.decodeZeroHexOrDecimal(value)
    return Numbers.decodeRawHex(Base16.get().encodeOrThrow(value))
  }

}

export type ZeroHexInteger<N extends number = number> = number extends N
  ? `0x${string}`
  : `0x${string}` & { readonly length: N }

/**
 * Decode an integerable to a zero-hex string
 */
export namespace ZeroHexInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | `0x${string}`

  export namespace String {

    export function is(value: string): value is ZeroHexInteger {
      return value.startsWith("0x")
    }

  }

  export function is(value: unknown): value is ZeroHexInteger {
    return typeof value === "string" && value.startsWith("0x")
  }

  export function fromOrThrow(from: ZeroHexInteger.From): ZeroHexInteger {
    if (typeof from === "number")
      return `0x${from.toString(16)}`
    if (typeof from === "bigint")
      return `0x${from.toString(16)}`
    if (from instanceof Uint8Array)
      return `0x${Base16.get().encodeOrThrow(from)}`
    if (ZeroHexInteger.is(from))
      return from
    return `0x${BigInts.decodeDecimal(from).toString(16)}`
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
    | `0x${string}`

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
    if (ZeroHexInteger.is(value))
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
    | `0x${string}`

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
    if (ZeroHexInteger.String.is(value))
      return BigInts.decodeZeroHex(value).toString()
    return value
  }

}