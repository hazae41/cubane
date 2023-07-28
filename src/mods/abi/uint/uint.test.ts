import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { assert, test } from "@hazae41/phobos";
import { Uint, Uint256, Uint32 } from "./uint.js";

test("uint32", async ({ message, test }) => {
  const value = 123n
  const abi = Uint32.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(Uint(32), bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})

test("uint256", async ({ message, test }) => {
  const value = Bytes.toBigInt(Bytes.random(32))
  const abi = Uint256.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(Uint(256), bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})