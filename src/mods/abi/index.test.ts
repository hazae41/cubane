export * from "./typed/index.test.js";
export * from "./types/index.test.js";

import { Base16 } from "@hazae41/base16";
import { Readable } from "@hazae41/binary";
import { Keccak256 } from "@hazae41/keccak256";
import { test } from "@hazae41/phobos";
import { ZeroHexString } from "index.js";
import { TextCursor } from "libs/cursor/cursor.js";
import { FunctionSignature } from "./signature/signature.js";
import { StaticAddress } from "./types/address/address.js";
import { createDynamicArray } from "./types/array/array.js";
import { createDynamicTuple } from "./types/tuple/tuple.js";
import { createDynamicVector } from "./types/vector/vector.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("test", async () => {
  const abi = "f71870b100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000"
  const signature = FunctionSignature.tryParse("test(bool,string,uint256)").unwrap()
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(signature.args, bytes).unwrap()
  // console.log(decoded)
})

test("test", async () => {
  const abi = "000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(createDynamicArray(StaticAddress, 3), bytes).unwrap()
  // console.log(decoded)
})

test("test", async () => {
  const abi = "00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const bytes = Base16.get().padStartAndDecodeOrThrow(abi).copyAndDispose()
  const decoded = Readable.tryReadFromBytes(createDynamicTuple(createDynamicVector(StaticAddress)), bytes).unwrap()
  // console.log(decoded.inner)
})

test("runtime encode then decode", async () => {
  const signature = FunctionSignature.tryParse("f(bool,uint256,(string,address[3])[],bytes)").unwrap()

  const hex = ZeroHexString.from(signature.args.from(
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

  const funcAndArgs = signature.args.decodeOrThrow(new TextCursor(hex.slice(2)))

  // console.log(funcAndArgs.args.inner[2])
})