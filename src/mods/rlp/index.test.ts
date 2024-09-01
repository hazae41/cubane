import { Base16 } from "@hazae41/base16";
import { Readable, Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { test } from "@hazae41/phobos";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { Rlp } from "index.js";
import { BigInts } from "libs/bigint/bigint.js";
import { Copiable } from "libs/copiable/index.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

function hexlify(bytes: Uint8Array) {
  return Base16.get().getOrThrow().encodeOrThrow(bytes)
}

await test("dog", async ({ message, test }) => {
  const dog = Bytes.fromUtf8("dog")
  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(dog))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, Bytes.toUtf8(value as Uint8Array))
})

await test("cat and dog", async ({ message, test }) => {
  const cat = Bytes.fromUtf8("cat")
  const dog = Bytes.fromUtf8("dog")
  const catAndDog = [cat, dog]

  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(catAndDog))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, value)
})

await test("empty string", async ({ message, test }) => {
  const empty = new Uint8Array()
  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(empty))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, value)
})

await test("empty list", async ({ message, test }) => {
  const empty = new Array<Uint8Array>()
  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(empty))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, value)
})

await test("0", async ({ message, test }) => {
  const string = new Uint8Array([0])
  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(string))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, value)
})

await test("15", async ({ message, test }) => {
  const string = new Uint8Array([15])
  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(string))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, value)
})

await test("1024", async ({ message, test }) => {
  const string = Copiable.copyAndDispose(BigInts.exportOrThrow(BigInt(1024)))
  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(string))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, value)
})

await test("set theoretical representation of three", async ({ message, test }) => {
  const three = [[], [[]], [[], [[]]]]
  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(three))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, value)
})

await test("Lorem ipsum", async ({ message, test }) => {
  const lorem = Bytes.fromUtf8("Lorem ipsum dolor sit amet, consectetur adipisicing elit")
  const bytes = Writable.writeToBytesOrThrow(Rlp.fromOrThrow(lorem))
  const value = Readable.readFromBytesOrThrow(Rlp, bytes).intoOrThrow()

  // console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  // console.log(message, Bytes.toUtf8(value as Uint8Array))
})