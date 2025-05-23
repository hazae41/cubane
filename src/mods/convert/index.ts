import { Base16 } from "@hazae41/base16"
import { Bytes, Uint8Array } from "@hazae41/bytes"
import { RawHexString, ZeroHexString } from "@hazae41/hexane"
import { BigInts } from "libs/bigint/bigint.js"
import { Copiable, Copied } from "libs/copiable/index.js"
import { Numbers } from "libs/number/number.js"

export type BytesLike<N extends number = number> =
  | Uint8Array<N>
  | ZeroHexString<N>

export namespace BytesAsBytes {

  export type From = BytesLike

  export function fromOrThrow(value: From): Uint8Array {
    if (value instanceof Uint8Array)
      return value
    return fromZeroHexOrThrow(value)
  }

  function fromZeroHexOrThrow(value: ZeroHexString): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2)))
  }

  export namespace Length {

    export function fromOrThrow<N extends number>(value: From, byteLength: N): Uint8Array<N> {
      return Bytes.castOrThrow(BytesAsBytes.fromOrThrow(value), byteLength)
    }

  }

}

export namespace ZeroHexAsBytes {

  export type From = BytesLike

  export function fromOrThrow(value: From): ZeroHexString {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    return value
  }

  function fromBytesOrThrow(value: Uint8Array): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(value)}` as ZeroHexString
  }

  export namespace Length {

    export function fromOrThrow<N extends number>(value: From, byteLength: N): ZeroHexString<N> {
      return ZeroHexString.Length.asOrThrow(ZeroHexAsBytes.fromOrThrow(value), byteLength)
    }

  }

}

export type TextLike =
  | string
  | Uint8Array
  | ZeroHexString

/**
 * Decode an utf-8 string-like to a zero-hex string
 */
export namespace ZeroHexAsText {

  export type From = TextLike

  export function fromZeroHexOrThrow(value: ZeroHexString): ZeroHexString {
    return value
  }

  export function fromBytesOrThrow(value: Uint8Array): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(value)}` as ZeroHexString
  }

  export function fromStringOrThrow(value: string): ZeroHexString {
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
export namespace RawHexAsText {

  export type From = TextLike

  export function fromZeroHexOrThrow(value: ZeroHexString): RawHexString {
    return value.slice(2) as RawHexString
  }

  export function fromBytesOrThrow(value: Uint8Array): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString
  }

  export function fromStringOrThrow(value: string): RawHexString {
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
export namespace BytesAsText {

  export type From = TextLike

  export function fromBytesOrThrow(value: Uint8Array): Uint8Array {
    return value
  }

  export function fromZeroHexOrThrow(value: ZeroHexString): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2)))
  }

  export function fromStringOrThrow(value: string): Uint8Array {
    return Bytes.fromUtf8(value)
  }

  export function fromOrThrow(value: From): Uint8Array {
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
export namespace StringAsText {

  export type From = TextLike

  export function fromStringOrThrow(value: string): string {
    return value
  }

  export function fromBytesOrThrow(value: Uint8Array): string {
    return Bytes.toUtf8(value)
  }

  export function fromZeroHexOrThrow(value: ZeroHexString): string {
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))

    return Bytes.toUtf8(copiable.bytes)
  }

  export function fromOrThrow(from: From): string {
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)
    if (ZeroHexString.is(from))
      return fromZeroHexOrThrow(from)
    return fromStringOrThrow(from)
  }

}

export type IntegerLike =
  | string
  | bigint
  | number
  | Uint8Array
  | ZeroHexString

/**
 * Convert an integer-like to a bigint
 */
export namespace BigIntAsInteger {

  export type From = IntegerLike

  export function fromOrThrow(value: From): bigint {
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

  export function fromBigIntOrThrow(value: bigint): bigint {
    return value
  }

  export function fromNumberOrThrow(value: number): bigint {
    return BigInt(value)
  }

  export function fromZeroHexOrThrow(value: ZeroHexString): bigint {
    return BigInts.decodeZeroHex(value)
  }

  export function fromBytesOrThrow(value: Uint8Array): bigint {
    return BigInts.decodeRawHex(Base16.get().getOrThrow().encodeOrThrow(value))
  }

  export function fromStringOrThrow(value: string): bigint {
    return BigInts.decodeDecimal(value)
  }

}

/**
 * Convert an integer-like to a number
 */
export namespace NumberAsInteger {

  export type From = IntegerLike

  export function fromOrThrow(value: From): number {
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

  export function fromNumberOrThrow(value: number): number {
    return value
  }

  export function fromBigIntOrThrow(value: bigint): number {
    return Number(value)
  }

  export function fromZeroHexOrThrow(value: ZeroHexString): number {
    return Numbers.decodeZeroHex(value)
  }

  export function fromBytesOrThrow(value: Uint8Array): number {
    return Numbers.decodeRawHex(Base16.get().getOrThrow().encodeOrThrow(value))
  }

  export function fromStringOrThrow(value: string): number {
    return Numbers.decodeDecimal(value)
  }


}

/**
 * Convert an integer-like to a zero-hex string
 */
export namespace ZeroHexAsInteger {

  export type From = IntegerLike

