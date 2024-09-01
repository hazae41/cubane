import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { BigInts } from "libs/bigint/bigint.js";
import { Int256, Int32 } from "./int.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

test("int32", async ({ message, test }) => {
  const value = -123n * (Math.random() > 0.5 ? 1n : -1n)
  const abi = Int32.fromOrThrow(value)
  const bytes = Writable.writeToBytesOrThrow(abi)

  // console.log(message, value)
  // console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.readFromBytesOrThrow(Int32, bytes)
  const value2 = abi2.intoOrThrow()

  // console.log(message, value2)

  assert(value === value2)
})

test("int256", async ({ message, test }) => {
  const random = Bytes.random(31)
  const value = BigInts.importOrThrow(random) * (Math.random() > 0.5 ? 1n : -1n)
  const abi = Int256.fromOrThrow(value)
  const bytes = Writable.writeToBytesOrThrow(abi)

  // console.log(message, value)
  // console.log(message, Base16.get().tryEncode(bytes).unwrap())

  const abi2 = Readable.readFromBytesOrThrow(Int256, bytes)
  const value2 = abi2.intoOrThrow()

  // console.log(message, value2)

  assert(value === value2)
})