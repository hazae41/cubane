import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { assert, test } from "@hazae41/phobos";
import { Address } from "./address.js";

test("address", async ({ message, test }) => {
  const value = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  const abi = Address.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(Address, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value.toLowerCase() === value2.toLowerCase())
})