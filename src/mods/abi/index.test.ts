export * from "./types/index.test.js";

import { Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { test } from "@hazae41/phobos";
import { DynamicBytes, DynamicString, StaticBool, Uint256, tryDecode, tryEncode, tryReadFromBytes } from "./index.js";
import { StaticAddress } from "./types/address/address.js";
import { DynamicArray, createDynamicArray } from "./types/array/array.js";
import { DynamicTuple, createDynamicTuple } from "./types/tuple/tuple.js";
import { createDynamicVector } from "./types/vector/vector.js";

test("test", async () => {
  const abi = "f71870b100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000"
  const decoded = tryReadFromBytes("test(bool,string,uint256)", Bytes.fromHexSafe(abi)).unwrap()
  console.log(decoded)
})

test("test", async () => {
  const abi = "000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const decoded = Readable.tryReadFromBytes(createDynamicArray(StaticAddress, 3), Bytes.fromHexSafe(abi)).unwrap()
  console.log(decoded)
})

test("test", async () => {
  const abi = "00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const decoded = Readable.tryReadFromBytes(createDynamicTuple(createDynamicVector(StaticAddress)), Bytes.fromHexSafe(abi)).unwrap()
  console.log(decoded.inner)
})

test("test", async () => {
  const signature = "f(bool,uint256,(string,address[3])[],bytes)"

  const hex = tryEncode(signature,
    StaticBool.new(true),
    Uint256.new(123456789n),
    DynamicTuple.any.new(
      DynamicString.new("hello world"),
      DynamicArray.any.new(
        StaticAddress.new("0x..."),
        StaticAddress.new("0x..."),
        StaticAddress.new("0x...")
      )
    ),
    DynamicBytes.new(new Uint8Array([1, 2, 3]))
  ).unwrap()

  console.log(hex)

  const funcAndArgs = tryDecode(signature, hex).unwrap()

  console.log(funcAndArgs.args.inner)
})