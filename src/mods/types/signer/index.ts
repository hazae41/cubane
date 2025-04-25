import { Box } from "@hazae41/box";
import { Bytes } from "@hazae41/bytes";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { BytesAsUtf8 } from "../formats/index.js";
import { ExtSignature } from "../signature/index.js";

export type SigningKey =
  | ExtSigningKey

export namespace SigningKey {

  export type From =
    | ExtSigningKey.From

  export function getVerifyingKeyOrThrow(privateKeyFrom: SigningKey.From) {
    using tsigningKey = ExtSigningKey.fromOrThrow(privateKeyFrom)
    return tsigningKey.get().getVerifyingKeyOrThrow()
  }

  export function signUnsafeMessageOrThrow(privateKey: SigningKey.From, message: BytesAsUtf8.From): ExtSignature {
    using tsigningKey = ExtSigningKey.fromOrThrow(privateKey)
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    using hash = Keccak256.get().getOrThrow().hashOrThrow(tmessage)

    return tsigningKey.get().signOrThrow(hash)
  }

  export function signPersonalMessageOrThrow(privateKey: SigningKey.From, message: BytesAsUtf8.From) {
    using tsigningKey = ExtSigningKey.fromOrThrow(privateKey)
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
    const concat = Bytes.concat([prefix, tmessage])

    using hash = Keccak256.get().getOrThrow().hashOrThrow(concat)

    return tsigningKey.get().signOrThrow(hash)
  }

}

export type ExtSigningKey = Secp256k1.SigningKey

export namespace ExtSigningKey {

  export type From = Secp256k1.SigningKey

  export function fromOrThrow(value: ExtSigningKey.From) {
    return new Box(value).moveOrThrow()
  }

}

export type VerifyingKey =
  | ExtVerifyingKey

export namespace VerifyingKey {

  export type From =
    | ExtVerifyingKey.From

  export function verifyUnsafeMessageOrThrow(verifyingKey: VerifyingKey.From, signature: ExtSignature.From, message: BytesAsUtf8.From) {
    using tverifyingKey = ExtVerifyingKey.fromOrThrow(verifyingKey)
    using tsignature = ExtSignature.fromOrThrow(signature)
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    using hash = Keccak256.get().getOrThrow().hashOrThrow(tmessage)
    using recovered = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hash, tsignature.get())

    using left = tverifyingKey.get().exportUncompressedOrThrow()
    using right = recovered.exportUncompressedOrThrow()

    return Bytes.equals(left.bytes, right.bytes)
  }


  export function verifyPersonalMessageOrThrow(verifyingKey: VerifyingKey.From, signature: ExtSignature.From, message: BytesAsUtf8.From) {
    using tverifyingKey = ExtVerifyingKey.fromOrThrow(verifyingKey)
    using tsignature = ExtSignature.fromOrThrow(signature)
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
    const concat = Bytes.concat([prefix, tmessage])

    using hash = Keccak256.get().getOrThrow().hashOrThrow(concat)
    using recovered = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hash, tsignature.get())

    using left = tverifyingKey.get().exportUncompressedOrThrow()
    using right = recovered.exportUncompressedOrThrow()

    return Bytes.equals(left.bytes, right.bytes)
  }

}

export type ExtVerifyingKey = Secp256k1.VerifyingKey

export namespace ExtVerifyingKey {

  export type From = Secp256k1.VerifyingKey

  export function fromOrThrow(value: VerifyingKey.From) {
    return new Box(value).moveOrThrow()
  }

}

export function recoverUnsafeMessageOrThrow(signature: ExtSignature.From, message: BytesAsUtf8.From) {
  using tsignature = ExtSignature.fromOrThrow(signature)
  const tmessage = BytesAsUtf8.fromOrThrow(message)

  using hash = Keccak256.get().getOrThrow().hashOrThrow(tmessage)

  return Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hash, tsignature.get())
}

export function recoverPersonalMessageOrThrow(signature: ExtSignature.From, message: BytesAsUtf8.From) {
  using tsignature = ExtSignature.fromOrThrow(signature)
  const tmessage = BytesAsUtf8.fromOrThrow(message)

  const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
  const concat = Bytes.concat([prefix, tmessage])

  using hash = Keccak256.get().getOrThrow().hashOrThrow(concat)

  return Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hash, tsignature.get())
}