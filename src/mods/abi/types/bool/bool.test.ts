import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { assert, test } from "@hazae41/phobos";
import { InvalidBoolValueError, StaticBool } from "./bool.js";

test("bool true", async ({ message, test }) => {
  const value = true
  const abi = StaticBool.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(StaticBool, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})

test("bool false", async ({ message, test }) => {
  const value = false
  const abi = StaticBool.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(StaticBool, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})

test("bool unknown", async ({ message, test }) => {
  const cursor = Cursor.tryAllocUnsafe(32).unwrap()
  cursor.offset += 31
  cursor.tryWriteUint8(123).unwrap()

  console.log(message, Bytes.toHex(cursor.bytes))

  const result = Readable.tryReadFromBytes(StaticBool, cursor.bytes)
  assert(result.isErrAndSync(e => e.name === InvalidBoolValueError.name))
})