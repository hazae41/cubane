import { Base16 } from "@hazae41/base16";
import { Box } from "@hazae41/box";
import { Bytes, Uint8Array } from "@hazae41/bytes";
import { RawHexString, ZeroHexString } from "@hazae41/hexane";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { AddressString } from "mods/address/index.js";
import { BytesAsInteger, BytesAsUtf8, CopiableBytesAsInteger, ZeroHexAsInteger } from "mods/convert/index.js";
import { ExternalSignature } from "../signature/external/index.js";
import { RsvBytesSignature } from "../signature/rsvbytes/index.js";

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

export abstract class AbstractVerifyingKey { }

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

export type ZeroHexVerifyingKeyInit = ZeroHexAsInteger.From

export type ZeroHexVerifyingKeyString = ZeroHexString<65>

export class ZeroHexVerifyingKey extends AbstractVerifyingKey {

  constructor(
    readonly value: ZeroHexVerifyingKeyString
  ) {
    super()
  }

  [Symbol.dispose]() { }

}

export namespace ZeroHexVerifyingKey {

  export type From = VerifyingKey | VerifyingKeyInit

  export function fromOrThrow(from: From): ZeroHexVerifyingKey {
    if (from instanceof ZeroHexVerifyingKey)
      return from

    if (from instanceof BytesVerifyingKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof ExternalVerifyingKey)
      return fromExternalOrThrow(from.value)

    if (from instanceof Secp256k1.VerifyingKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalVerifyingKeyInit): ZeroHexVerifyingKey {
    using memory = from.exportUncompressedOrThrow()
    const base16 = Base16.get().getOrThrow().encodeOrThrow(memory.bytes)

    return new ZeroHexVerifyingKey(`0x${base16}` as ZeroHexString<65>)
  }

  function fromOtherOrThrow(from: ZeroHexVerifyingKeyInit): ZeroHexVerifyingKey {
    return new ZeroHexVerifyingKey(ZeroHexAsInteger.Length.fromOrThrow(from, 65))
  }


}

export type BytesVerifyingKeyInit = BytesAsInteger.From

export type BytesVerifyingKeyBytes = Uint8Array<65>

export class BytesVerifyingKey extends AbstractVerifyingKey {

  constructor(
    readonly value: BytesVerifyingKeyBytes
  ) {
    super()
  }

  [Symbol.dispose]() { }

}

export namespace BytesVerifyingKey {

  export type From = VerifyingKey | VerifyingKeyInit

  export function fromOrThrow(from: From): BytesVerifyingKey {
    if (from instanceof BytesVerifyingKey)
      return from

    if (from instanceof ZeroHexVerifyingKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof ExternalVerifyingKey)
      return fromExternalOrThrow(from.value)

    if (from instanceof Secp256k1.VerifyingKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalVerifyingKeyInit): BytesVerifyingKey {
    return new BytesVerifyingKey(Copiable.copyAndDispose(from.exportUncompressedOrThrow()) as Uint8Array<65>)
  }

  function fromOtherOrThrow(from: BytesVerifyingKeyInit): BytesVerifyingKey {
    return new BytesVerifyingKey(BytesAsInteger.Length.fromOrThrow(from, 65))
  }

}

export type ExternalVerifyingKeyInit = Secp256k1.VerifyingKey

export type ExternalVerifyingKeyObject = Secp256k1.VerifyingKey

export class ExternalVerifyingKey extends AbstractVerifyingKey {

  constructor(
    readonly boxed: Box<ExternalVerifyingKeyObject>
  ) {
    super()
  }

  get value() {
    return this.boxed.get()
  }

  [Symbol.dispose]() {
    this.value[Symbol.dispose]()
  }

}

export namespace ExternalVerifyingKey {

  export type From = VerifyingKey | VerifyingKeyInit

  export function fromOrThrow(from: From): ExternalVerifyingKey {
    if (from instanceof ExternalVerifyingKey)
      return from

    if (from instanceof ZeroHexVerifyingKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof BytesVerifyingKey)
      return fromOtherOrThrow(from.value)

    if (from instanceof Secp256k1.VerifyingKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalVerifyingKeyInit): ExternalVerifyingKey {
    return new ExternalVerifyingKey(Box.createAsDropped(from))
  }

  function fromOtherOrThrow(from: BytesVerifyingKeyInit): ExternalVerifyingKey {
    using memory = CopiableBytesAsInteger.Length.fromOrThrow(from, 65)
    const value = Secp256k1.get().getOrThrow().VerifyingKey.importOrThrow(memory.bytes)

    return new ExternalVerifyingKey(new Box(value))
  }

}