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

```bash
npm i @hazae41/morax
```

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

```typescript
import { Base16 } from "@hazae41/base16"

Base16.set(await Base16.fromBufferOrAlocer())
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
const hex = tryEncode(signature.args.from(true, 123456789n, "hello world")).unwrap()
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
const hex = tryEncode(f.args.from(true, 123456789n, "hello world")).unwrap()
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