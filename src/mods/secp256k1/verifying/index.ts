import { Base16 } from "@hazae41/base16";
import { Box } from "@hazae41/box";
import { Bytes, Uint8Array } from "@hazae41/bytes";
import { RawHexString, ZeroHexString } from "@hazae41/hexane";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { Address } from "mods/address/index.js";
import { BytesAsInteger, BytesAsUtf8, ZeroHexAsInteger } from "mods/convert/index.js";
import { ExtSignature, RsvBytesSignature, Signature } from "../signature/index.js";

export function recoverUnprefixedMessageOrThrow(signature: Signature.From, message: BytesAsUtf8.From) {
  const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

  if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
    throw new Error("Unshifted signature")

  const { r, s } = signatureRsvBytes
  const v = signatureRsvBytes.v - 27

  using signatureExtBox = ExtSignature.fromRsvOrThrow({ r, s, v })
  const messageBytes = BytesAsUtf8.fromOrThrow(message)

  using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
  const recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashMemoryExt, signatureExtBox.get())

  return recoveredVerifyingKeyExt
}

export function recoverMessageOrThrow(signature: Signature.From, message: BytesAsUtf8.From) {
  const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

  if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
    throw new Error("Unshifted signature")

  const { r, s } = signatureRsvBytes
  const v = signatureRsvBytes.v - 27

  using signatureExtBox = ExtSignature.fromRsvOrThrow({ r, s, v })
  const messageBytes = BytesAsUtf8.fromOrThrow(message)

  const prefixExt = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
  const concatExt = Bytes.concat([prefixExt, messageBytes])

  using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(concatExt)
  const recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashMemoryExt, signatureExtBox.get())

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

  export function getUncheckedAddressOrThrow(verifyingKey: VerifyingKey.From) {
    const verifyingKeyBytes = BytesVerifyingKey.fromOrThrow(verifyingKey)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyBytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return `0x${rawLowerCase.slice(-40)}` as ZeroHexString<20>
  }

  export function getAddressOrThrow(verifyingKey: VerifyingKey.From) {
    const verifyingKeyBytes = BytesVerifyingKey.fromOrThrow(verifyingKey)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyBytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return Address.fromRawHexOrThrow(rawLowerCase.slice(-40) as RawHexString<20>)
  }

  export function verifyUnprefixedMessageOrThrow(verifyingKey: VerifyingKey.From, signature: Signature.From, message: BytesAsUtf8.From) {
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

    if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
      throw new Error("Unshifted signature")

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v - 27

    const verifyingKeyBytes = BytesVerifyingKey.fromOrThrow(verifyingKey)
    using signatureExtBox = ExtSignature.fromRsvOrThrow({ r, s, v })
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
    using recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashMemoryExt, signatureExtBox.get())
    using recoveredVerifyingKeyMemoryExt = recoveredVerifyingKeyExt.exportUncompressedOrThrow()

    return Bytes.equals(verifyingKeyBytes, recoveredVerifyingKeyMemoryExt.bytes)
  }

  export function verifyMessageOrThrow(verifyingKey: VerifyingKey.From, signature: Signature.From, message: BytesAsUtf8.From) {
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

    if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
      throw new Error("Unshifted signature")

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v - 27

    const verifyingKeyBytes = BytesVerifyingKey.fromOrThrow(verifyingKey)
    using signatureExtBox = ExtSignature.fromRsvOrThrow({ r, s, v })
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    const prefixBytes = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
    const concatBytes = Bytes.concat([prefixBytes, messageBytes])

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(concatBytes)
    using recoveredVerifiyngKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashMemoryExt, signatureExtBox.get())
    using recoveredVerifyingKeyMemoryExt = recoveredVerifiyngKeyExt.exportUncompressedOrThrow()

    return Bytes.equals(verifyingKeyBytes, recoveredVerifyingKeyMemoryExt.bytes)
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