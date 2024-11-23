import { BigInts } from "libs/bigint/bigint.js"
import { ZeroHexString } from "../string/index.js"

export interface ZeroHexFixedInit<D extends number = number> {
  readonly value: ZeroHexString,
  readonly decimals: D
}

export class ZeroHexFixedInit<D extends number = number> {
  constructor(
    readonly value: ZeroHexString,
    readonly decimals: D
  ) { }
}

export interface BigIntFixedInit<D extends number = number> {
  readonly value: bigint,
  readonly decimals: D
}

export class BigIntFixedInit<D extends number = number> {
  constructor(
    readonly value: bigint,
    readonly decimals: D
  ) { }
}

export namespace Fixed {

  export type From<D extends number = number> =
    | BigIntFixedInit<D>
    | ZeroHexFixedInit<D>

}

export class Fixed<D extends number = number> implements BigIntFixedInit {
  readonly tens: bigint

  constructor(
    readonly value: bigint,
    readonly decimals: D
  ) {
    this.tens = BigInts.tens(decimals)
  }

  static unit<D extends number = number>(decimals: D) {
    return new Fixed(BigInts.tens(decimals), decimals)
  }

  static from<D extends number = number>(init: Fixed.From<D>) {
    if (init instanceof Fixed)
      return init
    if (typeof init.value === "string")
      return Fixed.fromZeroHex(init.value, init.decimals)
    return new Fixed(init.value, init.decimals)
  }

  toJSON() {
    return new ZeroHexFixedInit(this.toZeroHex(), this.decimals)
  }

  static fromJSON(init: ZeroHexFixedInit) {
    return Fixed.fromZeroHex(init.value, init.decimals)
  }

  move<D extends number>(decimals: D) {
    if (this.decimals > decimals)
      return new Fixed(this.value / BigInts.tens(this.decimals - decimals), decimals)

    if (this.decimals < decimals)
      return new Fixed(this.value * BigInts.tens(decimals - this.decimals), decimals)

    return new Fixed(this.value, decimals)
  }

  div(other: Fixed) {
    return new Fixed((this.value * this.tens) / other.move(this.decimals).value, this.decimals)
  }

  mul(other: Fixed) {
    return new Fixed((this.value * other.move(this.decimals).value) / this.tens, this.decimals)
  }

  add(other: Fixed) {
    return new Fixed(this.value + other.move(this.decimals).value, this.decimals)
  }

  sub(other: Fixed) {
    return new Fixed(this.value - other.move(this.decimals).value, this.decimals)
  }

  floor() {
    return new Fixed(this.value - (this.value % this.tens), this.decimals)
  }

  ceil() {
    return new Fixed(this.value + (this.tens - (this.value % this.tens)), this.decimals)
  }

  round() {
    return new Fixed(this.value + (this.tens / 2n) - ((this.value + (this.tens / 2n)) % this.tens), this.decimals)
  }

  toZeroHex() {
    return BigInts.encodeZeroHex(this.value)
  }

  static fromZeroHex<D extends number>(value: ZeroHexString, decimals: D) {
    return new Fixed(BigInts.decodeZeroHex(value), decimals)
  }

  toString() {
    const raw = this.value.toString().padStart(this.decimals, "0")

    const whole = raw.slice(0, raw.length - this.decimals).replaceAll("0", " ").trimStart().replaceAll(" ", "0")
    const decimal = raw.slice(raw.length - this.decimals).replaceAll("0", " ").trimEnd().replaceAll(" ", "0")

    if (!decimal)
      return (whole || "0")

    return `${whole || "0"}.${decimal}`
  }

  static fromString<D extends number>(text: string, decimals: D) {
    const [whole = "0", decimal = "0"] = text.split(".")

    const value = BigInt(whole + decimal.padEnd(decimals, "0").slice(0, decimals))

    return new Fixed(value, decimals)
  }

  static fromStringOrZeroHex<D extends number>(text: string, decimals: D) {
    if (ZeroHexString.String.is(text))
      return Fixed.fromZeroHex(text, decimals)
    else
      return Fixed.fromString(text, decimals)
  }

}
