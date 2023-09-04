import { Alocer } from "@hazae41/alocer";
import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Keccak256 } from "@hazae41/keccak256";
import { Morax } from "@hazae41/morax";
import { assert, test } from "@hazae41/phobos";
import { StaticBool } from "./bool.js";

await Alocer.initBundledOnce()
Base16.set(Base16.fromAlocer(Alocer))

await Morax.initBundledOnce()
Keccak256.set(Keccak256.fromMorax(Morax))

test("bool true", async ({ message, test }) => {
  const value = true
  const abi = StaticBool.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Base16.get().tryEncode(bytes).unwrap())

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
  console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(StaticBool, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})