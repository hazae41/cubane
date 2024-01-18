export * from "./typed/index.test.js";
export * from "./types/index.test.js";

import { Base16 } from "@hazae41/base16";
import { Readable } from "@hazae41/binary";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test, throws } from "@hazae41/phobos";
import { ZeroHexString } from "index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { FunctionSignature } from "./signature/signature.js";
import { AbiAddress } from "./types/address/address.js";
import { createArray } from "./types/array/array.js";
import { createTuple } from "./types/tuple/tuple.js";
import { createVector } from "./types/vector/vector.js";

import { decodeOrThrow } from "./decode.js";
import elements from "./index.test.json";

elements;

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("test", async () => {
  const abi = "f71870b100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000"
  const signature = FunctionSignature.tryParse("test(bool,string,uint256)").unwrap()
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(signature.funcAndArgs, bytes).unwrap()
  // console.log(decoded)
})

test("test", async () => {
  const abi = "000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(createArray(AbiAddress, 3), bytes).unwrap()
  // console.log(decoded)
})

test("test", async () => {
  const abi = "00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(createTuple(createVector(AbiAddress)), bytes).unwrap()
  // console.log(decoded.inner)
})

test("runtime encode then decode", async () => {
  const signature = FunctionSignature.tryParse("f(bool,uint256,(string,address[3])[],bytes)").unwrap()

  const hex = ZeroHexString.from(signature.from(
    true,
    123456789n,
    [
      [
        "hello world",
        [
          "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
          "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
        ]
      ],
    ],
    new Uint8Array([1, 2, 3])
  ).encodeOrThrow())

  signature.decodeOrThrow(new TextCursor(hex.slice(2)))
})

test("json", async () => {
  for (const element of elements as any[]) {
    console.log(element.name)

    const signature = FunctionSignature.parseOrThrow(`f(${element.type})`)
    const encoded = signature.funcAndArgs.args.from([element.value]).encodeOrThrow()

    const a = ZeroHexString.from(encoded).toLowerCase()
    const b = element.encoded.toLowerCase()

    // for (let i = 2; i < a.length; i += 32) {
    //   console.log(i, a.slice(i, i + 32) === b.slice(i, i + 32))
    //   console.log(a.slice(i, i + 32))
    //   console.log(b.slice(i, i + 32))
    // }

    assert(a === b, "encoded")

    const decoded = signature.funcAndArgs.args.decodeOrThrow(new TextCursor(encoded))

    // console.log("a", decoded.toJSON())
    // console.log("b", [element.value])

    assert(JSON.stringify(decoded) === JSON.stringify([element.value]), "decoded")
  }
})

test("recursion", async () => {
  const signature = FunctionSignature.parseOrThrow("f(uint256[][])")

  const payload =
    '0000000000000000000000000000000000000000000000000000000000000020' + // main array ptr
    '0000000000000000000000000000000000000000000000000000000000000002' + // main array length (2 elements)
    '0000000000000000000000000000000000000000000000000000000000000020' + // first array element (acts as ptr to array itself)
    '0000000000000000000000000000000000000000000000000000000000000020'; // second array element

  assert(throws(() => decodeOrThrow(signature.funcAndArgs.args, `0x${payload}`)))
})