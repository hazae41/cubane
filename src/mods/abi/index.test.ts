import { Readable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { test } from "@hazae41/phobos";
import { Address } from "./types/address/address.js";
import { createDynamicArray } from "./types/array/dynamic.js";
import { createStaticArray } from "./types/array/static.js";
import { createStaticTuple } from "./types/tuple/tuple.js";

// test("test", async () => {
//   const abi = "f71870b100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000"
//   const decoded = tryDecode("test(bool,string,uint256)", Bytes.fromHexSafe(abi)).unwrap()
//   console.log(decoded)
// })

test("test", async () => {
  const abi = "000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const decoded = Readable.tryReadFromBytes(createStaticArray(Address, 3), Bytes.fromHexSafe(abi)).unwrap()
  console.log(decoded)
})

test("test", async () => {
  const abi = "00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000076a65814b6e0fa5a3598ef6503fa1d990ec0e61a000000000000000000000000d66832ff9d808b32adfe0136a0381054f3600185"
  const decoded = Readable.tryReadFromBytes(createStaticTuple(createDynamicArray(Address)), Bytes.fromHexSafe(abi)).unwrap()
  console.log(decoded.inner)
})