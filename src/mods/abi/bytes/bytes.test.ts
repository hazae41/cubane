import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { assert, test } from "@hazae41/phobos";
import { DynamicBytes } from "./bytes.js";

test("bytes", async ({ message, test }) => {
  const value = Bytes.tryRandom(123).unwrap()
  const abi = DynamicBytes.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(DynamicBytes, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(Bytes.equals2(value, value2))
})

