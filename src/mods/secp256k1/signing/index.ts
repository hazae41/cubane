import { Base16 } from "@hazae41/base16";
import { Box } from "@hazae41/box";
import { Bytes, Uint8Array } from "@hazae41/bytes";
import { RawHexString, ZeroHexString } from "@hazae41/hexane";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { AddressString } from "mods/address/index.js";
import { BytesAsInteger, BytesAsUtf8, ZeroHexAsInteger } from "mods/convert/index.js";
import { ExtSignature, RsvBytesSignature } from "../signature/index.js";
import { ExtVerifyingKey } from "../verifying/index.js";

export type SigningKey =
  | ZeroHexSigningKey
  | BytesSigningKey
  | ExtSigningKey

export namespace SigningKey {

  export type From =
    | ZeroHexSigningKey.Lose
    | BytesSigningKey.Lose
    | ExtSigningKey.Lose

  export function randomOrThrow() {
    return ExtSigningKey.randomOrThrow()
  }

  export function getVerifyingKeyOrThrow(signingKey: SigningKey.From): ExtVerifyingKey {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)
    return signingKeyExtBox.get().getVerifyingKeyOrThrow()
  }

  export function getUncheckedAddressOrThrow(signingKey: SigningKey.From): ZeroHexString<20> {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)

    using verifyingKeyExt = signingKeyExtBox.get().getVerifyingKeyOrThrow()
    using verifyingKeyMemoryExt = verifyingKeyExt.exportUncompressedOrThrow()

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyMemoryExt.bytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return `0x${rawLowerCase.slice(-40)}` as ZeroHexString<20>
  }

  export function getAddressOrThrow(signingKey: SigningKey.From): AddressString {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)

    using verifyingKeyExt = signingKeyExtBox.get().getVerifyingKeyOrThrow()
    using verifyingKeyMemoryExt = verifyingKeyExt.exportUncompressedOrThrow()

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyMemoryExt.bytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return AddressString.fromRawHexOrThrow(rawLowerCase.slice(-40) as RawHexString<20>)
  }

  export function signUnprefixedMessageNoOffsetOrThrow(signingKey: SigningKey.From, message: BytesAsUtf8.From): ExtSignature {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
    return signingKeyExtBox.get().signOrThrow(hashMemoryExt)
  }

  export function signUnprefixedMessageOrThrow(signingKey: SigningKey.From, message: BytesAsUtf8.From): RsvBytesSignature {
    using signatureExt = signUnprefixedMessageNoOffsetOrThrow(signingKey, message)
    const signatureRsvBytes = RsvBytesSignature.fromExtOrThrow(signatureExt)

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v + 27

    return { r, s, v }
  }

  export function signMessageNoOffsetOrThrow(signingKey: SigningKey.From, message: BytesAsUtf8.From): ExtSignature {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    const prefixBytes = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
    const concatBytes = Bytes.concat([prefixBytes, messageBytes])

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(concatBytes)
    return signingKeyExtBox.get().signOrThrow(hashMemoryExt)
  }

  export function signMessageOrThrow(signingKey: SigningKey.From, message: BytesAsUtf8.From): RsvBytesSignature {
    using signatureExt = signMessageNoOffsetOrThrow(signingKey, message)
    const signatureRsvBytes = RsvBytesSignature.fromExtOrThrow(signatureExt)

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v + 27

    return { r, s, v }
  }


}

export type ZeroHexSigningKey = ZeroHexString<32>

export namespace ZeroHexSigningKey {

  export type Lose = ZeroHexAsInteger.From

  export type From = SigningKey.From

