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

  signPersonalMessageOrThrow(message: BytesString.From) {
    return new WasmSignature(this.value.signOrThrow(BytesString.fromOrThrow(message)))
  }

}

export class WasmPublicKey {

  constructor(
    readonly value: Secp256k1.PublicKey
  ) { }

}