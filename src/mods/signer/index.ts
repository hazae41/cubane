import { AddressString } from "../address/index.js";
import { BytesAsUtf8 } from "../convert/index.js";
import { BytesSigningKey, ExternalSigningKey, SigningKey, ZeroHexSigningKey } from "../secp256k1/index.js";

export abstract class AbstractSigner {
  abstract readonly address: AddressString
  abstract readonly signingKey: SigningKey
}

export type Signer =
  | ZeroHexSigner
  | BytesSigner
  | ExtSigner

export namespace Signer {

  export function is(value: unknown): value is Signer {
    return value instanceof AbstractSigner
  }

}

export class ZeroHexSigner extends AbstractSigner {

  constructor(
    readonly address: AddressString,
    readonly signingKey: ZeroHexSigningKey
  ) {
    super()
  }

  toJSON() {
    const { address, signingKey } = this
    return { address, signingKey }
  }

  getVerifyingKeyOrThrow() {
    return SigningKey.getVerifyingKeyOrThrow(this.signingKey)
  }

  signUnprefixedMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signUnprefixedMessageOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageOrThrow(this.signingKey, message)
  }

  signMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signMessageOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signMessageOrThrow(this.signingKey, message)
  }

}

export namespace ZeroHexSigner {

  export type From = AbstractSigner | ZeroHexSigningKey.From

  export function fromOrThrow(from: From): ZeroHexSigner {
    if (from instanceof ZeroHexSigner)
      return from
    if (from instanceof AbstractSigner)
      return fromSignerOrThrow(from)
    return fromSigningKeyOrThrow(from)
  }

  function fromSignerOrThrow(from: AbstractSigner): ZeroHexSigner {
    const signingKey = ZeroHexSigningKey.fromOrThrow(from.signingKey)
    const address = from.address

    return new ZeroHexSigner(address, signingKey)
  }

  function fromSigningKeyOrThrow(from: ZeroHexSigningKey.From): ZeroHexSigner {
    const signingKey = ZeroHexSigningKey.fromOrThrow(from)
    const address = SigningKey.getAddressOrThrow(signingKey)

    return new ZeroHexSigner(address, signingKey)
  }

}

export class BytesSigner {

  constructor(
    readonly address: AddressString,
    readonly signingKey: BytesSigningKey
  ) { }

  toJSON() {
    return ZeroHexSigner.fromOrThrow(this).toJSON()
  }

  getVerifyingKeyOrThrow() {
    return SigningKey.getVerifyingKeyOrThrow(this.signingKey)
  }

  signUnprefixedMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signUnprefixedMessageOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageOrThrow(this.signingKey, message)
  }

  signMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signMessageOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signMessageOrThrow(this.signingKey, message)
  }

}

export namespace BytesSigner {

  export type From = AbstractSigner | BytesSigningKey.From

  export function fromOrThrow(from: BytesSigner.From): BytesSigner {
    if (from instanceof BytesSigner)
      return from
    if (from instanceof AbstractSigner)
      return fromSignerOrThrow(from)
    return fromSigningKeyOrThrow(from)
  }

  function fromSignerOrThrow(from: AbstractSigner): BytesSigner {
    const signingKey = BytesSigningKey.fromOrThrow(from.signingKey)
    const address = from.address

    return new BytesSigner(address, signingKey)
  }

  function fromSigningKeyOrThrow(from: BytesSigningKey.From): BytesSigner {
    const signingKey = BytesSigningKey.fromOrThrow(from)
    const address = SigningKey.getAddressOrThrow(signingKey)

    return new BytesSigner(address, signingKey)
  }

}

export class ExtSigner {

  constructor(
    readonly address: AddressString,
    readonly signingKey: ExternalSigningKey
  ) { }

  [Symbol.dispose]() {
    this.signingKey[Symbol.dispose]()
  }

  toJSON() {
    return ZeroHexSigner.fromOrThrow(this).toJSON()
  }

  getVerifyingKeyOrThrow() {
    return SigningKey.getVerifyingKeyOrThrow(this.signingKey)
  }

  signUnprefixedMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signUnprefixedMessageOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signUnprefixedMessageOrThrow(this.signingKey, message)
  }

  signMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signMessageOrThrow(message: BytesAsUtf8.From) {
    return SigningKey.signMessageOrThrow(this.signingKey, message)
  }

}

export namespace ExtSigner {

  export function randomOrThrow() {
    const signingKey = ExternalSigningKey.randomOrThrow()
    const address = SigningKey.getAddressOrThrow(signingKey)

    return new ExtSigner(address, signingKey)
  }

}

export namespace ExtSigner {

  export type From = AbstractSigner | ExternalSigningKey.From

  export function fromOrThrow(from: ExtSigner.From): ExtSigner {
    if (from instanceof ExtSigner)
      return from
    if (from instanceof AbstractSigner)
      return fromSignerOrThrow(from)
    return fromSigningKeyOrThrow(from)
  }

  function fromSignerOrThrow(from: AbstractSigner): ExtSigner {
    const signingKey = ExternalSigningKey.fromOrThrow(from.signingKey)
    const address = from.address

    return new ExtSigner(address, signingKey)
  }

  function fromSigningKeyOrThrow(from: ExternalSigningKey.From): ExtSigner {
    const signingKey = ExternalSigningKey.fromOrThrow(from)
    const address = SigningKey.getAddressOrThrow(signingKey)

    return new ExtSigner(address, signingKey)
  }

}