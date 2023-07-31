import { Bytes } from "@hazae41/bytes";
import { benchSync } from "@hazae41/deimos";
import { keccak_256 } from "@noble/hashes/sha3";
import { TextCursor } from "libs/cursor/cursor.js";
import { DynamicBytes, DynamicString, FunctionSelector, StaticBool, Uint256, createDynamicTuple, createFunctionSelectorAndArguments } from "mods/abi/index.js";
import { bytesToHex, decodeAbiParameters, encodeAbiParameters, hexToBytes, parseAbiParameters } from "viem";

/**
 * Encode bool and bytes with preparsed ABI
 */
if (true) {
  const selector = FunctionSelector.new(keccak_256("f(bool,bytes)").slice(0, 4) as Bytes<4>)
  const MyStruct = createDynamicTuple(StaticBool, Uint256, DynamicString)
  const encoder = createFunctionSelectorAndArguments(createDynamicTuple(StaticBool, Uint256, DynamicString, MyStruct, DynamicBytes))

  const abi = parseAbiParameters("bool a, uint256 b, string c, (bool a, uint256 b, string c) d, bytes e")

  const bytes = Bytes.random(1024)

  const cubane = benchSync("cubane", () => {
    const myStruct = MyStruct.new(StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"))
    const hex = encoder.new(selector, StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"), myStruct, DynamicBytes.new(bytes)).encode()
    const args = encoder.decode(new TextCursor(hex))
  }, { samples: 10000, warmup: true })

  const viem = benchSync("viem", () => {
    const hex = encodeAbiParameters(abi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, bytesToHex(bytes)])
    const [a, b, c, d, e] = decodeAbiParameters(abi, hex)
    const e2 = hexToBytes(e)
  }, { samples: 10000, warmup: true })

  cubane.tableAndSummary(viem)
}