import { Base16 } from "@hazae41/base16";
import { Box } from "@hazae41/box";
import { Bytes, Uint8Array } from "@hazae41/bytes";
import { RawHexString, ZeroHexString } from "@hazae41/hex";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { Address } from "mods/types/address/index.js";
import { BytesAsInteger, BytesAsUtf8, ZeroHexAsInteger } from "mods/types/formats/index.js";
import { RsvBytesSignature } from "../signature/index.js";

export type SigningKey =
  | ZeroHexSigningKey
  | BytesSigningKey
  | ExtSigningKey

export namespace SigningKey {

  export type From =
    | ZeroHexSigningKey.From
    | BytesSigningKey.From
    | ExtSigningKey.From

  export function randomOrThrow(): ExtSigningKey {
    return Secp256k1.get().getOrThrow().SigningKey.randomOrThrow()
  }

  export function getVerifyingKeyOrThrow(signingKey: SigningKey.From) {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)
    const verifyingKeyExt = signingKeyExtBox.get().getVerifyingKeyOrThrow()

    return verifyingKeyExt
  }

  export function getUncheckedAddressOrThrow(signingKey: SigningKey.From) {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)

    using verifyingKeyExt = signingKeyExtBox.get().getVerifyingKeyOrThrow()
    using verifyingKeyMemoryExt = verifyingKeyExt.exportUncompressedOrThrow()

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyMemoryExt.bytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return `0x${rawLowerCase.slice(-40)}` as ZeroHexString<20>
  }

  export function getAddressOrThrow(signingKey: SigningKey.From) {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)

    using verifyingKeyExt = signingKeyExtBox.get().getVerifyingKeyOrThrow()
    using verifyingKeyMemoryExt = verifyingKeyExt.exportUncompressedOrThrow()

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(verifyingKeyMemoryExt.bytes.subarray(1))
    const rawLowerCase = Base16.get().getOrThrow().encodeOrThrow(hashMemoryExt)

    return Address.fromRawHexOrThrow(rawLowerCase.slice(-40) as RawHexString)
  }

  export function signUnprefixedMessageOrThrow(signingKey: SigningKey.From, message: BytesAsUtf8.From): RsvBytesSignature {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
    using signatureExt = signingKeyExtBox.get().signOrThrow(hashMemoryExt)

    const signatureRsvBytes = RsvBytesSignature.fromExtOrThrow(signatureExt)

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v + 27

    return { r, s, v }
  }

  export function signMessageOrThrow(signingKey: SigningKey.From, message: BytesAsUtf8.From): RsvBytesSignature {
    using signingKeyExtBox = ExtSigningKey.fromOrThrow(signingKey)
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    const prefixBytes = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
    const concatBytes = Bytes.concat([prefixBytes, messageBytes])

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(concatBytes)
    using signatureExt = signingKeyExtBox.get().signOrThrow(hashMemoryExt)

    const signatureRsvBytes = RsvBytesSignature.fromExtOrThrow(signatureExt)

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v + 27

    return { r, s, v }
  }

}

export type ZeroHexSigningKey = ZeroHexString<32>

export namespace ZeroHexSigningKey {

  export type From = ZeroHexAsInteger.From

  export function fromOrThrow(from: SigningKey.From): ZeroHexSigningKey {
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

}

export type BytesSigningKey = Uint8Array<32>

export namespace BytesSigningKey {

  export type From = BytesAsInteger.From

  export function fromOrThrow(from: SigningKey.From): BytesSigningKey {
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

}

export type ExtSigningKey = Secp256k1.SigningKey

export namespace ExtSigningKey {

  export type From = Secp256k1.SigningKey

  export function fromOrThrow(from: SigningKey.From): Box<ExtSigningKey> {
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

}