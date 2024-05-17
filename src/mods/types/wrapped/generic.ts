import { RawHexString, ZeroHexString } from "../string/index.js"
import { WrappedBigInt } from "./bigint.js"
import { WrappedBytes } from "./bytes.js"
import { WrappedNumber } from "./number.js"
import { WrappedString, WrappedZeroHexString } from "./string.js"

export namespace Wrapped {

  export type From =
    | string
    | bigint
    | number
    | Uint8Array
    | Wrapped<unknown>

}

export abstract class Wrapped<T> {
  abstract readonly value: T

  abstract toBigIntAsIntegerOrThrow(): bigint
  abstract toWrappedBigIntAsIntegerOrThrow(): Wrapped<bigint>

  abstract toNumberAsIntegerOrThrow(): number
  abstract toWrappedNumberAsIntegerOrThrow(): Wrapped<number>

  abstract toZeroHexAsIntegerOrThrow(): ZeroHexString
  abstract toWrappedZeroHexAsIntegerOrThrow(): Wrapped<ZeroHexString>

  abstract toBytesAsIntegerOrThrow(): Uint8Array
  abstract toWrappedBytesAsIntegerOrThrow(): Wrapped<Uint8Array>

  abstract toStringAsIntegerOrThrow(): string
  abstract toWrappedStringAsIntegerOrThrow(): Wrapped<string>

  abstract toRawHexAsIntegerOrThrow(): RawHexString
  abstract toWrappedRawHexAsIntegerOrThrow(): Wrapped<RawHexString>

  abstract toBytesAsUtf8OrThrow(): Uint8Array
  abstract toWrappedBytesAsUtf8OrThrow(): Wrapped<Uint8Array>

  abstract toZeroHexAsUtf8OrThrow(): ZeroHexString
  abstract toWrappedZeroHexAsUtf8OrThrow(): Wrapped<ZeroHexString>

  static fromOrThrow(value: Wrapped.From) {
    if (value instanceof Wrapped)
      return value
    if (value instanceof Uint8Array)
      return new WrappedBytes(value)
    if (typeof value === "bigint")
      return new WrappedBigInt(value)
    if (typeof value === "number")
      return new WrappedNumber(value)
    if (ZeroHexString.String.is(value))
      return new WrappedZeroHexString(value)
    return new WrappedString(value)
  }

}

/**
 * Decode an utf-8 string-like to a zero-hex string
 */
export namespace ZeroHexAsUtf8 {

  export type From = Wrapped.From

  export function fromAndWrapOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toWrappedZeroHexAsUtf8OrThrow()
  }

  export function fromOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toZeroHexAsUtf8OrThrow()
  }

}

/**
 * Decode an utf-8 string-like to bytes
 */
export namespace BytesAsUtf8 {

  export type From = Wrapped.From

  export function fromAndWrapOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toWrappedBytesAsUtf8OrThrow()
  }

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toBytesAsUtf8OrThrow()
  }

}

/**
 * Convert an integer-like to a bigint
 */
export namespace BigIntAsInteger {

  export type From = Wrapped.From

  export function fromAndWrapOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedBigIntAsIntegerOrThrow()
  }

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toBigIntAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to a number
 */
export namespace NumberAsInteger {

  export type From = Wrapped.From

  export function fromAndWrapOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedNumberAsIntegerOrThrow()
  }

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toNumberAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to a zero-hex string
 */
export namespace ZeroHexAsInteger {

  export type From = Wrapped.From

  export function fromAndWrapOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toWrappedZeroHexAsIntegerOrThrow()
  }

  export function fromOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toZeroHexAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to a raw-hex string
 */
export namespace RawHexAsInteger {

  export type From = Wrapped.From

  export function fromAndWrapOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedRawHexAsIntegerOrThrow()
  }

  export function fromOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toRawHexAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to bytes
 */
export namespace BytesAsInteger {

  export type From = Wrapped.From

  export function fromAndWrapOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedBytesAsIntegerOrThrow()
  }

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toBytesAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to a decimal string
 */
export namespace StringAsInteger {

  export type From = Wrapped.From

  export function fromAndWrapOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedStringAsIntegerOrThrow()
  }

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toStringAsIntegerOrThrow()
  }

}