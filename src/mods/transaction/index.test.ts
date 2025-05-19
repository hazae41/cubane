import { Base16 } from "@hazae41/base16";
import { Writable } from "@hazae41/binary";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Secp256k1Wasm } from "@hazae41/secp256k1.wasm";
import { Sha3Wasm } from "@hazae41/sha3.wasm";
import { ZeroHexAsInteger } from "mods/convert/index.js";
import { SigningKey } from "mods/secp256k1/index.js";
import { RlpDecodedTransaction2 } from "./index.js";

await Sha3Wasm.initBundled()
await Secp256k1Wasm.initBundled()

Base16.set(Base16.fromBuffer())
Keccak256.set(Keccak256.fromWasm(Sha3Wasm))
Secp256k1.set(Secp256k1.fromWasm(Secp256k1Wasm))

{
  const unsigned = RlpDecodedTransaction2.fromOrThrow({
    chainId: 1n,
    nonce: 1n,
    maxPriorityFeePerGas: 1n,
    maxFeePerGas: 1n,
    gasLimit: 1n,
    to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    value: 1n,
  })

  const key = SigningKey.randomOrThrow()
  const address = SigningKey.getAddressOrThrow(key)

  const signed = unsigned.signOrThrow(key)
  const encoded = signed.encodeOrThrow()

  const bytes = Writable.writeToBytesOrThrow(encoded)
  const zerohex = ZeroHexAsInteger.fromOrThrow(bytes)

  console.log(address, zerohex)
}

// const cursor = new Cursor(BytesAsInteger.fromOrThrow("0x02f872058084388c42998551f34faa7d825208948edf373f2869b5a61ab53094f9cdafa6d22c7d5e87038d7ea4c6800080c001a0c7f413a62bd57714e239f5ef490c28d94acde3280e65b02f8a699c424e34f04fa04dd68c6163c205bc427f557394bbaed55a8b4b5971b8a81d5ff302dd156e3b6c"))
// cursor.readUint8OrThrow()