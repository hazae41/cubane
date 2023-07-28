import { Bytes } from "@hazae41/bytes";
import { test } from "@hazae41/phobos";
import { Abi } from "index.js";
import { tryDecode, tryEncode } from "./abi.js";
import { Bool, String, Uint256 } from "./index.js";

test("abi", async ({ message, test }) => {
  const bytes = tryEncode(Bool.new(true), String.new("hello"), Uint256.new(123n), Abi.Bytes.new(Bytes.random(123))).unwrap()
  console.log(message, Bytes.toHex(bytes))
  const abi = tryDecode(bytes, Bool, String, Uint256, Abi.Bytes).unwrap()
  console.log(message, abi)
})