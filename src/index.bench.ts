import "@hazae41/symbol-dispose-polyfill";

export * from "./mods/index.bench.js";

import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { benchSync } from "@hazae41/deimos";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { ethers } from "ethers";
import { Rlp } from "index.js";
import { Copiable } from "libs/copiable/index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { FunctionSignature } from "mods/abi/index.js";
import * as viem from "viem";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

/**
 * Is uint32 faster than uint8?
 */
if (false) {
  const bytes = Bytes.random(128)

  const options = { samples: 5000, warmup: true } as const

  const uint32 = benchSync("uint32", () => {
    const cursor = new Cursor(bytes)
    const x = cursor.getUint32OrThrow()
  }, options)

  const uint8 = benchSync("uint8", () => {
    const cursor = new Cursor(bytes)
    const x = cursor.bytes[cursor.offset]
  }, options)

  uint32.tableAndSummary(uint8)
}

/**
 * Encode various types with preparsed ABI
 */
if (true) {
  const factory = FunctionSignature.parseOrThrow("f(bool,uint256,string,(bool,uint256,string),bytes)")

  const viemAbi = viem.parseAbiParameters("bool a, uint256 b, string c, (bool a, uint256 b, string c) d, bytes e")
  const ethersAbi = ["bool a", "uint256 b", "string c", "tuple(bool a, uint256 b, string c) d", "bytes e"]

  const random = Bytes.random(128)

  const options = { samples: 10000, warmup: true } as const

  const benchCubaneHex = benchSync("cubane (hex)", ({ message }) => {
    const hex = factory.args.fromOrThrow([true, 123456789n, "hello world", [true, 123456789n, "hello world"], random]).encodeOrThrow()
    // console.log(message, hex)
    const args = factory.args.decodeOrThrow(new TextCursor(hex))
    // console.log(args.args.inner)
  }, options)

  const benchCubaneBytes = benchSync("cubane (bytes)", ({ message }) => {
    const instance = factory.args.fromOrThrow([true, 123456789n, "hello world", [true, 123456789n, "hello world"], random])
    const bytes = Writable.writeToBytesOrThrow(instance)
    // const hex = hexlify(bytes)
    // console.log(message, hex)
    const args = Readable.readFromBytesOrThrow(factory.args, bytes)
    // console.log(args.args.inner)
  }, options)

  const benchViem = benchSync("viem", ({ message }) => {
    const hex = viem.encodeAbiParameters(viemAbi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, viem.bytesToHex(random)])
    // console.log(message, hex)
    const [a, b, c, d, e] = viem.decodeAbiParameters(viemAbi, hex)
    // const e2 = hexToBytes(e)
    // console.log(a, b, c, d, e2)
  }, options)

  const benchEthers = benchSync("ethers", ({ message }) => {
    const hex = ethers.AbiCoder.defaultAbiCoder().encode(ethersAbi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, random])
    ethers.AbiCoder.defaultAbiCoder().decode(ethersAbi, hex)
    // console.log(message, hex)
  }, options)

  benchCubaneBytes.table(benchCubaneHex, benchViem, benchEthers)

  benchCubaneHex.summary(benchViem, benchEthers)
  benchCubaneBytes.summary(benchViem, benchEthers)
}

/**
 * RLP encoding a transaction with various pre-ABI-encoded types
 */