  export function fromOrThrow(from: ZeroHexSigningKey.From): ZeroHexSigningKey {
    if (from instanceof Secp256k1.SigningKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSigningKey): ZeroHexSigningKey {
    using slice = from.exportOrThrow()

    const base16 = Base16.get().getOrThrow().encodeOrThrow(slice.bytes)

    return `0x${base16}` as ZeroHexString<32>
  }

  export function fromOtherOrThrow(from: ZeroHexAsInteger.From): ZeroHexSigningKey {
    return ZeroHexAsInteger.Length.fromOrThrow(from, 32)
  }

  export function getVerifyingKeyOrThrow(signingKey: ZeroHexSigningKey.From) {
    return SigningKey.getVerifyingKeyOrThrow(signingKey)
  }

  export function getUncheckedAddressOrThrow(signingKey: ZeroHexSigningKey.From) {
    return SigningKey.getUncheckedAddressOrThrow(signingKey)
  }

  export function getAddressOrThrow(signingKey: ZeroHexSigningKey.From) {
    return SigningKey.getAddressOrThrow(signingKey)
  }

  export function signUnprefixedMessageNoOffsetOrThrow(signingKey: ZeroHexSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageNoOffsetOrThrow(signingKey, message)
  }

  export function signUnprefixedMessageOrThrow(signingKey: ZeroHexSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageOrThrow(signingKey, message)
  }

  export function signMessageNoOffsetOrThrow(signingKey: ZeroHexSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signMessageNoOffsetOrThrow(signingKey, message)
  }

  export function signMessageOrThrow(signingKey: ZeroHexSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signMessageOrThrow(signingKey, message)
  }

}

export type BytesSigningKey = Uint8Array<32>

export namespace BytesSigningKey {

  export type Lose = BytesAsInteger.From

  export type From = SigningKey.From

  export function fromOrThrow(from: BytesSigningKey.From): BytesSigningKey {
    if (from instanceof Secp256k1.SigningKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSigningKey): BytesSigningKey {
    return Copiable.copyAndDispose(from.exportOrThrow()) as Uint8Array<32>
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): BytesSigningKey {
    return BytesAsInteger.Length.fromOrThrow(from, 32)
  }

  export function getVerifyingKeyOrThrow(signingKey: BytesSigningKey.From) {
    return SigningKey.getVerifyingKeyOrThrow(signingKey)
  }

  export function getUncheckedAddressOrThrow(signingKey: BytesSigningKey.From) {
    return SigningKey.getUncheckedAddressOrThrow(signingKey)
  }

  export function getAddressOrThrow(signingKey: BytesSigningKey.From) {
    return SigningKey.getAddressOrThrow(signingKey)
  }

  export function signUnprefixedMessageNoOffsetOrThrow(signingKey: BytesSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageNoOffsetOrThrow(signingKey, message)
  }

  export function signUnprefixedMessageOrThrow(signingKey: BytesSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageOrThrow(signingKey, message)
  }

  export function signMessageNoOffsetOrThrow(signingKey: BytesSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signMessageNoOffsetOrThrow(signingKey, message)
  }

  export function signMessageOrThrow(signingKey: BytesSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signMessageOrThrow(signingKey, message)
  }

}

export type ExtSigningKey = Secp256k1.SigningKey

export namespace ExtSigningKey {

  export type Lose = Secp256k1.SigningKey

  export function randomOrThrow(): ExtSigningKey {
    return Secp256k1.get().getOrThrow().SigningKey.randomOrThrow()
  }

  export type From = SigningKey.From

  export function fromOrThrow(from: ExtSigningKey.From): Box<ExtSigningKey> {
    if (from instanceof Secp256k1.SigningKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSigningKey): Box<ExtSigningKey> {
    return Box.createAsDropped(from)
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): Box<ExtSigningKey> {
    return new Box(Secp256k1.get().getOrThrow().SigningKey.importOrThrow(BytesAsInteger.Length.fromOrThrow(from, 32)))
  }

  export function getVerifyingKeyOrThrow(signingKey: ExtSigningKey.From) {
    return SigningKey.getVerifyingKeyOrThrow(signingKey)
  }

  export function getUncheckedAddressOrThrow(signingKey: ExtSigningKey.From) {
    return SigningKey.getUncheckedAddressOrThrow(signingKey)
  }

  export function getAddressOrThrow(signingKey: ExtSigningKey.From) {
    return SigningKey.getAddressOrThrow(signingKey)
  }

  export function signUnprefixedMessageNoOffsetOrThrow(signingKey: ExtSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageNoOffsetOrThrow(signingKey, message)
  }

  export function signUnprefixedMessageOrThrow(signingKey: ExtSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageOrThrow(signingKey, message)
  }

  export function signMessageNoOffsetOrThrow(signingKey: ExtSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signMessageNoOffsetOrThrow(signingKey, message)
  }

  export function signMessageOrThrow(signingKey: ExtSigningKey.From, message: BytesAsUtf8.From) {
    return SigningKey.signMessageOrThrow(signingKey, message)
  }

}