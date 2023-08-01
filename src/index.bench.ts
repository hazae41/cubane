import { Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { benchSync } from "@hazae41/deimos";
import { keccak_256 } from "@noble/hashes/sha3";
import { DynamicBytes, DynamicString, FunctionSelector, StaticBool, Uint256, createDynamicTuple, createFunctionSelectorAndArguments } from "mods/abi/index.js";
import { bytesToHex, encodeAbiParameters, parseAbiParameters } from "viem";

/**
 * Encode bool and bytes with preparsed ABI
 */
if (true) {
  const selector = FunctionSelector.new(keccak_256("f(bool,bytes)").slice(0, 4) as Bytes<4>)
  const MyStruct = createDynamicTuple(StaticBool, Uint256, DynamicString)
  const factory = createFunctionSelectorAndArguments(createDynamicTuple(StaticBool, Uint256, DynamicString, MyStruct, DynamicBytes))

  const abi = parseAbiParameters("bool a, uint256 b, string c, (bool a, uint256 b, string c) d, bytes e")

  const random = Bytes.random(2048)

  const options = { samples: 10000, warmup: true } as const

  const cubane = benchSync("cubane (hex)", () => {
    const myStruct = MyStruct.new(StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"))
    const instance = factory.new(selector, StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"), myStruct, DynamicBytes.new(random))
    const text = instance.encode()
    // const args = factory.decode(new TextCursor(text))
    // console.log(args.args.inner)
  }, options)

  const cubane2 = benchSync("cubane (bytes)", () => {
    const myStruct = MyStruct.new(StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"))
    const instance = factory.new(selector, StaticBool.new(true), Uint256.new(123456789n), DynamicString.new("hello world"), myStruct, DynamicBytes.new(random))
    const bytes = Writable.tryWriteToBytes(instance).unwrap()
    // const args = Readable.tryReadFromBytes(factory, bytes).unwrap()
    // console.log(args.args.inner)
  }, options)

  const viem = benchSync("viem", () => {
    const hex = encodeAbiParameters(abi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, bytesToHex(random)])
    // const [a, b, c, d, e] = decodeAbiParameters(abi, hex)
    // const e2 = hexToBytes(e)
    // console.log(a, b, c, d, e2)
  }, options)

  cubane.table(viem, cubane2)
  cubane.summary(viem)
  cubane2.summary(viem)
}