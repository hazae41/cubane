import { Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { BytesAsInteger, ZeroHexAsInteger } from "mods/convert/index.js";
import { RlpEip1559Transaction } from "./index.js";

{
  const rlp = Writable.writeToBytesOrThrow(RlpEip1559Transaction.fromOrThrow({
    chainId: 1n,
    nonce: 1n,
    maxPriorityFeePerGas: 1n,
    maxFeePerGas: 1n,
    gasLimit: 1n,
    to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    value: 1n,
  }).encodeOrThrow())

  const cursor = new Cursor(new Uint8Array(1 + rlp.length))
  cursor.writeUint8OrThrow(2)
  cursor.writeOrThrow(rlp)

  console.log(cursor.bytes)

  const hex = ZeroHexAsInteger.fromOrThrow(cursor.bytes)

  console.log(hex)
}

const cursor = new Cursor(BytesAsInteger.fromOrThrow("0x02f872058084388c42998551f34faa7d825208948edf373f2869b5a61ab53094f9cdafa6d22c7d5e87038d7ea4c6800080c001a0c7f413a62bd57714e239f5ef490c28d94acde3280e65b02f8a699c424e34f04fa04dd68c6163c205bc427f557394bbaed55a8b4b5971b8a81d5ff302dd156e3b6c"))
cursor.readUint8OrThrow()


