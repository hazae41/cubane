import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { AbiBool } from "./bool.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

test("bool true", async ({ message, test }) => {
  const value = true
  const abi = AbiBool.create(value)
  const bytes = Writable.writeToBytesOrThrow(abi)

  // console.log(message, value)
  // console.log(message, Base16.get().getOrThrow().tryEncode(bytes).unwrap())

  const abi2 = Readable.readFromBytesOrThrow(AbiBool, bytes)
  const value2 = abi2.value

  // console.log(message, value2)

  assert(value === value2)
})

test("bool false", async ({ message, test }) => {
  const value = false
  const abi = AbiBool.create(value)
  const bytes = Writable.writeToBytesOrThrow(abi)

  // console.log(message, value)
  // console.log(message, Base16.get().getOrThrow().tryEncode(bytes).unwrap())

  const abi2 = Readable.readFromBytesOrThrow(AbiBool, bytes)
  const value2 = abi2.value

  // console.log(message, value2)

  assert(value === value2)
})