import { assert, test } from "@hazae41/phobos"
import { Fixed } from "./index.js"

test("fixed", async () => {
  console.log(new Fixed(BigInt("000123000000000000000000"), 18).toDecimalString())

  assert(Fixed.fromDecimalString("0.1", 2).value === 10n)
  assert(Fixed.fromDecimalString(".1", 2).value === 10n)
  assert(Fixed.fromDecimalString(".", 2).value === 0n)
  assert(Fixed.fromDecimalString("0", 2).value === 0n)
})