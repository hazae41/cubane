import "@hazae41/symbol-dispose-polyfill";

import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { Secp256k1 } from "@hazae41/secp256k1";
import { ethers } from "ethers";
import { Address } from "../address/index.js";
import { ExtPrivateKey, ExtPublicKey } from "./index.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())
Secp256k1.set(await Secp256k1.fromEligos())

test("wasm sign unsafe message", async ({ }) => {
  const signer = new ExtPrivateKey(Secp256k1.get().PrivateKey.randomOrThrow())
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

  const privateKeyWasm = new ExtPrivateKey(Secp256k1.get().PrivateKey.importOrThrow(privateKey))

  const signatureWasm = privateKeyWasm.signPersonalMessageOrThrow(message)
  const signatureBytes = signatureWasm.value.exportOrThrow().copyAndDispose()
  const signatureZeroHex = `0x${Base16.get().getOrThrow().encodeOrThrow(signatureBytes)}`

  /* Ignore recovery part */
  assert(ethersSignatureZeroHex.slice(0, -2) === signatureZeroHex.slice(0, -2))

  assert(ethersWallet.address === ethers.verifyMessage(message, signatureZeroHex))

  const recoveredPublicKeyWasm = ExtPublicKey.recoverPersonalMessageOrThrow(message, signatureWasm)
  const recoveredPublicKeyBytes = recoveredPublicKeyWasm.value.exportUncompressedOrThrow().copyAndDispose()
  const recoveredAddressZeroHex = Address.computeOrThrow(recoveredPublicKeyBytes)

  assert(ethersWallet.address === recoveredAddressZeroHex)
})