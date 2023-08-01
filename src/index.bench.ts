import { Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { benchSync } from "@hazae41/deimos";
import { keccak_256 } from "@noble/hashes/sha3";
import { ethers } from "ethers";
import { DynamicBytes, DynamicString, FunctionSelector, StaticBool, Uint256, createDynamicTuple, createFunctionSelectorAndArguments } from "mods/abi/index.js";
import { bytesToHex, encodeAbiParameters, parseAbiParameters } from "viem";
import { eth, utils } from "web3";

/**
 * Encode bool and bytes with preparsed ABI
 */
if (true) {
  const selector = FunctionSelector.new(keccak_256("f(bool,bytes)").slice(0, 4) as Bytes<4>)

  const MyStruct = createDynamicTuple(StaticBool, Uint256, DynamicString)
  const factory = createFunctionSelectorAndArguments(createDynamicTuple(StaticBool, Uint256, DynamicString, MyStruct, DynamicBytes))

  const viemAbi = parseAbiParameters("bool a, uint256 b, string c, (bool a, uint256 b, string c) d, bytes e")
  const ethersAbi = ["bool a", "uint256 b", "string c", "tuple(bool a, uint256 b, string c) d", "bytes e"]
  const web3Abi = ["bool", "uint256", "string", "(bool, uint256, string)", "bytes"]

  const random = Bytes.random(4096)

  const options = { samples: 10000, warmup: true } as const

  const benchCubaneHex = benchSync("cubane (hex)", ({ message }) => {
    const myStruct = MyStruct.new(StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"))
    const instance = factory.new(selector, StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"), myStruct, DynamicBytes.new(random))
    const hex = instance.encode()
    // console.log(message, hex)
    // const args = factory.decode(new TextCursor(hex))
    // console.log(args.args.inner)
  }, options)

  const benchCubaneBytes = benchSync("cubane (bytes)", ({ message }) => {
    const myStruct = MyStruct.new(StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"))
    const instance = factory.new(selector, StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"), myStruct, DynamicBytes.new(random))
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