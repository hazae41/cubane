export * from "./abstract/index.js";
export * from "./bytes/index.js";
export * from "./external/index.js";
export * from "./zerohex/index.js";

import { Base16 } from "@hazae41/base16";
import { Owned } from "@hazae41/box";
import { Bytes } from "@hazae41/bytes";
import { RawHexString, ZeroHexString } from "@hazae41/hexane";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { AddressString } from "mods/address/index.js";
import { BytesAsText } from "mods/convert/index.js";
import { ExternalSignature } from "../signature/external/index.js";
import { RsvBytesSignature } from "../signature/rsvbytes/index.js";
import { ExternalVerifyingKey } from "../verifying/index.js";
import { BytesSigningKey, BytesSigningKeyInit } from "./bytes/index.js";
import { ExternalSigningKey, ExternalSigningKeyInit } from "./external/index.js";
import { ZeroHexSigningKey, ZeroHexSigningKeyInit } from "./zerohex/index.js";

export type SigningKey =
  | ZeroHexSigningKey
  | BytesSigningKey
  | ExternalSigningKey

export type SigningKeyInit =
  | ZeroHexSigningKeyInit
  | BytesSigningKeyInit
  | ExternalSigningKeyInit

export namespace SigningKey {

  export type From = SigningKey | SigningKeyInit

  export function fromOrThrow(from: From): SigningKey {
    if (from instanceof ZeroHexSigningKey)
      return from
    if (from instanceof BytesSigningKey)
      return from
    if (from instanceof ExternalSigningKey)
      return from

    if (from instanceof Secp256k1.SigningKey)
      return ExternalSigningKey.fromOrThrow(from)
    if (from instanceof Uint8Array)
      return BytesSigningKey.fromOrThrow(from)
    return ZeroHexSigningKey.fromOrThrow(from)
  }

}

export namespace SigningKey {

  export function randomOrThrow() {
    return ExternalSigningKey.randomOrThrow()
  }

  export function getVerifyingKeyOrThrow(signingKey: ExternalSigningKey.From): ExternalVerifyingKey {
    using extSigningKey = ExternalSigningKey.fromOrThrow(signingKey)
    const verifyingKeyExt = extSigningKey.value.getVerifyingKeyOrThrow()

    return new ExternalVerifyingKey(new Owned(verifyingKeyExt))
  }

  export function getUncheckedAddressOrThrow(signingKey: ExternalSigningKey.From): ZeroHexString<20> {
    using extSigningKey = ExternalSigningKey.fromOrThrow(signingKey)

    using verifyingKeyExt = extSigningKey.value.getVerifyingKeyOrThrow()
    using verifyingKeyMemoryExt = verifyingKeyExt.exportUncompressedOrThrow()

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyMemoryExt.bytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return `0x${rawLowerCase.slice(-40)}` as ZeroHexString<20>
  }

  export function getAddressOrThrow(signingKey: ExternalSigningKey.From): AddressString {
    using extSigningKey = ExternalSigningKey.fromOrThrow(signingKey)

    using verifyingKeyExt = extSigningKey.value.getVerifyingKeyOrThrow()
    using verifyingKeyMemoryExt = verifyingKeyExt.exportUncompressedOrThrow()

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyMemoryExt.bytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return AddressString.fromRawHexOrThrow(rawLowerCase.slice(-40) as RawHexString<20>)
  }

  export function signUnprefixedMessageNoOffsetOrThrow(signingKey: ExternalSigningKey.From, message: BytesAsText.From): ExternalSignature {
    using extSigningKey = ExternalSigningKey.fromOrThrow(signingKey)
    const messageBytes = BytesAsText.fromOrThrow(message)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
    const signatureExt = extSigningKey.value.signOrThrow(hashMemoryExt)

    return new ExternalSignature(new Owned(signatureExt))
  }

  export function signUnprefixedMessageOrThrow(signingKey: ExternalSigningKey.From, message: BytesAsText.From): RsvBytesSignature {
    using signatureExt = signUnprefixedMessageNoOffsetOrThrow(signingKey, message)
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signatureExt)

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v + 27

    return new RsvBytesSignature(r, s, v)
  }

  export function signMessageNoOffsetOrThrow(signingKey: ExternalSigningKey.From, message: BytesAsText.From): ExternalSignature {
    using extSigningKey = ExternalSigningKey.fromOrThrow(signingKey)
    const messageBytes = BytesAsText.fromOrThrow(message)

    const prefixBytes = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
    const concatBytes = Bytes.concat([prefixBytes, messageBytes])

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(concatBytes)
    const signatureExt = extSigningKey.value.signOrThrow(hashMemoryExt)

    return new ExternalSignature(new Owned(signatureExt))
  }

  export function signMessageOrThrow(signingKey: ExternalSigningKey.From, message: BytesAsText.From): RsvBytesSignature {
    using signatureExt = signMessageNoOffsetOrThrow(signingKey, message)
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signatureExt)

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v + 27

    return new RsvBytesSignature(r, s, v)
  }

}