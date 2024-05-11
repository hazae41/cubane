import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { WasmSignature } from "../signature/index.js";
import { BytesUtf8 } from "../string/index.js";

export class WasmPrivateKey {

  constructor(
    readonly value: Secp256k1.PrivateKey
  ) { }

  getPublicKeyOrThrow() {
    return new WasmPublicKey(this.value.getPublicKeyOrThrow())
  }

  signUnsafeMessageOrThrow(message: BytesUtf8.From) {
    const bytesm = BytesUtf8.fromOrThrow(message)
    using hash = Keccak256.get().hashOrThrow(bytesm)

    return new WasmSignature(this.value.signOrThrow(hash))
  }

  signPersonalMessageOrThrow(message: BytesUtf8.From) {
    const bytesm = BytesUtf8.fromOrThrow(message)
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

  static recoverUnsafeMessageOrThrow(message: BytesUtf8.From, signature: WasmSignature) {
    const bytesm = BytesUtf8.fromOrThrow(message)
    using hash = Keccak256.get().hashOrThrow(bytesm)

    const inner = Secp256k1.get().PublicKey.recoverOrThrow(hash, signature.value)

    return new WasmPublicKey(inner)
  }

  verifyUnsafeMessageOrThrow(message: BytesUtf8.From, signature: WasmSignature) {
    const bytesm = BytesUtf8.fromOrThrow(message)
    using hash = Keccak256.get().hashOrThrow(bytesm)

    using recovered = Secp256k1.get().PublicKey.recoverOrThrow(hash, signature.value)

    using left = this.value.exportCompressedOrThrow()
    using right = recovered.exportCompressedOrThrow()

    return Bytes.equals(left.bytes, right.bytes)
  }

}