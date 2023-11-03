import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";
import { ethers } from "ethers";
import * as viem from "viem";
import { TypedData } from "./hash.js";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

const typedData = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' }
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' }
    ],
  },
  primaryType: 'Mail',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  },
} as const;

console.log("!!!", Base16.get().encodeOrThrow(TypedData.hash(typedData)))
console.log("!!!", viem.hashTypedData(typedData as any))

const untyped = typedData as any
delete untyped.types.EIP712Domain

console.log("!!!", ethers.TypedDataEncoder.hash(typedData.domain, typedData.types as any, typedData.message))