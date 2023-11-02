import { Base16 } from "@hazae41/base16";
import { benchSync } from "@hazae41/deimos";
import { Keccak256 } from "@hazae41/keccak256";
import * as viem from "viem";

// @ts-ignore
import { ethers } from "ethers";
import { Address } from "./index.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

if (true) {
  const address = "0x8C8D7C46219D9205f056f28fee5950aD564d7465"

  const selfResult = benchSync("cubane", () => {
    Address.from(address)
  }, { samples: 10000, warmup: true })

  const viemResult = benchSync("viem", () => {
    viem.getAddress(address)
  }, { samples: 10000, warmup: true })

  const ensResult = benchSync("ens", () => {
    ethers.getAddress(address)
  }, { samples: 10000, warmup: true })

  selfResult.tableAndSummary(viemResult, ensResult)
}