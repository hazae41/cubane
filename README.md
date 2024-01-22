# Cubane

Next-gen Ethereum library for TypeScript

```bash
npm i @hazae41/cubane
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/cubane)

## Features

### Goals
- 100% TypeScript and ESM
- Minimal dependencies
- Rust-like patterns
- Human-readable code
- Bottom-up abstractions
- Bring your own algorithms
- Zero-copy bytes encoding
- Compile-time codegen

### Implemented
- ABI / ABIv2 (except `fixed`)
- Function parsing (e.g. `f(uint256)`)
- Recursive-Length Prefix (RLP) coding
- TypedData (EIP-712) hashing
- ENS (e.g. `namehash`)

### Coming soon
- JSON-ABI parsing
- Return type of functions
- Signatures and transactions

## Benchmark

### Encoding various types with preparsed ABI

Cubane 0.1.14
viem 2.4.1
ethers 6.10.0

```bash
┌────────────────┬──────────────────┬─────────────┬─────────────┐
│    (index)     │     average      │   minimum   │   maximum   │
├────────────────┼──────────────────┼─────────────┼─────────────┤
│ cubane (bytes) │  '4.10 μs/iter'  │  '3.08 μs'  │ '129.37 μs' │
│  cubane (hex)  │  '4.47 μs/iter'  │  '3.83 μs'  │ '76.13 μs'  │
│      viem      │ '18.77 μs/iter'  │ '16.58 μs'  │ '184.83 μs' │
│     ethers     │ '211.55 μs/iter' │ '194.08 μs' │ '586.21 μs' │
└────────────────┴──────────────────┴─────────────┴─────────────┘
Summary
- cubane (hex) is 4.20x faster than viem
- cubane (hex) is 47.28x faster than ethers
Summary
- cubane (bytes) is 4.58x faster than viem
- cubane (bytes) is 51.59x faster than ethers
```

## Setup

### Symbol.dispose

You may need to polyfill `Symbol.dispose`

```tsx
import "@hazae41/symbol-dispose-polyfill"
```

See https://github.com/hazae41/symbol-dispose-polyfill for more

### Algorithms

You can bring your own implementation for some algorithms

#### Keccak256 (mandatory)

Morax includes a fast WebAssembly port of Keccak256

```bash
npm i @hazae41/morax
```

`keccak256.ts`

```typescript
import { Keccak256 } from "@hazae41/keccak256"

Keccak256.set(await Keccak256.fromMorax())
```

See https://github.com/hazae41/keccak256 for more

#### Base16 (optional)

Alocer includes a fast WebAssembly port of Base16

```bash
npm i @hazae41/alocer
```

`base16.ts`

```typescript
import { Base16 } from "@hazae41/base16"

Base16.set(await Base16.fromBufferOrAlocer())
```

See https://github.com/hazae41/base16 for more

## Usage

### Abi to Hex (runtime)

Parse the function from its signature

```tsx
import { Abi } from "@hazae41/cubane"

const f = Abi.FunctionSignature.parseOrThrow("f(bool,uint256,string)")
```

Encode the function selector and its arguments (it will return a `0x`-prefixed hex string)

```tsx
const hex = f.from(true, 123456789n, "hello world").encodeOrThrow()
// c4b71e130000000000000000000000000000000000000000000000000000000000000001...
```

### Abi to Hex (macro)

Cubane provides Saumon macros to generate typed ABI functions

`f.abi.macro.ts`

```tsx
import "@hazae41/symbol-dispose-polyfill"
import { Abi } from "@hazae41/cubane"

/**
 * Your Keccak256 adapter code
 */
import "./keccak256.js"

export const f = Abi.FunctionSignature.$parse$("f(bool,uint256,string)")
```

```bash
saumon build ./f.abi.macro.ts
```

`main.ts`

```tsx
import { f } from "./f.abi.ts"

/**
 * f is fully typed as (bool,uint256,string)
 */
const hex = f.from(true, 123456789n, "hello world").encodeOrThrow()
// c4b71e130000000000000000000000000000000000000000000000000000000000000001...
```

### Abi to Hex (manual)

You can generate the function from its signature

```tsx
> import { Abi } from "@hazae41/cubane"
> console.log(Abi.FunctionSignature.parseOrThrow("f(bool,uint256,string)").codegen())
```

Paste it in a file `f.abi.ts`

```tsx
export const f = /*generated code*/
```

Encode the function selector and its arguments (it will return a `0x`-prefixed hex string)

```tsx
import { f } from "./f.abi.ts"

/**
 * f is fully typed as (bool,uint256,string)
 */
const hex = f.from(true, 123456789n, "hello world").encodeOrThrow()
// c4b71e130000000000000000000000000000000000000000000000000000000000000001...
```

### Rlp to Bytes

```tsx
import { RlpString, RlpList } from "@hazae41/cubane"
import { Writable } from "@hazae41/binary"

const cat = RlpString.from(Bytes.fromUtf8("cat"))
const dog = RlpString.from(Bytes.fromUtf8("dog"))
const catAndDog = RlpList.from([cat, dog])

const bytes = Writable.writeToBytesOrThrow(catAndDog)
```

### Rlp to Hex

```tsx
import { RlpString, RlpList } from "@hazae41/cubane"
import { Writable } from "@hazae41/binary"

const cat = RlpString.from(Bytes.fromUtf8("cat"))
const dog = RlpString.from(Bytes.fromUtf8("dog"))
const catAndDog = RlpList.from([cat, dog])

const bytes = Writable.writeToBytesOrThrow(catAndDog)
const hex = "0x" + Base16.get().encodeOrThrow(bytes)
```