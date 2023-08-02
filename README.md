# Cubane

Next-gen Ethereum library for TypeScript

## Features

### Current features
- 100% TypeScript and ESM
- Minimal dependencies
- Rust-like patterns
- Zero-copy ABI coding
- Human-readable code
- Bottom-up abstractions

## Usage

### Abi

```tsx
const hex = tryEncode("f(bool,uint256,(string,address[3])[],bytes)",
  true,
  123456789n,
  [
    [
      "hello world",
      [
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
      ]
    ],
  ],
  new Uint8Array([1, 2, 3])
).unwrap()
```