import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { BigInts } from "libs/bigint/bigint.js";
import { Int256, Int32 } from "./int.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("int32", async ({ message, test }) => {
  const value = -123n * (Math.random() > 0.5 ? 1n : -1n)
  const abi = Int32.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(Int32, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})

test("int256", async ({ message, test }) => {
  const value = BigInts.tryImport(Bytes.tryRandom(31).unwrap()).unwrap() * (Math.random() > 0.5 ? 1n : -1n)
  const abi = Int256.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(Int256, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})