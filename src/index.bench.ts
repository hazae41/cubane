import { Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { benchSync } from "@hazae41/deimos";
import { ethers } from "ethers";
import { FunctionSignature } from "mods/abi/signature/signature.js";
import { bytesToHex, encodeAbiParameters, parseAbiParameters } from "viem";
import { eth, utils } from "web3";

/**
 * Is uint32 faster than uint8? Yes, slightly (at least on Node)
 */
if (false) {
  const bytes = new Uint8Array([0, 0, 0, 1])

  const uint32 = benchSync("uint32", () => {
    const cursor = new Cursor(bytes)
    cursor.offset = 0
    const x = cursor.tryGetUint32().unwrap()
  })

  const uint8 = benchSync("uint8", () => {
    const cursor = new Cursor(bytes)
    cursor.offset = 3
    const x = cursor.tryGetUint8().unwrap()
  })

  uint32.tableAndSummary(uint8)
}

/**
 * Encode various types with preparsed ABI
 */
if (true) {
  const factory = FunctionSignature.tryParse("f(bool,bytes)").unwrap()

  const viemAbi = parseAbiParameters("bool a, uint256 b, string c, (bool a, uint256 b, string c) d, bytes e")
  const ethersAbi = ["bool a", "uint256 b", "string c", "tuple(bool a, uint256 b, string c) d", "bytes e"]
  const web3Abi = ["bool", "uint256", "string", "(bool, uint256, string)", "bytes"]

  const random = Bytes.random(4096)

  const options = { samples: 10000, warmup: true } as const

  const benchCubaneHex = benchSync("cubane (hex)", ({ message }) => {
    const instance = factory.inner.from([true, 123456789n, "hello world", [true, 123456789n, "hello world"], random])
    const hex = instance.encode()
    // console.log(message, hex)
    // const args = factory.decode(new TextCursor(hex))
    // console.log(args.args.inner)
  }, options)

  const benchCubaneBytes = benchSync("cubane (bytes)", ({ message }) => {
    const instance = factory.inner.from([true, 123456789n, "hello world", [true, 123456789n, "hello world"], random])
    const bytes = Writable.tryWriteToBytes(instance).unwrap()
    // const hex = Bytes.toHex(bytes)
    // console.log(message, hex)
    // const args = Readable.tryReadFromBytes(factory, bytes).unwrap()
    // console.log(args.args.inner)
  }, options)

  const benchViem = benchSync("viem", ({ message }) => {
    const hex = encodeAbiParameters(viemAbi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, bytesToHex(random)])
    // console.log(message, hex)
    // const [a, b, c, d, e] = decodeAbiParameters(abi, hex)
    // const e2 = hexToBytes(e)
    // console.log(a, b, c, d, e2)
  }, options)

  const benchEthers = benchSync("ethers", ({ message }) => {
    const hex = ethers.AbiCoder.defaultAbiCoder().encode(ethersAbi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, random])
    // console.log(message, hex)
  }, options)

  const benchWeb3 = benchSync("web3", ({ message }) => {
    const hex = eth.abi.encodeParameters(web3Abi, [true, "123456789", "hello world", [true, "123456789", "hello world"], utils.bytesToHex(random)])
    // console.log(message, hex)
  }, options)

  benchCubaneBytes.table(benchCubaneHex, benchViem, benchEthers, benchWeb3)

  benchCubaneHex.summary(benchViem, benchEthers, benchWeb3)
  benchCubaneBytes.summary(benchViem, benchEthers, benchWeb3)
}