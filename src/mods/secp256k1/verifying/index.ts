export * from "./abstract/index.js";
export * from "./bytes/index.js";
export * from "./external/index.js";
export * from "./zerohex/index.js";

import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { RawHexString, ZeroHexString } from "@hazae41/hexane";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { AddressString } from "mods/address/index.js";
import { BytesAsUtf8 } from "mods/convert/index.js";
import { ExternalSignature } from "../signature/external/index.js";
import { RsvBytesSignature } from "../signature/rsvbytes/index.js";
import { BytesVerifyingKey, BytesVerifyingKeyInit } from "./bytes/index.js";
import { ExternalVerifyingKey, ExternalVerifyingKeyInit } from "./external/index.js";
import { ZeroHexVerifyingKey, ZeroHexVerifyingKeyInit } from "./zerohex/index.js";

export function recoverUnprefixedMessageOrThrow(signature: RsvBytesSignature.From, message: BytesAsUtf8.From) {
  const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

  if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
    throw new Error("Unshifted signature")

  const { r, s } = signatureRsvBytes
  const v = signatureRsvBytes.v - 27

  using extSignature = ExternalSignature.fromOrThrow({ r, s, v })
  const messageBytes = BytesAsUtf8.fromOrThrow(message)

  using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
  const recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashMemoryExt, extSignature.value)

  return recoveredVerifyingKeyExt
}

export function recoverMessageOrThrow(signature: RsvBytesSignature.From, message: BytesAsUtf8.From) {
  const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

  if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
    throw new Error("Unshifted signature")

  const { r, s } = signatureRsvBytes
  const v = signatureRsvBytes.v - 27

  using extSignature = ExternalSignature.fromOrThrow({ r, s, v })
  const messageBytes = BytesAsUtf8.fromOrThrow(message)

  const prefixBytes = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
  const concatBytes = Bytes.concat([prefixBytes, messageBytes])

  using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(concatBytes)
  const recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashMemoryExt, extSignature.value)

  return recoveredVerifyingKeyExt
}

export type VerifyingKeyInit =
  | ZeroHexVerifyingKeyInit
  | BytesVerifyingKeyInit
  | ExternalVerifyingKeyInit

export type VerifyingKey =
  | ZeroHexVerifyingKey
  | BytesVerifyingKey
  | ExternalVerifyingKey

export namespace VerifyingKey {

  export type From = VerifyingKey | VerifyingKeyInit

  export function fromOrThrow(from: From): VerifyingKey {
    if (from instanceof BytesVerifyingKey)
      return from
    if (from instanceof ZeroHexVerifyingKey)
      return from
    if (from instanceof ExternalVerifyingKey)
      return from

    if (from instanceof Secp256k1.VerifyingKey)
      return ExternalVerifyingKey.fromOrThrow(from)
    if (from instanceof Uint8Array)
      return BytesVerifyingKey.fromOrThrow(from)
    return ZeroHexVerifyingKey.fromOrThrow(from)
  }

}

export namespace VerifyingKey {

  export function getUncheckedAddressOrThrow(verifyingKey: BytesVerifyingKey.From) {
    const verifyingKeyBytes = BytesVerifyingKey.fromOrThrow(verifyingKey)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyBytes.value.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return `0x${rawLowerCase.slice(-40)}` as ZeroHexString<20>
  }

  export function getAddressOrThrow(verifyingKey: BytesVerifyingKey.From) {
    const verifyingKeyBytes = BytesVerifyingKey.fromOrThrow(verifyingKey)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyBytes.value.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return AddressString.fromRawHexOrThrow(rawLowerCase.slice(-40) as RawHexString<20>)
  }

  export function verifyUnprefixedMessageOrThrow(verifyingKey: BytesVerifyingKey.From, signature: RsvBytesSignature.From, message: BytesAsUtf8.From) {
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

    if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
      throw new Error("Unshifted signature")

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v - 27

    const verifyingKeyBytes = BytesVerifyingKey.fromOrThrow(verifyingKey)
    using signatureExtBox = ExternalSignature.fromOrThrow({ r, s, v })
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
    using recoveredVerifyingKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashMemoryExt, signatureExtBox.value)
    using recoveredVerifyingKeyMemoryExt = recoveredVerifyingKeyExt.exportUncompressedOrThrow()

    return Bytes.equals(verifyingKeyBytes.value, recoveredVerifyingKeyMemoryExt.bytes)
  }

  export function verifyMessageOrThrow(verifyingKey: BytesVerifyingKey.From, signature: RsvBytesSignature.From, message: BytesAsUtf8.From) {
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signature)

    if (signatureRsvBytes.v !== 27 && signatureRsvBytes.v !== 28)
      throw new Error("Unshifted signature")

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v - 27

    const verifyingKeyBytes = BytesVerifyingKey.fromOrThrow(verifyingKey)
    using signatureExtBox = ExternalSignature.fromOrThrow({ r, s, v })
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    const prefixBytes = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
    const concatBytes = Bytes.concat([prefixBytes, messageBytes])

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(concatBytes)
    using recoveredVerifiyngKeyExt = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hashMemoryExt, signatureExtBox.value)
    using recoveredVerifyingKeyMemoryExt = recoveredVerifiyngKeyExt.exportUncompressedOrThrow()

    return Bytes.equals(verifyingKeyBytes.value, recoveredVerifyingKeyMemoryExt.bytes)
  }

}