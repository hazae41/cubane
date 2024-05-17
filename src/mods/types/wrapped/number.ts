import { ZeroHexString } from "../string/index.js"
import { WrappedBigInt } from "./bigint.js"
import { Wrapped } from "./generic.js"
import { WrappedZeroHexString } from "./string.js"

export { WrappedNumber as Number }

export class WrappedNumber extends Wrapped<number> {

  constructor(
    readonly value: number
  ) {
    super()
  }

  toBigIntAsIntegerOrThrow() {
    return BigInt(this.value)
  }

  toWrappedBigIntAsIntegerOrThrow() {
    return new WrappedBigInt(this.toBigIntAsIntegerOrThrow())
  }

  toNumberAsIntegerOrThrow(): number {
    return this.value
  }

  toWrappedNumberAsIntegerOrThrow(): Wrapped<number> {
    return this
  }

  toZeroHexAsIntegerOrThrow(): ZeroHexString {
    return `0x${this.value.toString(16)}` as ZeroHexString
  }

  toWrappedZeroHexAsIntegerOrThrow(): Wrapped<ZeroHexString> {
    return new WrappedZeroHexString(this.toZeroHexAsIntegerOrThrow())
  }

}