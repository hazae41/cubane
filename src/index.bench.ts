import { Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { benchSync } from "@hazae41/deimos";
import { keccak_256 } from "@noble/hashes/sha3";
import { DynamicBytes, FunctionSelector, StaticBool, createDynamicTuple, createFunctionSelectorAndArguments } from "mods/abi/index.js";
import { bytesToHex, encodeAbiParameters, parseAbiParameters } from "viem";

const viem = benchSync("viem", () => {
  const selector = keccak_256("f(bool,bytes)").slice(0, 4)
  const abi = parseAbiParameters("bool x, bytes y")
  const args = [true, bytesToHex(new Uint8Array([1, 2, 3]))] as const
  const hex = bytesToHex(selector) + encodeAbiParameters(abi, args).slice(2)
}, { samples: 100, warmup: false })

const cubane = benchSync("cubane", () => {
  const selector = FunctionSelector.new(keccak_256("f(bool,bytes)").slice(0, 4) as Bytes<4>)
  const factory = createFunctionSelectorAndArguments(createDynamicTuple(StaticBool, DynamicBytes))
  const encoder = factory.tryNew(selector, StaticBool.new(true), DynamicBytes.new(new Uint8Array([1, 2, 3]))).unwrap()
  const bytes = Writable.tryWriteToBytes(encoder).unwrap()
  const hex = Bytes.toHex(bytes)
}, { samples: 100, warmup: false })

cubane.tableAndSummary(viem)