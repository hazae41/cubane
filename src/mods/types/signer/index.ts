import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { BytesAsUtf8 } from "../helpers/generic.js";
import { ExtSignature } from "../signature/index.js";

export class ExtPrivateKey {

  constructor(
    readonly value: Secp256k1.PrivateKey
  ) { }

  getPublicKeyOrThrow() {
    return new ExtPublicKey(this.value.getPublicKeyOrThrow())
  }

  signUnsafeMessageOrThrow(message: BytesAsUtf8.From) {
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    using hash = Keccak256.get().hashOrThrow(tmessage)

    return new ExtSignature(this.value.signOrThrow(hash))
  }

  signPersonalMessageOrThrow(message: BytesAsUtf8.From) {
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
    const concat = Bytes.concat([prefix, tmessage])

    using hash = Keccak256.get().hashOrThrow(concat)

    return new ExtSignature(this.value.signOrThrow(hash))
  }

}

export class ExtPublicKey {

  constructor(
    readonly value: Secp256k1.PublicKey
  ) { }

  static recoverUnsafeMessageOrThrow(message: BytesAsUtf8.From, signature: ExtSignature.From) {
    const tmessage = BytesAsUtf8.fromOrThrow(message)
    const tsignature = ExtSignature.fromOrThrow(signature)

    using hash = Keccak256.get().hashOrThrow(tmessage)

    const inner = Secp256k1.get().PublicKey.recoverOrThrow(hash, tsignature.value)

    return new ExtPublicKey(inner)
  }

  verifyUnsafeMessageOrThrow(message: BytesAsUtf8.From, signature: ExtSignature.From) {
    const tmessage = BytesAsUtf8.fromOrThrow(message)
    const tsignature = ExtSignature.fromOrThrow(signature)

    using hash = Keccak256.get().hashOrThrow(tmessage)
    using recovered = Secp256k1.get().PublicKey.recoverOrThrow(hash, tsignature.value)

    using left = this.value.exportUncompressedOrThrow()
    using right = recovered.exportUncompressedOrThrow()

    return Bytes.equals(left.bytes, right.bytes)
  }

  static recoverPersonalMessageOrThrow(message: BytesAsUtf8.From, signature: ExtSignature.From) {
    const tmessage = BytesAsUtf8.fromOrThrow(message)
    const tsignature = ExtSignature.fromOrThrow(signature)

    const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
    const concat = Bytes.concat([prefix, tmessage])

    using hash = Keccak256.get().hashOrThrow(concat)

    const inner = Secp256k1.get().PublicKey.recoverOrThrow(hash, tsignature.value)

    return new ExtPublicKey(inner)
  }

  verifyPersonalMessageOrThrow(message: BytesAsUtf8.From, signature: ExtSignature.From) {
    const tmessage = BytesAsUtf8.fromOrThrow(message)
    const tsignature = ExtSignature.fromOrThrow(signature)

    const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
    const concat = Bytes.concat([prefix, tmessage])

    using hash = Keccak256.get().hashOrThrow(concat)
    using recovered = Secp256k1.get().PublicKey.recoverOrThrow(hash, tsignature.value)

    using left = this.value.exportUncompressedOrThrow()
    using right = recovered.exportUncompressedOrThrow()

    return Bytes.equals(left.bytes, right.bytes)
  }

}