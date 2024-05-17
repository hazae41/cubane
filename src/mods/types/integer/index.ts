import { Wrapped } from "../wrapped/generic.js"

/**
 * Convert an integer-like to a bigint
 */
export namespace BigIntAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedBigIntAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to a number
 */
export namespace NumberAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedNumberAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to a zero-hex string
 */
export namespace ZeroHexAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toWrappedZeroHexAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to a raw-hex string
 */
export namespace RawHexAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(from: From) {
    return Wrapped.fromOrThrow(from).toWrappedRawHexAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to bytes
 */
export namespace BytesAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedBytesAsIntegerOrThrow()
  }

}

/**
 * Convert an integer-like to a decimal string
 */
export namespace StringAsInteger {

  export type From = Wrapped.From

  export function fromOrThrow(value: From) {
    return Wrapped.fromOrThrow(value).toWrappedStringAsIntegerOrThrow()
  }

}