import { Bytes } from "@hazae41/bytes";
import { test } from "@hazae41/phobos";
import { tryDecode } from "./abi.js";
import { Bool, DynamicString, Uint256 } from "./index.js";

export * from "./address/address.test.js";
export * from "./bool/bool.test.js";
export * from "./bytes/bytes.test.js";
export * from "./function/function.test.js";
export * from "./int/int.test.js";
export * from "./string/string.test.js";
export * from "./uint/uint.test.js";

test("test", async () => {
  const abi = "f71870b100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000007b000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000"
  const decoded = tryDecode(Bytes.fromHexSafe(abi), Bool, DynamicString, Uint256).unwrap()
  console.log(decoded)
})