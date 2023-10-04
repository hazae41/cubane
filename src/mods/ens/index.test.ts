import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";
import { test } from "@hazae41/phobos";
import { namehash } from "./index.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("ens", async () => {
  console.log(namehash("alice.eth"))
  console.log(namehash("its.a.test.lol.eth"))
})