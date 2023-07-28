import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { assert, test } from "@hazae41/phobos";
import { Int, Int256, Int32 } from "./int.js";

test("int32", async ({ message, test }) => {
  const value = -123n * (Math.random() > 0.5 ? 1n : -1n)
  const abi = Int32.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(Int(32), bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})

test("int256", async ({ message, test }) => {
  const value = Bytes.toBigInt(Bytes.random(31)) * (Math.random() > 0.5 ? 1n : -1n)
  const abi = Int256.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(Int(256), bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})