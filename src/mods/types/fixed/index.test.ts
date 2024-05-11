import { assert, test } from "@hazae41/phobos"
import { Fixed } from "./index.js"

test("fixed", async () => {
  // console.log(new Fixed(BigInt("000123000000000000000000"), 18).toString())

  assert(Fixed.fromString("0.1", 2).value === 10n)
  assert(Fixed.fromString(".1", 2).value === 10n)
  assert(Fixed.fromString(".", 2).value === 0n)
  assert(Fixed.fromString("0", 2).value === 0n)

  assert(Fixed.fromString("0.1", 2).toString() === "0.1")
  assert(Fixed.fromString(".1", 2).toString() === "0.1")

  assert(Fixed.fromString("1", 2).toString() === "1")
  assert(Fixed.fromString("1.0", 2).toString() === "1")
  assert(Fixed.fromString("1.00", 2).toString() === "1")

  assert(Fixed.fromString("123.456", 18).round().toString() === "123")
  assert(Fixed.fromString("123.456", 18).floor().toString() === "123")
  assert(Fixed.fromString("123.456", 18).ceil().toString() === "124")

  assert(Fixed.fromString("123.654", 18).round().toString() === "124")
  assert(Fixed.fromString("123.654", 18).floor().toString() === "123")
  assert(Fixed.fromString("123.654", 18).ceil().toString() === "124")

  assert(Fixed.fromString("0x123", 18).value === 0x123n)
})