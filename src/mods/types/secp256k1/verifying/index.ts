import { Base16 } from "@hazae41/base16";
import { Box } from "@hazae41/box";
import { Bytes, Uint8Array } from "@hazae41/bytes";
import { ZeroHexString } from "@hazae41/hex";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { BytesAsInteger, BytesAsUtf8, ZeroHexAsInteger } from "mods/types/formats/index.js";
import { ExtSignature, RsvBytesSignature, Signature } from "../signature/index.js";

export function recoverUnsafeMessageOrThrow(signature: Signature.From, message: BytesAsUtf8.From) {
  const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

  if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
    throw new Error("Unshifted signature")

  const { r, s } = signatureRsvBytes
  const v = signatureRsvBytes.v - 27

  using signatureExt = ExtSignature.fromRsvOrThrow({ r, s, v })
  const messageBytes = BytesAsUtf8.fromOrThrow(message)

  using hashExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
  const recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashExt, signatureExt.get())

  return recoveredVerifyingKeyExt
}

export function recoverPersonalMessageOrThrow(signature: Signature.From, message: BytesAsUtf8.From) {
  const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

  if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
    throw new Error("Unshifted signature")

  const { r, s } = signatureRsvBytes
  const v = signatureRsvBytes.v - 27

  using signatureExt = ExtSignature.fromRsvOrThrow({ r, s, v })
  const messageBytes = BytesAsUtf8.fromOrThrow(message)

  const prefixExt = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
  const concatExt = Bytes.concat([prefixExt, messageBytes])

  using hashExt = Keccak256.get().getOrThrow().hashOrThrow(concatExt)
  const recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashExt, signatureExt.get())

  return recoveredVerifyingKeyExt
}

export type VerifyingKey =
  | ZeroHexVerifyingKey
  | BytesVerifyingKey
  | ExtVerifyingKey

export namespace VerifyingKey {

  export type From =
    | ZeroHexVerifyingKey.From
    | BytesVerifyingKey.From
    | ExtVerifyingKey.From

  export function verifyUnsafeMessageOrThrow(verifyingKey: VerifyingKey.From, signature: Signature.From, message: BytesAsUtf8.From) {
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

    if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
      throw new Error("Unshifted signature")

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v - 27

    using verifyingKeyExt = ExtVerifyingKey.fromOrThrow(verifyingKey)
    using signatureExt = ExtSignature.fromRsvOrThrow({ r, s, v })
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    using hashExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
    using recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashExt, signatureExt.get())

    using leftExt = verifyingKeyExt.get().exportUncompressedOrThrow()
    using rightExt = recoveredVerifyingKeyExt.exportUncompressedOrThrow()

    return Bytes.equals(leftExt.bytes, rightExt.bytes)
  }

  export function verifyPersonalMessageOrThrow(verifyingKey: VerifyingKey.From, signature: Signature.From, message: BytesAsUtf8.From) {
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

    if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
      throw new Error("Unshifted signature")

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v - 27

    using verifyingKeyExt = ExtVerifyingKey.fromOrThrow(verifyingKey)
    using signatureExt = ExtSignature.fromRsvOrThrow({ r, s, v })
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    const prefixBytes = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
    const concatBytes = Bytes.concat([prefixBytes, messageBytes])

    using hashExt = Keccak256.get().getOrThrow().hashOrThrow(concatBytes)
    using recoveredVerifiyngKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashExt, signatureExt.get())

    using leftExt = verifyingKeyExt.get().exportUncompressedOrThrow()
    using rightExt = recoveredVerifiyngKeyExt.exportUncompressedOrThrow()

    return Bytes.equals(leftExt.bytes, rightExt.bytes)
  }

}

export type ZeroHexVerifyingKey = ZeroHexString<65>

export namespace ZeroHexVerifyingKey {

  export type From = ZeroHexAsInteger.From

  export function fromOrThrow(from: VerifyingKey.From): ZeroHexVerifyingKey {
    if (from instanceof Secp256k1.VerifyingKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtVerifyingKey): ZeroHexVerifyingKey {
    using slice = from.exportUncompressedOrThrow()

    const base16 = Base16.get().getOrThrow().encodeOrThrow(slice.bytes)

    return `0x${base16}` as ZeroHexString<65>
  }

  export function fromOtherOrThrow(from: ZeroHexAsInteger.From): ZeroHexVerifyingKey {
    return ZeroHexAsInteger.Length.fromOrThrow(from, 65)
  }

}

export type BytesVerifyingKey = Uint8Array<65>

export namespace BytesVerifyingKey {

  export type From = BytesAsInteger.From

  export function fromOrThrow(from: VerifyingKey.From): BytesVerifyingKey {
    if (from instanceof Secp256k1.VerifyingKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtVerifyingKey): BytesVerifyingKey {
    return Copiable.copyAndDispose(from.exportUncompressedOrThrow()) as Uint8Array<65>
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): BytesVerifyingKey {
    return BytesAsInteger.Length.fromOrThrow(from, 65)
  }

}

export type ExtVerifyingKey = Secp256k1.VerifyingKey

export namespace ExtVerifyingKey {

  export type From = Secp256k1.VerifyingKey

  export function fromOrThrow(from: VerifyingKey.From): Box<ExtVerifyingKey> {
    if (from instanceof Secp256k1.VerifyingKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtVerifyingKey): Box<ExtVerifyingKey> {
    return Box.createAsDropped(from)
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): Box<ExtVerifyingKey> {
    return new Box(Secp256k1.get().getOrThrow().VerifyingKey.importOrThrow(BytesAsInteger.Length.fromOrThrow(from, 65)))
  }

}