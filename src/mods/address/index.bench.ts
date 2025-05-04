import { Base16 } from "@hazae41/base16";
import { benchSync } from "@hazae41/deimos";
import { Keccak256 } from "@hazae41/keccak256";
import * as viem from "viem";

// @ts-ignore
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { ethers } from "ethers";
import { Address } from "./index.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

if (false) {
  const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  const options = { samples: 10_000, warmup: true }

  const selfResult = benchSync("cubane", () => {
    Address.fromOrNull(address)
  }, options)

  const viemResult = benchSync("viem", () => {
    viem.getAddress(address)
  }, options)

  const ensResult = benchSync("ethers", () => {
    ethers.getAddress(address)
  }, options)

  selfResult.tableAndSummary(viemResult, ensResult)
}