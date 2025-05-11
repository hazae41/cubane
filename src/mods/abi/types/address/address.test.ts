import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { AddressString } from "mods/address/index.js";
import { AbiAddress } from "./address.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

test("address", async ({ message, test }) => {
  const value = AddressString.fromOrThrow("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")

  const abi = AbiAddress.fromOrThrow(value)
  const bytes = Writable.writeToBytesOrThrow(abi)

  const abi2 = Readable.readFromBytesOrThrow(AbiAddress, bytes)
  const value2 = AddressString.fromOrThrow(abi2.intoOrThrow())

  assert(value.toLowerCase() === value2.toLowerCase())
})