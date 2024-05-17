import { Base16 } from "@hazae41/base16"
import { BigInts } from "libs/bigint/bigint.js"
import { Numbers } from "libs/number/number.js"
import { ZeroHexString } from "../string/index.js"
import { WrappedBigInt } from "./bigint.js"
import { Wrapped } from "./generic.js"
import { WrappedNumber } from "./number.js"
import { WrappedZeroHexString } from "./string.js"

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

}