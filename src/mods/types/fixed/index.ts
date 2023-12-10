import { BigInts } from "libs/bigint/bigint.js"
import { ZeroHexString } from "../zerohex/index.js"

export interface ZeroHexFixedInit<D extends number = number> {
  readonly value: ZeroHexString,
  readonly decimals: D
}

export class ZeroHexFixed<D extends number = number> implements ZeroHexFixedInit {
  constructor(
    readonly value: ZeroHexString,
    readonly decimals: D
  ) { }
}

export interface FixedInit<D extends number = number> {
  readonly value: bigint,
  readonly decimals: D
}

export namespace Fixed {

  export type From<D extends number = number> =
    | FixedInit<D>
    | ZeroHexFixedInit<D>

}

export class Fixed<D extends number = number> implements FixedInit {
  readonly tens: bigint

  constructor(
    readonly value: bigint,
    readonly decimals: D
  ) {
    this.tens = BigInts.tens(decimals)
  }

  static from<D extends number = number>(init: Fixed.From<D>) {
    if (init instanceof Fixed)
      return init
    if (typeof init.value === "bigint")
      return new Fixed(init.value, init.decimals)
    return this.fromJSON(init)
  }

  toJSON() {
    const value = `0x${this.value.toString(16)}` satisfies ZeroHexString
    return new ZeroHexFixed(value, this.decimals)
  }

  static fromJSON(init: ZeroHexFixed) {
    const value = BigInt(init.value.slice(2))
    return new Fixed(value, init.decimals)
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

  toDecimalString() {
    const raw = this.value.toString().padStart(this.decimals, "0")
    const whole = raw.slice(0, raw.length - this.decimals).replaceAll("0", " ").trimStart().replaceAll(" ", "0")
    const decimal = raw.slice(raw.length - this.decimals).replaceAll("0", " ").trimEnd().replaceAll(" ", "0")
    return `${whole || "0"}.${decimal || "0"}`
  }

  static fromDecimalString<D extends number>(text: string, decimals: D) {
    const [whole = "0", decimal = "0"] = text.split(".")
    const value = BigInt(whole + decimal.padEnd(decimals, "0").slice(0, decimals))
    return new Fixed(value, decimals)
  }

}
