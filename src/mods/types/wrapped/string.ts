import { Base16 } from "@hazae41/base16"
import { BigInts } from "libs/bigint/bigint.js"
import { Numbers } from "libs/number/number.js"
import { RawHexString, ZeroHexString } from "../string/index.js"
import { WrappedBigInt } from "./bigint.js"
import { WrappedBytes } from "./bytes.js"
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

  toBytesAsIntegerOrThrow(): Uint8Array {
    return Base16.get().padStartAndDecodeOrThrow(this.value.slice(2)).copyAndDispose()
  }

  toWrappedBytesAsIntegerOrThrow(): Wrapped<Uint8Array> {
    return new WrappedBytes(this.toBytesAsIntegerOrThrow())
  }

  toStringAsIntegerOrThrow(): string {
    return BigInts.decodeZeroHex(this.value).toString()
  }

  toWrappedStringAsIntegerOrThrow(): Wrapped<string> {
    return new WrappedString(this.toStringAsIntegerOrThrow())
  }

  toRawHexAsIntegerOrThrow(): RawHexString {
    return this.value.slice(2) as RawHexString
  }

  toWrappedRawHexAsIntegerOrThrow(): Wrapped<RawHexString> {
    return new WrappedRawHexString(this.toRawHexAsIntegerOrThrow())
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

  toBytesAsIntegerOrThrow(): Uint8Array {
    return Base16.get().padStartAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toWrappedBytesAsIntegerOrThrow(): Wrapped<Uint8Array> {
    return new WrappedBytes(this.toBytesAsIntegerOrThrow())
  }

  toStringAsIntegerOrThrow(): string {
    return BigInts.decodeRawHex(this.value).toString()
  }

  toWrappedStringAsIntegerOrThrow(): Wrapped<string> {
    return new WrappedString(this.toStringAsIntegerOrThrow())
  }

  toRawHexAsIntegerOrThrow() {
    return this.value
  }

  toWrappedRawHexAsIntegerOrThrow() {
    return this
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

  toBytesAsIntegerOrThrow(): Uint8Array {
    return Base16.get().padStartAndDecodeOrThrow(BigInts.decodeDecimal(this.value).toString(16)).copyAndDispose()
  }

  toWrappedBytesAsIntegerOrThrow(): Wrapped<Uint8Array> {
    return new WrappedBytes(this.toBytesAsIntegerOrThrow())
  }

  toStringAsIntegerOrThrow(): string {
    return this.value
  }

  toWrappedStringAsIntegerOrThrow(): Wrapped<string> {
    return this
  }

  toRawHexAsIntegerOrThrow() {
    return BigInts.decodeDecimal(this.value).toString(16) as RawHexString
  }

  toWrappedRawHexAsIntegerOrThrow() {
    return new WrappedRawHexString(this.toRawHexAsIntegerOrThrow())
  }

}