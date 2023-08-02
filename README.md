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