import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { BigInts } from "libs/bigint/bigint.js";
import { Uint256, Uint32 } from "./uint.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

test("uint32", async ({ message, test }) => {
  const value = 123
  const abi = Uint32.create(value)
  const bytes = Writable.writeToBytesOrThrow(abi)

  // console.log(message, value)
  // console.log(message, Base16.get().getOrThrow().tryEncode(bytes).unwrap())

  const abi2 = Readable.readFromBytesOrThrow(Uint32, bytes)
  const value2 = abi2.intoOrThrow()

  // console.log(message, value2)

  assert(BigInt(value) === value2)
})

test("uint256", async ({ message, test }) => {
  const random = Bytes.random(32)
  const value = BigInts.importOrThrow(random)
  const abi = Uint256.fromOrThrow(value)
  const bytes = Writable.writeToBytesOrThrow(abi)

  // console.log(message, value)
  // console.log(message, Base16.get().getOrThrow().tryEncode(bytes).unwrap())

  const abi2 = Readable.readFromBytesOrThrow(Uint256, bytes)
  const value2 = abi2.intoOrThrow()

  // console.log(message, value2)

  assert(value === value2)
})