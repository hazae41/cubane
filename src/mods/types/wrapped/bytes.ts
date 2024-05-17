import { Base16 } from "@hazae41/base16"
import { BigInts } from "libs/bigint/bigint.js"
import { WrappedBigInt } from "./bigint.js"
import { Wrapped } from "./generic.js"

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

}