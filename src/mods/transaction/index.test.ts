import { Base16 } from "@hazae41/base16";
import { Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { BytesAsInteger, ZeroHexAsInteger } from "mods/convert/index.js";
import { Rlp } from "mods/index.js";
import { RsvBytesSignature, SigningKey } from "mods/secp256k1/index.js";
import { RlpEip1559Transaction } from "./index.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

{
  const tx = RlpEip1559Transaction.fromOrThrow({
    chainId: 1n,
    nonce: 1n,
    maxPriorityFeePerGas: 1n,
    maxFeePerGas: 1n,
    gasLimit: 1n,
    to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    value: 1n,
  })

  const bytes = Writable.writeToBytesOrThrow(tx.encodeOrThrow())
  const cursor = new Cursor(new Uint8Array(1 + bytes.length))
  cursor.writeUint8OrThrow(2)
  cursor.writeOrThrow(bytes)

  const signature = SigningKey.signUnprefixedMessageNoOffsetOrThrow(SigningKey.randomOrThrow(), cursor.bytes)
  const { r, s, v } = RsvBytesSignature.fromOrThrow(signature)

  const rlp2 = Rlp.fromOrThrow([...tx.encodeOrThrow().intoOrThrow(), BytesAsInteger.fromOrThrow(v), r, s])
  const bytes2 = Writable.writeToBytesOrThrow(rlp2)
  const cursor2 = new Cursor(new Uint8Array(1 + bytes2.length))
  cursor2.writeUint8OrThrow(2)
  cursor2.writeOrThrow(bytes2)

  const hex = ZeroHexAsInteger.fromOrThrow(cursor2.bytes)

  console.log(hex)
}

// const cursor = new Cursor(BytesAsInteger.fromOrThrow("0x02f872058084388c42998551f34faa7d825208948edf373f2869b5a61ab53094f9cdafa6d22c7d5e87038d7ea4c6800080c001a0c7f413a62bd57714e239f5ef490c28d94acde3280e65b02f8a699c424e34f04fa04dd68c6163c205bc427f557394bbaed55a8b4b5971b8a81d5ff302dd156e3b6c"))
// cursor.readUint8OrThrow()


