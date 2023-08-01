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

```tsx
const hex = tryEncode("f(bool,uint256,(string,address[3])[],bytes)",
  StaticBool.new(true),
  Uint256.new(123456789n),
  DynamicVector.any.new(
    DynamicTuple.any.new(
      DynamicString.new("hello world"),
      DynamicArray.any.new(
        StaticAddress.new("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"),
        StaticAddress.new("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"),
        StaticAddress.new("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
      )
    ),
  ),
  DynamicBytes.new(new Uint8Array([1, 2, 3]))
).unwrap()
```