import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { assert, test } from "@hazae41/phobos";
import { Uint } from "./uint.js";

test("uint", async ({ test }) => {
  const value = 123456n
  const uint32 = new (Uint(32))(value)
  const bytes = Writable.tryWriteToBytes(uint32).unwrap()

  console.log(Bytes.toHex(bytes))

  const uint32_2 = Readable.tryReadFromBytes(Uint(32), bytes).unwrap()
  const value_2 = uint32_2.value

  assert(value === value_2)
})