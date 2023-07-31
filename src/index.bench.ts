import { Bytes } from "@hazae41/bytes";
import { benchSync } from "@hazae41/deimos";
import { keccak_256 } from "@noble/hashes/sha3";
import { TextCursor } from "libs/cursor/cursor.js";
import { DynamicBytes, DynamicString, FunctionSelector, StaticBool, Uint256, createDynamicTuple, createFunctionSelectorAndArguments } from "mods/abi/index.js";
import { bytesToHex, decodeAbiParameters, encodeAbiParameters, hexToBytes, parseAbiParameters } from "viem";

if (false) {
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pharetra ligula, non molestie mauris fringilla nec. Aliquam erat volutpat. Quisque sit amet purus bibendum purus gravida pellentesque at et quam. Sed ut lorem enim. Nam in euismod urna. Maecenas mauris odio, vehicula nec dui in, tempor venenatis justo. Nam ex mauris, maximus ut fermentum at, placerat at justo. Ut euismod sagittis mollis. Praesent tempor vitae ex sit amet egestas. Nulla tincidunt tincidunt sem, in faucibus orci sagittis non. Aenean cursus placerat elit at dapibus."

  const slice = benchSync("slice", async () => {
    const ab = text.slice(410, 410 + 2)

    let lol: boolean

    if (ab === "00")
      lol = true
    else
      lol = false
  }, { samples: 100000, warmup: true })

  const slice2 = benchSync("chars", async () => {
    const ab = text.slice(410).slice(2)

    let lol: boolean

    if (ab === "00")
      lol = true
    else
      lol = false
  }, { samples: 100000, warmup: true })

  slice.tableAndSummary(slice2)
}

/**
 * Encode bytes to hex
 */
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
    console.log(args.args.inner)
  }, { samples: 1, warmup: true })

  const viem = benchSync("viem", () => {
    const hex = encodeAbiParameters(abi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, bytesToHex(bytes)])
    const [a, b, c, d, e] = decodeAbiParameters(abi, hex)
    const e2 = hexToBytes(e)
    console.log(a, b, c, d, e2)
  }, { samples: 1, warmup: true })

  cubane.tableAndSummary(viem)
}

/**
 * Read bool and bytes
 */
if (false) {
  const hex = "0x240a58a20000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030102030000000000000000000000000000000000000000000000000000000000"

  const factory = createFunctionSelectorAndArguments(createDynamicTuple(StaticBool, DynamicBytes))
  const abi = parseAbiParameters("bool x, bytes y")

  const viem = benchSync("viem", () => {
    const [bool, bytesHex] = decodeAbiParameters(abi, `0x${hex.slice(10)}`)
    const bytes = hexToBytes(bytesHex)
  }, { samples: 10000, warmup: true })

  const cubane = benchSync("cubane", () => {
    const args = factory.decode(new TextCursor(hex.slice(2)))
  }, { samples: 10000, warmup: true })

  cubane.tableAndSummary(viem)
}