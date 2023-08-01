import { Writable } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { test } from "@hazae41/phobos";
import { RlpList } from "./types/list.js";
import { RlpString } from "./types/string.js";

test("dog", async ({ message, test }) => {
  const dog = RlpString.from(Bytes.fromUtf8("dog"))
  const bytes = Writable.tryWriteToBytes(dog).unwrap()

  console.log(message, [...bytes].map(it => "0x" + Bytes.toHex(new Uint8Array([it]))))
})

test("cat and dog", async ({ message, test }) => {
  const cat = RlpString.from(Bytes.fromUtf8("cat"))
  const dog = RlpString.from(Bytes.fromUtf8("dog"))
  const catAndDog = RlpList.from([cat, dog])

  const bytes = Writable.tryWriteToBytes(catAndDog).unwrap()

  console.log(message, [...bytes].map(it => "0x" + Bytes.toHex(new Uint8Array([it]))))
})

test("empty string", async ({ message, test }) => {
  const empty = RlpString.from(new Uint8Array())
  const bytes = Writable.tryWriteToBytes(empty).unwrap()

  console.log(message, [...bytes].map(it => "0x" + Bytes.toHex(new Uint8Array([it]))))
})

test("empty list", async ({ message, test }) => {
  const empty = RlpList.from([])
  const bytes = Writable.tryWriteToBytes(empty).unwrap()

  console.log(message, [...bytes].map(it => "0x" + Bytes.toHex(new Uint8Array([it]))))
})

test("0", async ({ message, test }) => {
  const string = RlpString.from(new Uint8Array([0]))
  const bytes = Writable.tryWriteToBytes(string).unwrap()

  console.log(message, [...bytes].map(it => "0x" + Bytes.toHex(new Uint8Array([it]))))
})

test("15", async ({ message, test }) => {
  const string = RlpString.from(new Uint8Array([15]))
  const bytes = Writable.tryWriteToBytes(string).unwrap()

  console.log(message, [...bytes].map(it => "0x" + Bytes.toHex(new Uint8Array([it]))))
})

test("1024", async ({ message, test }) => {
  const string = RlpString.from(Bytes.fromBigInt(BigInt(1024)))
  const bytes = Writable.tryWriteToBytes(string).unwrap()

  console.log(message, [...bytes].map(it => "0x" + Bytes.toHex(new Uint8Array([it]))))
})

test("set theoretical representation of three", async ({ message, test }) => {
  // const three = Rlp.from([[], [[]], [[], [[]]]])
  const three = RlpList.from([RlpList.from([]), RlpList.from([RlpList.from([])]), RlpList.from([RlpList.from([]), RlpList.from([RlpList.from([])])])])
  const bytes = Writable.tryWriteToBytes(three).unwrap()

  console.log(message, [...bytes].map(it => "0x" + Bytes.toHex(new Uint8Array([it]))))
})