import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { assert, test } from "@hazae41/phobos";
import { Int } from "./int.js";

test("int32", async ({ message, test }) => {
  const value = -123n * (Math.random() > 0.5 ? 1n : -1n)
  const uint = new (Int(32))(value)
  const bytes = Writable.tryWriteToBytes(uint).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const uint2 = Readable.tryReadFromBytes(Int(32), bytes).unwrap()
  const value2 = uint2.value

  console.log(message, value2)

  assert(value === value2)
})

test("int256", async ({ message, test }) => {
  const value = Bytes.toBigInt(Bytes.random(31)) * (Math.random() > 0.5 ? 1n : -1n)
  const uint = new (Int(256))(value)
  const bytes = Writable.tryWriteToBytes(uint).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const uint2 = Readable.tryReadFromBytes(Int(256), bytes).unwrap()
  const value2 = uint2.value

  console.log(message, value2)

  assert(value === value2)
})