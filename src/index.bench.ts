import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { benchSync } from "@hazae41/deimos";
import { ethers } from "ethers";
import { Rlp } from "index.js";
import { FunctionSignature, tryEncode } from "mods/abi/index.js";
import { hexToBytes, toRlp } from "viem";

/**
 * Is uint32 faster than uint8? Yes, slightly (at least on Node)
 */
if (false) {
  const bytes = Bytes.random(128)

  const options = { samples: 5000, warmup: true } as const

  const uint32 = benchSync("uint32", () => {
    const cursor = new Cursor(bytes)
    const x = cursor.tryGetUint32().unwrap()
  }, options)

  const uint8 = benchSync("uint8", () => {
    const cursor = new Cursor(bytes)
    const x = cursor.bytes[cursor.offset]
  }, options)

  uint32.tableAndSummary(uint8)
}

// /**
//  * Encode various types with preparsed ABI
//  */
// if (false) {
//   const factory = FunctionSignature.tryParse("f(bool,bytes)").unwrap()

//   const viemAbi = parseAbiParameters("bool a, uint256 b, string c, (bool a, uint256 b, string c) d, bytes e")
//   const ethersAbi = ["bool a", "uint256 b", "string c", "tuple(bool a, uint256 b, string c) d", "bytes e"]
//   const web3Abi = ["bool", "uint256", "string", "(bool, uint256, string)", "bytes"]

//   const random = Bytes.random(4096)

//   const options = { samples: 10000, warmup: true } as const

//   const benchCubaneHex = benchSync("cubane (hex)", ({ message }) => {
//     const instance = factory.inner.from([true, 123456789n, "hello world", [true, 123456789n, "hello world"], random])
//     const hex = instance.encode()
//     // console.log(message, hex)
//     // const args = factory.decode(new TextCursor(hex))
//     // console.log(args.args.inner)
//   }, options)

//   const benchCubaneBytes = benchSync("cubane (bytes)", ({ message }) => {
//     const instance = factory.inner.from([true, 123456789n, "hello world", [true, 123456789n, "hello world"], random])
//     const bytes = Writable.tryWriteToBytes(instance).unwrap()
//     // const hex = Bytes.toHex(bytes)
//     // console.log(message, hex)
//     // const args = Readable.tryReadFromBytes(factory, bytes).unwrap()
//     // console.log(args.args.inner)
//   }, options)

//   const benchViem = benchSync("viem", ({ message }) => {
//     const hex = encodeAbiParameters(viemAbi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, bytesToHex(random)])
//     // console.log(message, hex)
//     // const [a, b, c, d, e] = decodeAbiParameters(abi, hex)
//     // const e2 = hexToBytes(e)
//     // console.log(a, b, c, d, e2)
//   }, options)

//   const benchEthers = benchSync("ethers", ({ message }) => {
//     const hex = ethers.AbiCoder.defaultAbiCoder().encode(ethersAbi, [true, 123456789n, "hello world", { a: true, b: 123456789n, c: "hello world" }, random])
//     // console.log(message, hex)
//   }, options)

//   const benchWeb3 = benchSync("web3", ({ message }) => {
//     const hex = eth.abi.encodeParameters(web3Abi, [true, "123456789", "hello world", [true, "123456789", "hello world"], utils.bytesToHex(random)])
//     // console.log(message, hex)
//   }, options)

//   benchCubaneBytes.table(benchCubaneHex, benchViem, benchEthers, benchWeb3)

//   benchCubaneHex.summary(benchViem, benchEthers, benchWeb3)
//   benchCubaneBytes.summary(benchViem, benchEthers, benchWeb3)
// }

/**
 * RLP encoding a transaction with various pre-ABI-encoded types
 */
if (true) {

  const abi = FunctionSignature.tryParse("f(bool,uint256,string,address)").unwrap()

  const txbytes = Bytes.fromHexSafe(ethers.Transaction.from({
    type: 0,
    value: 1n * (10n ** 18n),
    data: tryEncode(abi, true, 1n * (10n ** 18n), "hello world", "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045").unwrap(),
    gasLimit: 1n * (10n ** 18n),
    gasPrice: 1n * (10n ** 18n),
    to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    chainId: 1n,
    nonce: 1,
  }).unsignedSerialized.slice(2))

  const rlp = Rlp.tryReadFromBytes(txbytes).unwrap()

  const options = { samples: 100000, warmup: true } as const

  const benchCubaneBytes = benchSync("cubane (bytes)", () => {
    const bytes = Rlp.tryWriteToBytes(rlp).unwrap()
    // const random2 = RlpStringUint16.tryRead(new Cursor(bytes)).unwrap()
  }, options)

  const benchViem = benchSync("viem", () => {
    const bytes = hexToBytes(toRlp(rlp))
    // const random2 = fromRlp(bytes, "bytes")
  }, options)

  const rlphex = (rlp as Uint8Array[]).map(ethers.hexlify)

  const benchEthers = benchSync("ethers", () => {
    const bytes = ethers.encodeRlp(rlphex)
    // const random2 = ethers.getBytes(ethers.decodeRlp(ethers.hexlify(bytes)) as string)
  }, options)

  benchCubaneBytes.table(benchViem, benchEthers)
  benchCubaneBytes.summary(benchViem, benchEthers)
}