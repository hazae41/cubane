import { assert, test } from "@hazae41/phobos"
import { Fixed } from "./index.js"

test("fixed", async () => {
  // console.log(new Fixed(BigInt("000123000000000000000000"), 18).toString())

  assert(Fixed.fromDecimalString("0.1", 2).value === 10n)
  assert(Fixed.fromDecimalString(".1", 2).value === 10n)
  assert(Fixed.fromDecimalString(".", 2).value === 0n)
  assert(Fixed.fromDecimalString("0", 2).value === 0n)

  assert(Fixed.fromDecimalString("0.1", 2).toDecimalString() === "0.1")
  assert(Fixed.fromDecimalString(".1", 2).toDecimalString() === "0.1")

  assert(Fixed.fromDecimalString("1", 2).toDecimalString() === "1")
  assert(Fixed.fromDecimalString("1.0", 2).toDecimalString() === "1")
  assert(Fixed.fromDecimalString("1.00", 2).toDecimalString() === "1")

  assert(Fixed.fromDecimalString("123.456", 18).round().toDecimalString() === "123")
  assert(Fixed.fromDecimalString("123.456", 18).floor().toDecimalString() === "123")
  assert(Fixed.fromDecimalString("123.456", 18).ceil().toDecimalString() === "124")

  assert(Fixed.fromDecimalString("123.654", 18).round().toDecimalString() === "124")
  assert(Fixed.fromDecimalString("123.654", 18).floor().toDecimalString() === "123")
  assert(Fixed.fromDecimalString("123.654", 18).ceil().toDecimalString() === "124")

  assert(Fixed.fromDecimalString("0x123", 18).value === 0x123n)
})