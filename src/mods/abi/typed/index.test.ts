import { Base16 } from "@hazae41/base16";
import { Keccak256 } from "@hazae41/keccak256";
import { assert, test } from "@hazae41/phobos";
import { ZeroHexString } from "index.js";
import * as viem from "viem";
import { TypedData } from "./index.js";
import data from "./test.json";

Base16.set(await Base16.fromBufferOrAlocer())
Keccak256.set(await Keccak256.fromMorax())

test("Mail", async ({ test }) => {
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
      chainId: 1n,
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

  const typedDatas = {
    basic: {
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail',
        version: '1',
        chainId: 1,
        verifyingContract: '0x0000000000000000000000000000000000000000',
      },
      types: {
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' },
        ],
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
        ],
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
    },
    complex: {
      primaryType: 'Mail',
      domain: {
        name: 'Ether Mail 🥵',
        version: '1.1.1',
        chainId: 1,
        verifyingContract: '0x0000000000000000000000000000000000000000',
      },
      types: {
        Name: [
          { name: 'first', type: 'string' },
          { name: 'last', type: 'string' },
        ],
        Person: [
          { name: 'name', type: 'Name' },
          { name: 'wallet', type: 'address' },
          { name: 'favoriteColors', type: 'string[3]' },
          { name: 'foo', type: 'uint256' },
          { name: 'age', type: 'uint8' },
          { name: 'isCool', type: 'bool' },
        ],
        Mail: [
          { name: 'timestamp', type: 'uint256' },
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' },
          { name: 'hash', type: 'bytes' },
        ],
      },
      message: {
        timestamp: 1234567890n,
        contents: 'Hello, Bob! 🖤',
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: {
          name: {
            first: 'Cow',
            last: 'Burns',
          },
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          age: 69,
          foo: 123123123123123123n,
          favoriteColors: ['red', 'green', 'blue'],
          isCool: false,
        },
        to: {
          name: { first: 'Bob', last: 'Builder' },
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          age: 70,
          foo: 123123123123123123n,
          favoriteColors: ['orange', 'yellow', 'green'],
          isCool: true,
        },
      },
    },
  } as const

  assert(viem.hashTypedData(typedData) === ZeroHexString.from(Base16.get().encodeOrThrow(TypedData.hashOrThrow(typedData))))
  assert(viem.hashTypedData(typedDatas.basic) === ZeroHexString.from(Base16.get().encodeOrThrow(TypedData.hashOrThrow(typedDatas.basic))))
  assert(viem.hashTypedData(typedDatas.complex) === ZeroHexString.from(Base16.get().encodeOrThrow(TypedData.hashOrThrow(typedDatas.complex))))

  for (let i = 0; i < data.length; i++) {
    const d = data[i]
    console.log(i)
    assert(viem.hashTypedData(d as any) === ZeroHexString.from(Base16.get().encodeOrThrow(TypedData.hashOrThrow(d))))
  }
})