  export function fromOrThrow(value: From): ZeroHexString {
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

  export function fromZeroHexOrThrow(value: ZeroHexString): ZeroHexString {
    return value
  }

  export function fromBigIntOrThrow(value: bigint): ZeroHexString {
    return `0x${value.toString(16)}` as ZeroHexString
  }

  export function fromNumberOrThrow(value: number): ZeroHexString {
    return `0x${value.toString(16)}` as ZeroHexString
  }

  export function fromBytesOrThrow(value: Uint8Array): ZeroHexString {
    return `0x${Base16.get().getOrThrow().encodeOrThrow(value)}` as ZeroHexString
  }

  export function fromStringOrThrow(value: string): ZeroHexString {
    return `0x${BigInts.decodeDecimal(value).toString(16)}` as ZeroHexString
  }

  export namespace Length {

    export function fromOrThrow<N extends number>(value: From, byteLength: N): ZeroHexString<N> {
      return ZeroHexString.Length.asOrThrow(ZeroHexAsInteger.fromOrThrow(value), byteLength)
    }

  }

}

/**
 * Convert an integer-like to a raw-hex string
 */
export namespace RawHexAsInteger {

  export type From = IntegerLike

  export function fromOrThrow(value: From): RawHexString {
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


  export function fromZeroHexOrThrow(value: ZeroHexString): RawHexString {
    return value.slice(2) as RawHexString
  }

  export function fromBigIntOrThrow(value: bigint): RawHexString {
    return value.toString(16) as RawHexString
  }

  export function fromNumberOrThrow(value: number): RawHexString {
    return value.toString(16) as RawHexString
  }

  export function fromBytesOrThrow(value: Uint8Array): RawHexString {
    return Base16.get().getOrThrow().encodeOrThrow(value) as RawHexString
  }

  export function fromStringOrThrow(value: string): RawHexString {
    return BigInts.decodeDecimal(value).toString(16) as RawHexString
  }


  export namespace Length {

    export function fromOrThrow<N extends number>(value: From, byteLength: N): RawHexString<N> {
      return RawHexString.Length.asOrThrow(RawHexAsInteger.fromOrThrow(value), byteLength)
    }

  }

}

/**
 * Convert an integer-like to bytes
 */
export namespace BytesAsInteger {

  export type From = IntegerLike

  export function fromOrThrow(value: From): Uint8Array {
    if (value instanceof Uint8Array)
      return value
    if (typeof value === "bigint")
      return fromBigIntOrThrow(value)
    if (typeof value === "number")
      return fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return fromStringOrThrow(value)
  }

  export function fromBigIntOrThrow(value: bigint): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.toString(16)))
  }

  export function fromNumberOrThrow(value: number): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.toString(16)))
  }

  export function fromZeroHexOrThrow(value: ZeroHexString): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2)))
  }

  export function fromStringOrThrow(value: string): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(BigInts.decodeDecimal(value).toString(16)))
  }

  export namespace Length {

    export function fromOrThrow<N extends number>(value: From, byteLength: N): Uint8Array<N> {
      return Bytes.castOrThrow(BytesAsInteger.fromOrThrow(value), byteLength)
    }

  }

}

export namespace CopiableBytesAsInteger {

  export type From = IntegerLike

  export function fromOrThrow(value: From): Copiable<Uint8Array> {
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

  export function fromBytesOrThrow(value: Uint8Array): Copiable<Uint8Array> {
    return new Copied(value)
  }

  export function fromBigIntOrThrow(value: bigint): Copiable<Uint8Array> {
    return Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.toString(16))
  }

  export function fromNumberOrThrow(value: number): Copiable<Uint8Array> {
    return Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.toString(16))
  }

  export function fromZeroHexOrThrow(value: ZeroHexString): Copiable<Uint8Array> {
    return Base16.get().getOrThrow().padStartAndDecodeOrThrow(value.slice(2))
  }

  export function fromStringOrThrow(value: string): Copiable<Uint8Array> {
    return Base16.get().getOrThrow().padStartAndDecodeOrThrow(BigInts.decodeDecimal(value).toString(16))
  }

  export namespace Length {

    export function fromOrThrow<N extends number>(value: From, byteLength: N): Copiable<Uint8Array<N>> {
      const copiable = CopiableBytesAsInteger.fromOrThrow(value)

      Bytes.castOrThrow(copiable.bytes, byteLength)

      return copiable as Copiable<Uint8Array<N>>
    }

  }

}

/**
 * Convert an integer-like to a string
 */
export namespace StringAsInteger {

  export type From = IntegerLike

  export function fromOrThrow(value: From): string {
    if (value instanceof Uint8Array)
      return fromBytesOrThrow(value)
    if (typeof value === "bigint")
      return fromBigIntOrThrow(value)
    if (typeof value === "number")
      return fromNumberOrThrow(value)
    if (ZeroHexString.is(value))
      return fromZeroHexOrThrow(value)
    return value
  }

  export function fromBigIntOrThrow(value: bigint): string {
    return value.toString()
  }

  export function fromNumberOrThrow(value: number): string {
    return value.toString()
  }

  export function fromZeroHexOrThrow(value: ZeroHexString): string {
    return BigInts.decodeZeroHex(value).toString()
  }

  export function fromBytesOrThrow(value: Uint8Array): string {
    return BigInts.decodeRawHex(Base16.get().getOrThrow().encodeOrThrow(value)).toString()
  }

}