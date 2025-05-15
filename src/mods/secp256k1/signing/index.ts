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
import { ExtVerifyingKey } from "../verifying/index.js";

export type SigningKey =
  | ZeroHexSigningKey
  | BytesSigningKey
  | ExternalSigningKey

export type SigningKeyInit =
  | ZeroHexSigningKeyInit
  | BytesSigningKeyInit
  | ExternalSigningKeyInit

export abstract class AbstractSigningKey { }

export namespace SigningKey {

  export function is(value: unknown): value is SigningKey {
    return value instanceof AbstractSigningKey
  }

}

export namespace SigningKey {

  export type From = SigningKey | SigningKeyInit

  export function fromOrThrow(from: From): SigningKey {
    if (is(from))
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

  export function getVerifyingKeyOrThrow(signingKey: ExternalSigningKey.From): ExtVerifyingKey {
    using extSigningKey = ExternalSigningKey.fromOrThrow(signingKey)

    return extSigningKey.value.getVerifyingKeyOrThrow()
  }

  export function getUncheckedAddressOrThrow(signingKey: ExternalSigningKey.From): ZeroHexString<20> {
    using signingKeyExtBox = ExternalSigningKey.fromOrThrow(signingKey)

    using verifyingKeyExt = signingKeyExtBox.get().getVerifyingKeyOrThrow()
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

  export function signUnprefixedMessageNoOffsetOrThrow(signingKey: ExternalSigningKey.From, message: BytesAsUtf8.From): ExternalSignature {
    using signingKeyExtBox = ExternalSigningKey.fromOrThrow(signingKey)
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(messageBytes)
    return signingKeyExtBox.value.signOrThrow(hashMemoryExt)
  }

  export function signUnprefixedMessageOrThrow(signingKey: ExternalSigningKey.From, message: BytesAsUtf8.From): RsvBytesSignature {
    using signatureExt = signUnprefixedMessageNoOffsetOrThrow(signingKey, message)
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signatureExt)

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v + 27

    return new RsvBytesSignature(r, s, v)
  }

  export function signMessageNoOffsetOrThrow(signingKey: ExternalSigningKey.From, message: BytesAsUtf8.From): ExternalSignature {
    using extSigningKey = ExternalSigningKey.fromOrThrow(signingKey)
    const messageBytes = BytesAsUtf8.fromOrThrow(message)

    const prefixBytes = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + messageBytes.length.toString())
    const concatBytes = Bytes.concat([prefixBytes, messageBytes])

    using hashMemoryExt = Keccak256.get().getOrThrow().hashOrThrow(concatBytes)
    const signatureExt = extSigningKey.value.signOrThrow(hashMemoryExt)

    return new ExternalSignature(new Box(signatureExt))
  }

  export function signMessageOrThrow(signingKey: ExternalSigningKey.From, message: BytesAsUtf8.From): RsvBytesSignature {
    using signatureExt = signMessageNoOffsetOrThrow(signingKey, message)
    const signatureRsvBytes = RsvBytesSignature.fromOrThrow(signatureExt)

    const { r, s } = signatureRsvBytes
    const v = signatureRsvBytes.v + 27

    return new RsvBytesSignature(r, s, v)
  }

}

export type ZeroHexSigningKeyInit = ZeroHexAsInteger.From

export type ZeroHexSigningKeyString = ZeroHexString<32>

export class ZeroHexSigningKey {

  constructor(
    readonly value: ZeroHexSigningKeyString
  ) { }

  [Symbol.dispose]() { }

}

export namespace ZeroHexSigningKey {

  export type From = SigningKey | SigningKeyInit

  export function fromOrThrow(from: From): ZeroHexSigningKey {
    if (from instanceof ZeroHexSigningKey)
      return from

    if (from instanceof BytesSigningKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof ExternalSigningKey)
      return fromExternalOrThrow(from.value)

    if (from instanceof Secp256k1.SigningKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalSigningKeyInit): ZeroHexSigningKey {
    using memory = from.exportOrThrow()
    const base16 = Base16.get().getOrThrow().encodeOrThrow(memory.bytes)

    return new ZeroHexSigningKey(`0x${base16}` as ZeroHexString<32>)
  }

  function fromOtherOrThrow(from: ZeroHexSigningKeyInit): ZeroHexSigningKey {
    return new ZeroHexSigningKey(ZeroHexAsInteger.Length.fromOrThrow(from, 32))
  }

}

export type BytesSigningKeyInit = BytesAsInteger.From

export type BytesSigningKeyBytes = Uint8Array<32>

export class BytesSigningKey {

  constructor(
    readonly value: BytesSigningKeyBytes
  ) { }

  [Symbol.dispose]() { }

}

export namespace BytesSigningKey {

  export type From = SigningKey | SigningKeyInit

  export function fromOrThrow(from: From): BytesSigningKey {
    if (from instanceof BytesSigningKey)
      return from

    if (from instanceof ZeroHexSigningKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof ExternalSigningKey)
      return fromExternalOrThrow(from.value)

    if (from instanceof Secp256k1.SigningKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalSigningKeyInit): BytesSigningKey {
    return new BytesSigningKey(Copiable.copyAndDispose(from.exportOrThrow()) as Uint8Array<32>)
  }

  function fromOtherOrThrow(from: BytesSigningKeyInit): BytesSigningKey {
    return new BytesSigningKey(BytesAsInteger.Length.fromOrThrow(from, 32))
  }

}

export type ExternalSigningKeyInit = Secp256k1.SigningKey

export type ExternalSigningKeyObject = Secp256k1.SigningKey

export class ExternalSigningKey {

  constructor(
    readonly boxed: Box<ExternalSigningKeyObject>
  ) { }

  get value() {
    return this.boxed.get()
  }

  [Symbol.dispose]() {
    this.value[Symbol.dispose]()
  }

}

export namespace ExternalSigningKey {

  export type From = SigningKey | SigningKeyInit

  export function fromOrThrow(from: From): ExternalSigningKey {
    if (from instanceof ExternalSigningKey)
      return from

    if (from instanceof BytesSigningKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof ZeroHexSigningKey)
      return fromOtherOrThrow(from.value)

    if (from instanceof Secp256k1.SigningKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalSigningKeyInit): ExternalSigningKey {
    return new ExternalSigningKey(Box.createAsDropped(from))
  }

  function fromOtherOrThrow(from: BytesSigningKeyInit): ExternalSigningKey {
    using memory = CopiableBytesAsInteger.Length.fromOrThrow(from, 32)
    const value = Secp256k1.get().getOrThrow().SigningKey.importOrThrow(memory)

    return new ExternalSigningKey(new Box(value))
  }

}

export namespace ExternalSigningKey {

  export function randomOrThrow(): ExternalSigningKey {
    return new ExternalSigningKey(new Box(Secp256k1.get().getOrThrow().SigningKey.randomOrThrow()))
  }

}