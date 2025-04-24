import { Base16 } from "@hazae41/base16"
import { Bytes } from "@hazae41/bytes"
import { RawHexString, ZeroHexString } from "@hazae41/hex"
import { BigInts } from "libs/bigint/bigint.js"
import { Copiable } from "libs/copiable/index.js"
import { Numbers } from "libs/number/number.js"

/**
 * Decode an utf-8 string-like to a zero-hex string
 */
export namespace ZeroHexAsUtf8 {

  export type From =
    | string
    | Uint8Array
    | ZeroHexString

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return value
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(value)}` as ZeroHexString
  }

  export function fromStringOrThrow(value: string) {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(Bytes.fromUtf8(value))}` as ZeroHexString
  }

  export function fromOrThrow(value: From): ZeroHexString {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}

/**
 * Decode an utf-8 string-like to a raw-hex string
 */
export namespace RawHexAsUtf8 {

  export type From =
    | string
    | Uint8Array
    | ZeroHexString

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return value.slice(2) as RawHexString
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString
  }

  export function fromStringOrThrow(value: string) {
    return Base16.get().getOrThrow().encodeOrThrow(Bytes.fromUtf8(value)) as RawHexString
  }

  export function fromOrThrow(value: From): RawHexString {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}

/**
 * Decode an utf-8 string-like to bytes
 */
export namespace BytesAsUtf8 {

  export type From =
    | string
    | Uint8Array
    | ZeroHexString

  export function fromBytesOrThrow(value: Uint8Array) {
    return value
  }

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2)))
  }

  export function fromStringOrThrow(value: string) {
    return Bytes.fromUtf8(value)
  }

  export function fromOrThrow(value: From) {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}

/**
 * Decode an utf-8 string-like to a string
 */
export namespace StringAsUtf8 {

  export type From =
    | string
    | Uint8Array
    | ZeroHexString

  export function fromStringOrThrow(value: string) {
    return value
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return Bytes.toUtf8(value)
  }

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))

    return Bytes.toUtf8(copiable.bytes)
  }

  export function fromOrThrow(from: From) {
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (ZeroHexString.is(from))
      return fromZeroHexOrThrow(from)
    return fromStringOrThrow(from)
  }

}

/**
 * Convert an integer-like to a bigint
 */
export namespace BigIntAsInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | ZeroHexString

  export function fromBigIntOrThrow(value: bigint) {
    return value
  }

  export function fromNumberOrThrow(value: number) {
    return BigInt(value)
  }

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return BigInts.decodeZeroHex(value)
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return BigInts.decodeRawHex(Base16.get().getOrThrow().encodeOrThrow(value))
  }

  export function fromStringOrThrow(value: string) {
    return BigInts.decodeDecimal(value)
  }

  export function fromOrThrow(value: From) {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (typeof value === "bigint")
      return fromBigIntOrThrow(value)
    if (typeof value === "number")
      return fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}

/**
 * Convert an integer-like to a number
 */
export namespace NumberAsInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | ZeroHexString

  export function fromNumberOrThrow(value: number) {
    return value
  }

  export function fromBigIntOrThrow(value: bigint) {
    return Number(value)
  }

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return Numbers.decodeZeroHex(value)
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return Numbers.decodeRawHex(Base16.get().getOrThrow().encodeOrThrow(value))
  }

  export function fromStringOrThrow(value: string) {
    return Numbers.decodeDecimal(value)
  }

  export function fromOrThrow(value: From) {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (typeof value === "bigint")
      return fromBigIntOrThrow(value)
    if (typeof value === "number")
      return fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}

/**
 * Convert an integer-like to a zero-hex string
 */
export namespace ZeroHexAsInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | ZeroHexString

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return value
  }

  export function fromBigIntOrThrow(value: bigint) {
    return `0x${value.toString(16)}` as ZeroHexString
  }

  export function fromNumberOrThrow(value: number) {
    return `0x${value.toString(16)}` as ZeroHexString
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(value)}` as ZeroHexString
  }

  export function fromStringOrThrow(value: string) {
    return `0x${BigInts.decodeDecimal(value).toString(16)}` as ZeroHexString
  }

  export function fromOrThrow(value: From) {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (typeof value === "bigint")
      return fromBigIntOrThrow(value)
    if (typeof value === "number")
      return fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}

/**
 * Convert an integer-like to a raw-hex string
 */
export namespace RawHexAsInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | ZeroHexString

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return value.slice(2) as RawHexString
  }

  export function fromBigIntOrThrow(value: bigint) {
    return value.toString(16) as RawHexString
  }

  export function fromNumberOrThrow(value: number) {
    return value.toString(16) as RawHexString
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString
  }

  export function fromStringOrThrow(value: string) {
    return BigInts.decodeDecimal(value).toString(16) as RawHexString
  }

  export function fromOrThrow(value: From) {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (typeof value === "bigint")
      return fromBigIntOrThrow(value)
    if (typeof value === "number")
      return fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}

/**
 * Convert an integer-like to bytes
 */
export namespace BytesAsInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | ZeroHexString

  export function fromBytesOrThrow(value: Uint8Array) {
    return value
  }

  export function fromBigIntOrThrow(value: bigint) {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.toString(16)))
  }

  export function fromNumberOrThrow(value: number) {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.toString(16)))
  }

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2)))
  }

  export function fromStringOrThrow(value: string) {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(BigInts.decodeDecimal(value).toString(16)))
  }

  export function fromOrThrow(value: From) {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (typeof value === "bigint")
      return fromBigIntOrThrow(value)
    if (typeof value === "number")
      return fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}

/**
 * Convert an integer-like to a string
 */
export namespace StringAsInteger {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | ZeroHexString

  export function fromStringOrThrow(value: string) {
    return value
  }

  export function fromBigIntOrThrow(value: bigint) {
    return value.toString()
  }

  export function fromNumberOrThrow(value: number) {
    return value.toString()
  }

  export function fromZeroHexOrThrow(value: ZeroHexString) {
    return BigInts.decodeZeroHex(value).toString()
  }

  export function fromBytesOrThrow(value: Uint8Array) {
    return BigInts.decodeRawHex(Base16.get().getOrThrow().encodeOrThrow(value)).toString()
  }

  export function fromOrThrow(value: From) {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (typeof value === "bigint")
      return fromBigIntOrThrow(value)
    if (typeof value === "number")
      return fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

}