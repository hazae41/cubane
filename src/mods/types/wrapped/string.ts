import { BigInts } from "libs/bigint/bigint.js"
import { RawHexString, ZeroHexString } from "../string/index.js"
import { WrappedBigInt } from "./bigint.js"
import { Wrapped } from "./generic.js"

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

}