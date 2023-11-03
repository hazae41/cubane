import { Base16 } from "@hazae41/base16";
import { benchSync } from "@hazae41/deimos";
import { Keccak256 } from "@hazae41/keccak256";
import * as viem from "viem";

// @ts-ignore
import { ethers } from "ethers";
import { Address } from "./index.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

if (false) {
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  const options = { samples: 10_000, warmup: true }

  const selfResult = benchSync("cubane", () => {
    Address.from(address)
  }, options)

  const viemResult = benchSync("viem", () => {
    viem.getAddress(address)
  }, options)

  const ensResult = benchSync("ethers", () => {
    ethers.getAddress(address)
  }, options)

  selfResult.tableAndSummary(viemResult, ensResult)
}