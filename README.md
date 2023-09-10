# Cubane

Next-gen Ethereum library for TypeScript

```bash
npm i @hazae41/cubane
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/cubane)

## Features

### Current features
- 100% TypeScript and ESM
- Minimal dependencies
- Rust-like patterns
- Zero-copy ABI coding
- Zero-copy RLP coding
- Human-readable code
- Bottom-up abstractions
- High-performance codegen
- Bring your own algorithms

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

```tsx
import { Morax } from "@hazae41/morax";
import { Keccak256 } from "@hazae41/keccak256";

await Morax.initBundledOnce()
Keccak256.set(Keccak256.fromMorax(Morax))
```

See https://github.com/hazae41/keccak256 for more

#### Base16 (optional)

Alocer includes a fast WebAssembly port of Base16

```tsx
import { Alocer } from "@hazae41/alocer";
import { Base16 } from "@hazae41/base16";

await Alocer.initBundledOnce()
Base16.set(Base16.fromBufferOrAlocer(Alocer))
```

See https://github.com/hazae41/base16 for more

## Usage

### Abi to Hex (runtime)

Parse the function from its signature

```tsx
const signature = FunctionSignature.tryParse("f(bool,uint256,string)").unwrap()
```

Encode the function selector and its arguments (it will return a `0x`-prefixed hex string)

```tsx
const hex = tryEncode(signature, true, 123456789n, "hello world").unwrap()
// 0xc4b71e130000000000000000000000000000000000000000000000000000000000000001...
```

### Abi to Hex (codegen)

Generate the function from its signature

```tsx
> console.log(FunctionSignature.tryParse("f(bool,uint256,string)").unwrap().codegen())
```

Paste it in a file `f.abi.ts`

```tsx
export const f = /*generated code*/
```

Encode the function selector and its arguments (it will return a `0x`-prefixed hex string)

```tsx
const hex = tryEncode(f, true, 123456789n, "hello world").unwrap()
// 0xc4b71e130000000000000000000000000000000000000000000000000000000000000001...
```

### Rlp to Bytes

```tsx
const cat = RlpString.from(Bytes.fromUtf8("cat"))
const dog = RlpString.from(Bytes.fromUtf8("dog"))
const catAndDog = RlpList.from([cat, dog])

const bytes = Writable.tryWriteToBytes(catAndDog).unwrap()
```

### Rlp to Hex

```tsx
const cat = RlpString.from(Bytes.fromUtf8("cat"))
const dog = RlpString.from(Bytes.fromUtf8("dog"))
const catAndDog = RlpList.from([cat, dog])

const bytes = Writable.tryWriteToBytes(catAndDog).unwrap()
const hex = "0x" + Base16.get().tryEncode(bytes).unwrap()
```