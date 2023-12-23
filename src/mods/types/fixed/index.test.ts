import { assert, test } from "@hazae41/phobos"
import { Fixed } from "./index.js"

test("fixed", async () => {
  console.log(new Fixed(BigInt("000123000000000000000000"), 18).toString())

  assert(Fixed.fromString("0.1", 2).value === 10n)
  assert(Fixed.fromString(".1", 2).value === 10n)
  assert(Fixed.fromString(".", 2).value === 0n)
  assert(Fixed.fromString("0", 2).value === 0n)
  console.log(Fixed.fromString("123.456", 18).round().toString())
})