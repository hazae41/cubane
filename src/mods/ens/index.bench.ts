import { Base16 } from "@hazae41/base16";
import { benchSync } from "@hazae41/deimos";
import { Keccak256 } from "@hazae41/keccak256";
import * as viem from "viem";
import { tryNamehash } from "./index.js";

// @ts-ignore
import * as ens from "@ensdomains/eth-ens-namehash";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

if (false) {
  function namehash(name: string) {
    const namehash = tryNamehash(name).unwrap()
    return "0x" + Base16.get().encodeOrThrow(namehash)
  }

  const selfResult = benchSync("cubane", () => {
    tryNamehash("hello.world.eth")
  }, { samples: 10000, warmup: true })

  const viemResult = benchSync("viem", () => {
    viem.namehash("hello.world.eth")
  }, { samples: 10000, warmup: true })

  const ensResult = benchSync("ens", () => {
    ens.hash("hello.world.eth")
  }, { samples: 10000, warmup: true })

  selfResult.tableAndSummary(viemResult, ensResult)
}