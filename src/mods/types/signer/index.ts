import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { WasmSignature } from "../signature/index.js";
import { BytesString } from "../string/index.js";

export class WasmPrivateKey {

  constructor(
    readonly value: Secp256k1.PrivateKey
  ) { }

  getPublicKeyOrThrow() {
    return new WasmPublicKey(this.value.getPublicKeyOrThrow())
  }

  signUnsafeMessageOrThrow(message: BytesString.From) {
    return new WasmSignature(this.value.signOrThrow(BytesString.fromOrThrow(message)))
  }

  signPersonalMessageOrThrow(message: BytesString.From) {
    const bytesm = BytesString.fromOrThrow(message)
    const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + bytesm.length.toString())

    const concat = Bytes.concat([prefix, bytesm])
    using hash = Keccak256.get().hashOrThrow(concat)

    return new WasmSignature(this.value.signOrThrow(hash))
  }

}

export class WasmPublicKey {

  constructor(
    readonly value: Secp256k1.PublicKey
  ) { }

}