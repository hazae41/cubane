import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { SigningKey } from "mods/secp256k1/index.js";
import { UnsignedTransaction2 } from "./index.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

{
  const key = SigningKey.randomOrThrow()

  const tx = UnsignedTransaction2.signOrThrow({
    chainId: 1n,
    nonce: 1n,
    maxPriorityFeePerGas: 1n,
    maxFeePerGas: 1n,
    gasLimit: 1n,
    to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    value: 1n,
  }, key).encodeZeroHexOrThrow()

  console.log(tx.value) // 0x02...
}

