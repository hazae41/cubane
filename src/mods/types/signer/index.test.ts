import "@hazae41/symbol-dispose-polyfill";

import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { ethers } from "ethers";
import { Copiable } from "libs/copiable/index.js";
import { Address } from "../address/index.js";
import { ZeroHexSignature } from "../signature/index.js";
import { ExtPrivateKey, ExtPublicKey } from "./index.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

test("wasm sign unsafe message", async ({ }) => {
  const signer = new ExtPrivateKey(Secp256k1.get().getOrThrow().SigningKey.randomOrThrow())
  const identity = signer.getPublicKeyOrThrow()

  const message = "hello world"
  const signature = signer.signUnsafeMessageOrThrow(message)

  const verified = identity.verifyUnsafeMessageOrThrow(message, signature)

  assert(verified)
})

test("wasm sign personal message", async ({ }) => {
  const privateKey = Bytes.random(32)
  const message = "hello world"

  const ethersSigningKey = new ethers.SigningKey(privateKey)
  const ethersWallet = new ethers.Wallet(ethersSigningKey)
  const ethersSignatureZeroHex = await ethersWallet.signMessage(message)

  const privateKeyWasm = new ExtPrivateKey(Secp256k1.get().getOrThrow().SigningKey.importOrThrow(privateKey))

  const signatureWasm = privateKeyWasm.signPersonalMessageOrThrow(message)
  const signatureZeroHex = ZeroHexSignature.fromExtOrThrow(signatureWasm)

  /* Ignore recovery part */
  assert(ethersSignatureZeroHex.slice(0, -2) === signatureZeroHex.slice(0, -2))

  assert(ethersWallet.address === ethers.verifyMessage(message, signatureZeroHex))

  const recoveredPublicKeyWasm = ExtPublicKey.recoverPersonalMessageOrThrow(message, signatureWasm)
  const recoveredPublicKeyBytes = Copiable.copyAndDispose(recoveredPublicKeyWasm.value.exportUncompressedOrThrow())
  const recoveredAddressZeroHex = Address.computeOrThrow(recoveredPublicKeyBytes)

  assert(ethersWallet.address === recoveredAddressZeroHex)
})