if (false) {
  const abi = FunctionSignature.parseOrThrow("f(bool,uint256,string,address)")

  const txhex = ethers.Transaction.from({
    type: 0,
    value: 1n * (10n ** 18n),
    data: `0x${abi.fromOrThrow(true, 1n * (10n ** 18n), "hello world", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045").encodeOrThrow()}`,
    gasLimit: 1n * (10n ** 18n),
    gasPrice: 1n * (10n ** 18n),
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    chainId: 1n,
    nonce: 1,
  }).unsignedSerialized.slice(2)

  const tx = Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(txhex))

  const rlp = Readable.readFromBytesOrThrow(Rlp, tx).intoOrThrow() as Uint8Array[]
  // const rlp = crypto.getRandomValues(new Uint8Array(4096))

  // const rlphex = ethers.hexlify(rlp) as ZeroHexString
  // const rlphex = rlp.map(x => ethers.hexlify(x)) as ZeroHexString[]

  const options = { samples: 10000, warmup: true } as const

  console.log("Benching RLP bytes->hex")

  const rlpStruct = Rlp.fromOrThrow(rlp)

  const benchCubaneBytes = benchSync("cubane", () => {
    const bytes = Writable.writeToBytesOrThrow(rlpStruct)
    const hex = Base16.get().getOrThrow().encodeOrThrow(bytes)
  }, options)

  const benchViem = benchSync("viem", () => {
    const hex = viem.toRlp(rlp, "hex")
    // const rlp2 = viem.fromRlp(hex, "hex")
  }, options)

  const benchEthers = benchSync("ethers", () => {
    // const rlphex = ethers.hexlify(rlp)
    const rlphex = rlp.map(x => ethers.hexlify(x))
    const hex = ethers.encodeRlp(rlphex)
    // const rlp2 = (ethers.decodeRlp(hex) as ZeroHexString[]).map(x => ethers.getBytes(x))
    // const rlp2 = ethers.getBytes(ethers.decodeRlp(hex) as ZeroHexString)
  }, options)

  benchCubaneBytes.table(benchViem, benchEthers)
  benchCubaneBytes.summary(benchViem, benchEthers)
}

/**
 * RLP encoding a transaction with various pre-ABI-encoded types
 */
if (false) {
  const abi = FunctionSignature.parseOrThrow("f(bool,uint256,string,address,bytes)")

  const txhex = ethers.Transaction.from({
    type: 0,
    value: 1n * (10n ** 18n),
    data: `0x${abi.fromOrThrow(true, 1n * (10n ** 18n), "hello world", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", Bytes.random(1024)).encodeOrThrow()}`,
    gasLimit: 1n * (10n ** 18n),
    gasPrice: 1n * (10n ** 18n),
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    chainId: 1n,
    nonce: 1,
  }).unsignedSerialized.slice(2)

  const tx = Copiable.copyAndDispose(Base16.get().getOrThrow().padStartAndDecodeOrThrow(txhex))

  const rlp = Readable.readFromBytesOrThrow(Rlp, tx).intoOrThrow() as Uint8Array[]
  // const rlp = crypto.getRandomValues(new Uint8Array(4096))

  // const rlphex = ethers.hexlify(rlp) as ZeroHexString
  // const rlphex = rlp.map(x => ethers.hexlify(x)) as ZeroHexString[]

  const options = { samples: 10000, warmup: true } as const

  console.log("Benching RLP bytes->bytes")

  const rlpStruct = Rlp.fromOrThrow(rlp)

  const benchCubaneBytes = benchSync("cubane", () => {
    const bytes = Writable.writeToBytesOrThrow(rlpStruct)
  }, options)

  const benchViem = benchSync("viem", () => {
    const bytes = viem.toRlp(rlp, "bytes")
    // const rlp2 = viem.fromRlp(bytes, "bytes")
  }, options)

  const benchEthers = benchSync("ethers", () => {
    // const rlphex = ethers.hexlify(rlp)
    const rlphex = rlp.map(x => ethers.hexlify(x))
    const bytes = ethers.getBytes(ethers.encodeRlp(rlphex))
    // const rlp2 = (ethers.decodeRlp(bytes) as ZeroHexString[]).map(x => ethers.getBytes(x))
    // const rlp2 = ethers.getBytes(ethers.decodeRlp(bytes) as ZeroHexString)
  }, options)

  benchCubaneBytes.table(benchViem, benchEthers)
  benchCubaneBytes.summary(benchViem, benchEthers)
}