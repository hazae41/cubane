import { Alocer } from "@hazae41/alocer";
import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Morax } from "@hazae41/morax";
import { assert, test } from "@hazae41/phobos";
import { DynamicBytes } from "./bytes.js";

await Alocer.initBundledOnce()
Base16.set(Base16.fromAlocer(Alocer))

await Morax.initBundledOnce()
Keccak256.set(Keccak256.fromMorax(Morax))

test("bytes", async ({ message, test }) => {
  const value = Bytes.tryRandom(123).unwrap()
  const abi = DynamicBytes.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(DynamicBytes, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(Bytes.equals2(value, value2))
})

