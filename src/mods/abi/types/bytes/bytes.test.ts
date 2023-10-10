import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Box, Copied } from "@hazae41/box";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { DynamicBytes } from "./bytes.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("bytes", async ({ message, test }) => {
  const value = Bytes.tryRandom(123).unwrap()
  const abi = DynamicBytes.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Base16.get().tryEncode(new Box(new Copied(bytes))).unwrap())

  const abi2 = Readable.tryReadFromBytes(DynamicBytes, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(Bytes.equals2(value, value2))
})

