import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";

import { test } from "@hazae41/phobos";
import { AbiBool, AbiUint256, BytesAbiUint256 } from "../index.js";
import { AbiNamed, AbiStruct } from "./json.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("struct", async () => {
  const MyStruct = AbiStruct.create(AbiNamed.create("a", AbiUint256), AbiNamed.create("b", AbiBool))

  const myStruct = MyStruct.from({ b: true, a: 123n })
  const myStruct2 = MyStruct.from([123n, true])

  const myStruct3 = MyStruct.create({ a: BytesAbiUint256.from(new Uint8Array([123])), b: AbiBool.from(true) })

  console.log(myStruct.encodeOrThrow())
  console.log(myStruct2.encodeOrThrow())
  console.log(myStruct3.encodeOrThrow())
})


