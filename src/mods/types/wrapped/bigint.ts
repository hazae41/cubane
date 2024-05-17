import { Wrapped } from "./generic.js";

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

}
