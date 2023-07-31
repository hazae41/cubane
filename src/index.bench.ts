import { Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { benchSync } from "@hazae41/deimos";
import { keccak_256 } from "@noble/hashes/sha3";
import { DynamicBytes, FunctionSelector, StaticBool, createDynamicTuple, createFunctionSelectorAndArguments } from "mods/abi/index.js";
import { bytesToHex, decodeAbiParameters, encodeAbiParameters, hexToBytes, parseAbiParameters } from "viem";

if (false) {

  const bytes = Bytes.random(1024)

  const cubane = benchSync("cubane", () => {
    const hex = Bytes.toHex(bytes)
  }, { samples: 100000, warmup: true })

  const viem = benchSync("viem", () => {
    const hex = bytesToHex(bytes)
  }, { samples: 100000, warmup: true })

  cubane.tableAndSummary(viem)
}

if (true) {
  const selector = FunctionSelector.new(keccak_256("f(bool,bytes)").slice(0, 4) as Bytes<4>)
  const factory = createFunctionSelectorAndArguments(createDynamicTuple(StaticBool, DynamicBytes))

  const bytes = Bytes.random(1024)

  const cubane = benchSync("cubane", () => {
    const encoder = factory.tryNew(selector, StaticBool.new(true), DynamicBytes.new(bytes)).unwrap()
    const hex = encoder.encode()
  }, { samples: 100000, warmup: true })

  const viem = benchSync("viem", () => {
    const abi = parseAbiParameters("bool x, bytes y")
    const args = [true, bytesToHex(bytes)] as const
    const hex = bytesToHex(selector.value) + encodeAbiParameters(abi, args).slice(2)
  }, { samples: 100000, warmup: true })

  cubane.tableAndSummary(viem)
}

if (false) {
  const hex = "0x240a58a20000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030102030000000000000000000000000000000000000000000000000000000000"

  const viem = benchSync("viem", () => {
    const abi = parseAbiParameters("bool x, bytes y")
    const [bool, bytesHex] = decodeAbiParameters(abi, `0x${hex.slice(10)}`)
    const bytes = hexToBytes(bytesHex)
  }, { samples: 1000, warmup: true })

  const factory = createFunctionSelectorAndArguments(createDynamicTuple(StaticBool, DynamicBytes))

  const cubane = benchSync("cubane", () => {
    const args = Readable.tryReadFromBytes(factory, Bytes.fromHex(hex.slice(2))).unwrap()
  }, { samples: 1000, warmup: true })

  cubane.tableAndSummary(viem)
}