import { BigInts } from "libs/bigint/bigint.js"
import { Numbers } from "libs/number/number.js"
import { RawHexString, ZeroHexString } from "../string/index.js"
import { WrappedBigInt } from "./bigint.js"
import { Wrapped } from "./generic.js"
import { WrappedNumber } from "./number.js"

export class WrappedZeroHexString extends Wrapped<ZeroHexString> {

  constructor(
    readonly value: ZeroHexString
  ) {
    super()
  }

  toBigIntAsIntegerOrThrow() {
    return BigInts.decodeZeroHex(this.value)
  }

  toWrappedBigIntAsIntegerOrThrow() {
    return new WrappedBigInt(this.toBigIntAsIntegerOrThrow())
  }

  toNumberAsIntegerOrThrow(): number {
    return Numbers.decodeZeroHex(this.value)
  }

  toWrappedNumberAsIntegerOrThrow(): Wrapped<number> {
    return new WrappedNumber(this.toNumberAsIntegerOrThrow())
  }

  toZeroHexAsIntegerOrThrow() {
    return this.value
  }

  toWrappedZeroHexAsIntegerOrThrow() {
    return this
  }

}

export class WrappedRawHexString extends Wrapped<string> {

  constructor(
    readonly value: RawHexString
  ) {
    super()
  }

  toBigIntAsIntegerOrThrow() {
    return BigInts.decodeRawHex(this.value)
  }

  toWrappedBigIntAsIntegerOrThrow() {
    return new WrappedBigInt(this.toBigIntAsIntegerOrThrow())
  }

  toNumberAsIntegerOrThrow(): number {
    return Numbers.decodeRawHex(this.value)
  }

  toWrappedNumberAsIntegerOrThrow(): Wrapped<number> {
    return new WrappedNumber(this.toNumberAsIntegerOrThrow())
  }

  toZeroHexAsIntegerOrThrow(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  toWrappedZeroHexAsIntegerOrThrow(): Wrapped<ZeroHexString> {
    return new WrappedZeroHexString(this.toZeroHexAsIntegerOrThrow())
  }

}

export class WrappedString extends Wrapped<string> {

  constructor(
    readonly value: string
  ) {
    super()
  }

  toBigIntAsIntegerOrThrow() {
    return BigInts.decodeDecimal(this.value)
  }

  toWrappedBigIntAsIntegerOrThrow() {
    return new WrappedBigInt(this.toBigIntAsIntegerOrThrow())
  }

  toNumberAsIntegerOrThrow(): number {
    return Numbers.decodeDecimal(this.value)
  }

  toWrappedNumberAsIntegerOrThrow(): Wrapped<number> {
    return new WrappedNumber(this.toNumberAsIntegerOrThrow())
  }

  toZeroHexAsIntegerOrThrow(): ZeroHexString {
    return `0x${BigInts.decodeDecimal(this.value).toString(16)}` as ZeroHexString
  }

  toWrappedZeroHexAsIntegerOrThrow(): Wrapped<ZeroHexString> {
    return new WrappedZeroHexString(this.toZeroHexAsIntegerOrThrow())
  }

}