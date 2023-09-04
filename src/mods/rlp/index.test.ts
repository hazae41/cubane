import { Alocer } from "@hazae41/alocer";
import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Morax } from "@hazae41/morax";
import { test } from "@hazae41/phobos";
import { Rlp } from "index.js";

await Alocer.initBundledOnce()
Base16.set(Base16.fromAlocer(Alocer))

await Morax.initBundledOnce()
Keccak256.set(Keccak256.fromMorax(Morax))

function hexlify(bytes: Uint8Array) {
  return Base16.get().tryEncode(bytes).unwrap()
}

await test("dog", async ({ message, test }) => {
  const dog = Bytes.fromUtf8("dog")
  const bytes = Rlp.tryWriteToBytes(dog).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, Bytes.toUtf8(value as Uint8Array))
})

await test("cat and dog", async ({ message, test }) => {
  const cat = Bytes.fromUtf8("cat")
  const dog = Bytes.fromUtf8("dog")
  const catAndDog = [cat, dog]

  const bytes = Rlp.tryWriteToBytes(catAndDog).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, value)
})

await test("empty string", async ({ message, test }) => {
  const empty = new Uint8Array()
  const bytes = Rlp.tryWriteToBytes(empty).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, value)
})

await test("empty list", async ({ message, test }) => {
  const empty = new Array<Uint8Array>()
  const bytes = Rlp.tryWriteToBytes(empty).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, value)
})

await test("0", async ({ message, test }) => {
  const string = new Uint8Array([0])
  const bytes = Rlp.tryWriteToBytes(string).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, value)
})

await test("15", async ({ message, test }) => {
  const string = new Uint8Array([15])
  const bytes = Rlp.tryWriteToBytes(string).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, value)
})

await test("1024", async ({ message, test }) => {
  const string = Bytes.fromBigInt(BigInt(1024))
  const bytes = Rlp.tryWriteToBytes(string).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, value)
})

await test("set theoretical representation of three", async ({ message, test }) => {
  const three = [[], [[]], [[], [[]]]]
  const bytes = Rlp.tryWriteToBytes(three).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, value)
})

await test("Lorem ipsum", async ({ message, test }) => {
  const lorem = Bytes.fromUtf8("Lorem ipsum dolor sit amet, consectetur adipisicing elit")
  const bytes = Rlp.tryWriteToBytes(lorem).unwrap()
  const value = Rlp.tryReadFromBytes(bytes).unwrap()

  console.log(message, [...bytes].map(it => "0x" + hexlify(new Uint8Array([it]))))
  console.log(message, Bytes.toUtf8(value as Uint8Array))
})