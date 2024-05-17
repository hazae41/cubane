import { ZeroHexString } from "../string/index.js";
import { Wrapped } from "./generic.js";
import { WrappedNumber } from "./number.js";
import { WrappedZeroHexString } from "./string.js";

export { WrappedBigInt as BigInt };

export class WrappedBigInt extends Wrapped<bigint> {

  constructor(
    readonly value: bigint
  ) {
    super()
  }

  toBigIntAsIntegerOrThrow() {
    return this.value
  }

  toWrappedBigIntAsIntegerOrThrow() {
    return this
  }

  toNumberAsIntegerOrThrow(): number {
    return Number(this.value)
  }

  toWrappedNumberAsIntegerOrThrow(): Wrapped<number> {
    return new WrappedNumber(this.toNumberAsIntegerOrThrow())
  }

  toZeroHexAsIntegerOrThrow(): ZeroHexString {
    return `0x${this.value.toString(16)}` as ZeroHexString
  }

  toWrappedZeroHexAsIntegerOrThrow(): Wrapped<ZeroHexString> {
    return new WrappedZeroHexString(this.toZeroHexAsIntegerOrThrow())
  }

}
