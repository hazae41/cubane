import { Base16 } from "@hazae41/base16";
import { benchSync } from "@hazae41/deimos";
import { Keccak256 } from "@hazae41/keccak256";
import * as viem from "viem";
import { namehashOrThrow } from "./index.js";

// @ts-ignore
import * as ens from "@ensdomains/eth-ens-namehash";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

if (false) {
  const selfResult = benchSync("cubane", () => {
    namehashOrThrow("hello.world.eth")
  }, { samples: 10000, warmup: true })

  const viemResult = benchSync("viem", () => {
    viem.namehash("hello.world.eth")
  }, { samples: 10000, warmup: true })

  const ensResult = benchSync("ens", () => {
    ens.hash("hello.world.eth")
  }, { samples: 10000, warmup: true })

  selfResult.tableAndSummary(viemResult, ensResult)
}