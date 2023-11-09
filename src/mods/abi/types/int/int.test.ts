import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { BigInts } from "libs/bigint/bigint.js";
import { StaticInt256, StaticInt32 } from "./int.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("int32", async ({ message, test }) => {
  const value = -123n * (Math.random() > 0.5 ? 1n : -1n)
  const abi = StaticInt32.create(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  // console.log(message, value)
  // console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(StaticInt32, bytes).unwrap()
  const value2 = abi2.intoOrThrow()

  // console.log(message, value2)

  assert(value === value2)
})

test("int256", async ({ message, test }) => {
  const random = Bytes.random(31)
  const value = BigInts.tryImport(random).unwrap() * (Math.random() > 0.5 ? 1n : -1n)
  const abi = StaticInt256.create(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  // console.log(message, value)
  // console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.tryReadFromBytes(StaticInt256, bytes).unwrap()
  const value2 = abi2.intoOrThrow()

  // console.log(message, value2)

  assert(value === value2)
})