import { WrappedBigInt } from "./bigint.js"
import { Wrapped } from "./generic.js"

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

}