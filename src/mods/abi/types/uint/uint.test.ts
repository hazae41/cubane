import { Alocer } from "@hazae41/alocer";
import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Morax } from "@hazae41/morax";
import { assert, test } from "@hazae41/phobos";
import { BigInts } from "libs/bigint/bigint.js";
import { Uint256, Uint32 } from "./uint.js";

await Alocer.initBundledOnce()
Base16.set(Base16.fromAlocer(Alocer))

await Morax.initBundledOnce()
Keccak256.set(Keccak256.fromMorax(Morax))

test("uint32", async ({ message, test }) => {
  const value = 123
  const abi = Uint32.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(Uint32, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})

test("uint256", async ({ message, test }) => {
  const value = BigInts.tryImport(Bytes.random(32)).unwrap()
  const abi = Uint256.new(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(Uint256, bytes).unwrap()
  const value2 = abi2.value

  console.log(message, value2)

  assert(value === value2)
})