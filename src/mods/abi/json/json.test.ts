import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";

import { test } from "@hazae41/phobos";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { AbiBool, AbiUint256, BytesAbiUint256 } from "../index.js";
import { AbiNamed, AbiStruct } from "./json.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

test("struct", async () => {
  const MyStruct = AbiStruct.create(AbiNamed.create("a", AbiUint256), AbiNamed.create("b", AbiBool))

  const myStruct = MyStruct.fromOrThrow({ b: true, a: 123n })
  const myStruct2 = MyStruct.fromOrThrow([123n, true])

  const myStruct3 = MyStruct.create({ a: BytesAbiUint256.fromOrThrow(new Uint8Array([123])), b: AbiBool.fromOrThrow(true) })

  // console.log(myStruct.encodeOrThrow())
  // console.log(myStruct2.encodeOrThrow())
  // console.log(myStruct3.encodeOrThrow())
})


