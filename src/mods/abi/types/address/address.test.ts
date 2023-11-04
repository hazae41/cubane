import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Address } from "index.js";
import { StaticAddress } from "./address.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("address", async ({ message, test }) => {
  const value = Address.fromOrThrow("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
  const abi = StaticAddress.from(value)
  const bytes = Writable.tryWriteToBytes(abi).unwrap()

  console.log(message, value)
  console.log(message, Base16.get().encodeOrThrow(bytes))

  const abi2 = Readable.tryReadFromBytes(StaticAddress, bytes).unwrap()
  const value2 = abi2.into()

  console.log(message, value2)

  assert(value.toLowerCase() === value2.toLowerCase())
})