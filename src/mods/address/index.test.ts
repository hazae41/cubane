import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { AddressString } from "./index.js";

await Sha3Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))

test("address", async ({ test }) => {
  assert(AddressString.is("0x0000000000000000000000000000000000000000"))
  assert(AddressString.is("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"))
  assert(AddressString.is("0x8C8D7C46219D9205f056f28fee5950aD564d7465"))

  assert(!AddressString.is("0x0"))
  // console.log(Address.from("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".toLowerCase()))
})