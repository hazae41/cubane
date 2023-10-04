import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { tryNamehash } from "./index.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

function namehash(name: string) {
  return "0x" + Base16.get().tryEncode(tryNamehash(name).unwrap()).unwrap()
}

test("ens", async () => {
  assert(namehash("") === "0x0000000000000000000000000000000000000000000000000000000000000000")
  assert(namehash("eth") === "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae")
  assert(namehash("alice.eth") === "0x787192fc5378cc32aa956ddfdedbf26b24e8d78e40109add0eea2c1a012c3dec")
  assert(namehash("its.a.test.lol.eth") === "0x61d39393e17dec1ceab75d6a06e6e715b8271cd0e93e0949e12db1e92f077189")
  assert(namehash("hello.world.eth") === "0xb6561cd3dc373d2bc592e2444182153bc8d4b9059e7b3b6e8d2b6d743a8b6b39")
})