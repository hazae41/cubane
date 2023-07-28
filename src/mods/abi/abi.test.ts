import { Bytes } from "@hazae41/bytes";
import { test } from "@hazae41/phobos";
import { Abi } from "index.js";
import { Decoder } from "./decoder.js";
import { Encoder } from "./encoder.js";
import { Bool, String, Uint256 } from "./index.js";

test("abi", async ({ message, test }) => {
  const bytes = Encoder.tryEncode(Bool.new(true), String.new("hello"), Uint256.new(123n), Abi.Bytes.new(Bytes.random(123))).unwrap()
  console.log(message, Bytes.toHex(bytes))
  const abi = Decoder.tryDecode(bytes, Bool, String, Uint256, Abi.Bytes).unwrap()
  console.log(message, abi)
})