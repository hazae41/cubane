export * from "./json/json.test.js";
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

import { decodeOrThrow } from "./decode.js";
import { encodeOrThrow } from "./encode.js";
import { AbiArray, AbiTuple, AbiVector } from "./index.js";
import elements from "./index.test.json";

elements;

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("test", async () => {
  const abi = "f71870b100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000"
  const signature = FunctionSignature.tryParse("test(bool,string,uint256)").unwrap()
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(signature, bytes).unwrap()
  // console.log(decoded)
})

test("test", async () => {
  const abi = "000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(AbiArray.create(AbiAddress, 3), bytes).unwrap()
  // console.log(decoded)
})

test("test", async () => {
  const abi = "00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(AbiTuple.create(AbiVector.create(AbiAddress)), bytes).unwrap()
  // console.log(decoded.inner)
})

test("runtime encode then decode", async () => {
  const signature = FunctionSignature.tryParse("f(bool,uint256,(string,address[3])[],bytes)").unwrap()

  const hex = `0x${signature.fromOrThrow(
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
  ).encodeOrThrow()}`

  signature.decodeOrThrow(new TextCursor(hex.slice(2)))
})

test("json", async () => {
  for (const element of elements as any[]) {
    // console.log(element.name)

    const signature = FunctionSignature.parseOrThrow(`f(${element.type})`)
    const encoded = signature.args.fromOrThrow([element.value]).encodeOrThrow()

    const a = `0x${encoded}`.toLowerCase()
    const b = element.encoded.toLowerCase()

    // for (let i = 2; i < a.length; i += 32) {
    //   console.log(i, a.slice(i, i + 32) === b.slice(i, i + 32))
    //   console.log(a.slice(i, i + 32))
    //   console.log(b.slice(i, i + 32))
    // }

    assert(a === b, "encoded")

    const decoded = signature.args.decodeOrThrow(new TextCursor(encoded))

    // console.log("a", decoded.toJSON())
    // console.log("b", [element.value])

    assert(JSON.stringify(decoded) === JSON.stringify([element.value]), "decoded")
  }
})

/**
 * ZSTs, ABIs, stolen keys and broken legs
 * https://github.com/paulmillr/micro-eth-signer/discussions/20
 */

test("recursion", async () => {
  const signature = FunctionSignature.parseOrThrow("f(uint256[][])")

  const payload =
    '0000000000000000000000000000000000000000000000000000000000000020' + // main array ptr
    '0000000000000000000000000000000000000000000000000000000000000002' + // main array length (2 elements)
    '0000000000000000000000000000000000000000000000000000000000000020' + // first array element (acts as ptr to array itself)
    '0000000000000000000000000000000000000000000000000000000000000020'; // second array element

  assert(throws(() => decodeOrThrow(signature.args, `0x${payload}`)))
})

test("ZST array", async () => {
  assert(throws(() => FunctionSignature.parseOrThrow("f(uint256[0][4294967295])")))
})

test("ZST vector", async () => {
  const signature = FunctionSignature.parseOrThrow("f(uint256[0][])")

  const payload = "000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000FFFFFFFF"

  assert(throws(() => decodeOrThrow(signature.args, `0x${payload}`)))
})

test("more bugs", async () => {
  const brackets = [[], [], [], [], [], [], [], [], [], []];
  const array = brackets.map((x, i) => BigInt(brackets.length - i + 1) * 32n)

  const signature0 = FunctionSignature.parseOrThrow("f(uint256[])")
  const payload0 = encodeOrThrow(signature0.fromOrThrow(array))

  const payload = `0x${payload0.slice(2).repeat(10 + 1)}`

  const signature1 = FunctionSignature.parseOrThrow("f(uint256[][][][][][][][][][])")
  assert(throws(() => decodeOrThrow(signature1, payload as ZeroHexString)))
})

test("interleave", async () => {
  const repeats: Record<any, number> = {
    4: 47, // 6kb -> 6kb (+0x)
    8: 109, // 15kb -> 30kb (+1x)
    16: 233, // 30kb -> 123kb (+3x)
    32: 481, // 63kb -> 510kb (+7x)
    64: 977, // 129kb -> 2mb (+15x)
    128: 1969, // 260kb -> 8mb (+31x)
    256: 3953, // 522kb -> 33mb (+63x)
    512: 7921, // 1mb -> 133mb (+127x)
    1024: 15857, // 2mb -> 533mb (+255x)
    2048: 32000, // 4mb -> 2gb (+511x)
    4096: 64000, // 8mb -> est: 8gb (+1023x)
  };

  function f(length: number) {
    const array = Array.from({ length }, (i, j) => BigInt(length - j) * 32n)

    const signature0 = FunctionSignature.parseOrThrow("f(uint256[])")
    const payload0 = encodeOrThrow(signature0.fromOrThrow(array))

    const payload = payload0 + "00".repeat(32 * 2 * repeats[length])

    const signature1 = FunctionSignature.parseOrThrow("f(uint256[][])")
    assert(throws(() => decodeOrThrow(signature1, payload as ZeroHexString)))
  }

  f(4)
  f(8)
  f(16)
  f(32)
  f(64)
  f(128)
  f(256)
  f(512)
  f(1024)
  f(2048)
  f(4096)
})

