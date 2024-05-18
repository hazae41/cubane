import { Base16 } from "@hazae41/base16"
import { BigInts } from "libs/bigint/bigint.js"
import { Numbers } from "libs/number/number.js"
import { RawHexString, ZeroHexString } from "../string/index.js"
import { WrappedBigInt } from "./bigint.js"
import { Wrapped } from "./generic.js"
import { WrappedNumber } from "./number.js"
import { WrappedRawHexString, WrappedString, WrappedZeroHexString } from "./string.js"

export { WrappedBytes as Bytes }

export class WrappedBytes extends Wrapped<Uint8Array> {

  constructor(
    readonly value: Uint8Array
  ) {
    super()
  }

  toBigIntAsIntegerOrThrow() {
    return BigInts.decodeRawHex(Base16.get().encodeOrThrow(this.value))
  }

  toWrappedBigIntAsIntegerOrThrow() {
    return new WrappedBigInt(this.toBigIntAsIntegerOrThrow())
  }

  toNumberAsIntegerOrThrow(): number {
    return Numbers.decodeRawHex(Base16.get().encodeOrThrow(this.value))
  }

  toWrappedNumberAsIntegerOrThrow(): Wrapped<number> {
    return new WrappedNumber(this.toNumberAsIntegerOrThrow())
  }

  toZeroHexAsIntegerOrThrow(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  toWrappedZeroHexAsIntegerOrThrow(): Wrapped<ZeroHexString> {
    return new WrappedZeroHexString(this.toZeroHexAsIntegerOrThrow())
  }

  toBytesAsIntegerOrThrow(): Uint8Array {
    return this.value
  }

  toWrappedBytesAsIntegerOrThrow(): Wrapped<Uint8Array> {
    return this
  }

  toStringAsIntegerOrThrow(): string {
    return BigInts.decodeRawHex(Base16.get().encodeOrThrow(this.value)).toString()
  }

  toWrappedStringAsIntegerOrThrow(): Wrapped<string> {
    return new WrappedString(this.toStringAsIntegerOrThrow())
  }

  toRawHexAsIntegerOrThrow() {
    return Base16.get().encodeOrThrow(this.value) as RawHexString
  }

  toWrappedRawHexAsIntegerOrThrow() {
    return new WrappedRawHexString(this.toRawHexAsIntegerOrThrow())
  }

  toBytesAsUtf8OrThrow(): Uint8Array {
    return this.value
  }

  toWrappedBytesAsUtf8OrThrow(): Wrapped<Uint8Array> {
    return this
  }

  toZeroHexAsUtf8OrThrow(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  toWrappedZeroHexAsUtf8OrThrow(): Wrapped<ZeroHexString> {
    return new WrappedZeroHexString(this.toZeroHexAsUtf8OrThrow())
  }

  toRawHexAsUtf8OrThrow(): RawHexString {
    return Base16.get().encodeOrThrow(this.value) as RawHexString
  }

  toWrappedRawHexAsUtf8OrThrow(): Wrapped<RawHexString> {
    return new WrappedRawHexString(this.toRawHexAsUtf8OrThrow())
  }

}