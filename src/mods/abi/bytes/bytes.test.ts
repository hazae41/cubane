import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { assert, test } from "@hazae41/phobos";
import { Abi } from "index.js";

test("bytes", async ({ message, test }) => {
  const value = Bytes.tryRandom(123).unwrap()
  const abi = Abi.Bytes.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Bytes.toHex(bytes))

  const abi2 = Readable.tryReadFromBytes(Abi.Bytes, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(Bytes.equals2(value, value2))
})

