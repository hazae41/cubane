import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { StaticBool } from "./bool.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("bool true", async ({ message, test }) => {
  const value = true
  const abi = StaticBool.create(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  // console.log(message, value)
  // console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(StaticBool, bytes).unwrap()
  const value2 = abi2.value

  // console.log(message, value2)

  assert(value === value2)
})

test("bool false", async ({ message, test }) => {
  const value = false
  const abi = StaticBool.create(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  // console.log(message, value)
  // console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(StaticBool, bytes).unwrap()
  const value2 = abi2.value

  // console.log(message, value2)

  assert(value === value2)
})