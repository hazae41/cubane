import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Address } from "./index.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("address", async ({ test }) => {
  assert(Address.String.is("0x0000000000000000000000000000000000000000"))
  assert(Address.String.is("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"))
  assert(Address.String.is("0x8C8D7C46219D9205f056f28fee5950aD564d7465"))

  assert(!Address.String.is("0x0"))
  // console.log(Address.from("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".toLowerCase()))
})