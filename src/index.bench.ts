import "@hazae41/symbol-dispose-polyfill";

import { Alocer } from "@hazae41/alocer";
import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { benchSync } from "@hazae41/deimos";
import { Keccak256 } from "@hazae41/keccak256";
import { Morax } from "@hazae41/morax";
import { ethers } from "ethers";
import { Rlp, ZeroHexString } from "index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { FunctionSignature, tryEncode } from "mods/abi/index.js";
import * as viem from "viem";
// import * as web3 from "web3";

await Alocer.initBundledOnce()
Base16.set(Base16.fromBufferOrAlocer(Alocer))

await Morax.initBundledOnce()
Keccak256.set(Keccak256.fromMorax(Morax))

/**
 * Is uint32 faster than uint8? Yes, slightly (at least on Node)
 */
if (false) {
  const bytes = Bytes.random(128)

  const options = { samples: 5000, warmup: true } as const

  const uint32 = benchSync("uint32", () => {
    const cursor = new Cursor(bytes)
    const x = cursor.tryGetUint32().unwrap()
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
if (false) {
  const factory = FunctionSignature.tryParse("f(bool,uint256,string,(bool,uint256,string),bytes)").unwrap()

  const viemAbi = viem.parseAbiParameters("bool a, uint256 b, string c, (bool a, uint256 b, string c) d, bytes e")
  const ethersAbi = ["bool a", "uint256 b", "string c", "tuple(bool a, uint256 b, string c) d", "bytes e"]
  const web3Abi = ["bool", "uint256", "string", "(bool, uint256, string)", "bytes"]

  const random = Bytes.random(128)

  const options = { samples: 10000, warmup: true } as const

  const benchCubaneHex = benchSync("cubane (hex)", ({ message }) => {
    const hex = factory.inner.from([true, 123456789n, "hello world", [true, 123456789n, "hello world"], random]).encode()
    // console.log(message, hex)
    const args = factory.inner.tryDecode(new TextCursor(hex)).unwrap()
    // console.log(args.args.inner)
  }, options)

  const benchCubaneBytes = benchSync("cubane (bytes)", ({ message }) => {
    const instance = factory.inner.from([true, 123456789n, "hello world", [true, 123456789n, "hello world"], random])
    const bytes = Writable.tryWriteToBytes(instance).unwrap()
    // const hex = hexlify(bytes)
    // console.log(message, hex)
    const args = Readable.tryReadFromBytes(factory.inner, bytes).unwrap()
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

  // const benchWeb3 = benchSync("web3", ({ message }) => {
  //   const hex = web3.eth.abi.encodeParameters(web3Abi, [true, "123456789", "hello world", [true, "123456789", "hello world"], web3.utils.bytesToHex(random)])
  //   // console.log(message, hex)
  // }, options)

  benchCubaneBytes.table(benchCubaneHex, benchViem, benchEthers)

  benchCubaneHex.summary(benchViem, benchEthers)
  benchCubaneBytes.summary(benchViem, benchEthers)
}

/**
 * RLP encoding a transaction with various pre-ABI-encoded types
 */
if (true) {

  const abi = FunctionSignature.tryParse("f(bool,uint256,string,address)").unwrap()

  const tx = ethers.Transaction.from({
    type: 0,
    value: 1n * (10n ** 18n),
    data: tryEncode(abi, true, 1n * (10n ** 18n), "hello world", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045").unwrap(),
    gasLimit: 1n * (10n ** 18n),
    gasPrice: 1n * (10n ** 18n),
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    chainId: 1n,
    nonce: 1,
  }).unsignedSerialized.slice(2)

  const txb = Base16.get().tryPadStartAndDecode(tx).unwrap().copy()
  const rlp = Rlp.tryReadFromBytes(txb).unwrap()

  // const random = crypto.getRandomValues(new Uint8Array(4096))

  const rlphex = (rlp as Uint8Array[]).map(ethers.hexlify) as ZeroHexString[]
  // const rlphex = ethers.hexlify(random)

  const options = { samples: 10000, warmup: true } as const

  const benchCubaneBytes = benchSync("cubane (bytes)", () => {
    const bytes = Rlp.tryWriteToBytes(rlp).unwrap()
    const hex = Base16.get().tryEncode(bytes).unwrap()
    // const bytes2 = Base16.get().tryPadStartAndDecode(hex).unwrap()
    // const random2 = RlpStringUint16.tryRead(new Cursor(bytes2.bytes)).unwrap()
    // bytes2[Symbol.dispose]()
  }, options)

  const benchViem = benchSync("viem", () => {
    const bytes = viem.toRlp(rlphex)
    // const random2 = viem.fromRlp(bytes, "hex")
  }, options)

  const benchEthers = benchSync("ethers", () => {
    const hex = ethers.encodeRlp(rlphex)
    // const random2 = ethers.decodeRlp(hex) as string
  }, options)

  benchCubaneBytes.table(benchViem, benchEthers)
  benchCubaneBytes.summary(benchViem, benchEthers)
}