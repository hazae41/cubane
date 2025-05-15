import { Box } from "@hazae41/box";
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

export namespace ZeroHexSigner {
  export type From = AbstractSigner | ZeroHexSigningKey.From
}

export class ZeroHexSigner extends AbstractSigner {

  private constructor(
    readonly address: AddressString,
    readonly signingKey: ZeroHexSigningKey
  ) {
    super()
  }

  static fromOrThrow(from: ZeroHexSigner.From): ZeroHexSigner {
    if (from instanceof ZeroHexSigner)
      return from
    if (from instanceof AbstractSigner)
      return ZeroHexSigner.fromSignerOrThrow(from)
    return ZeroHexSigner.fromSigningKeyOrThrow(from)
  }

  static fromSignerOrThrow(from: AbstractSigner): ZeroHexSigner {
    const signingKey = ZeroHexSigningKey.fromOrThrow(from.signingKey)
    const address = from.address

    return new ZeroHexSigner(address, signingKey)
  }

  static fromSigningKeyOrThrow(from: ZeroHexSigningKey.From): ZeroHexSigner {
    const signingKey = ZeroHexSigningKey.fromOrThrow(from)
    const address = SigningKey.getAddressOrThrow(signingKey)

    return new ZeroHexSigner(address, signingKey)
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

export namespace BytesSigner {
  export type From = AbstractSigner | BytesSigningKey.From
}

export class BytesSigner {

  private constructor(
    readonly address: AddressString,
    readonly signingKey: BytesSigningKey
  ) { }

  static fromOrThrow(from: BytesSigner.From): BytesSigner {
    if (from instanceof BytesSigner)
      return from
    if (from instanceof AbstractSigner)
      return BytesSigner.fromSignerOrThrow(from)
    return BytesSigner.fromSigningKeyOrThrow(from)
  }

  static fromSignerOrThrow(from: AbstractSigner): BytesSigner {
    const signingKey = BytesSigningKey.fromOrThrow(from.signingKey)
    const address = from.address

    return new BytesSigner(address, signingKey)
  }

  static fromSigningKeyOrThrow(from: BytesSigningKey.From): BytesSigner {
    const signingKey = BytesSigningKey.fromOrThrow(from)
    const address = SigningKey.getAddressOrThrow(signingKey)

    return new BytesSigner(address, signingKey)
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
  export type From = AbstractSigner | ExternalSigningKey.From
}

export class ExtSigner {

  constructor(
    readonly address: AddressString,
    readonly signingKey: ExternalSigningKey
  ) { }

  [Symbol.dispose]() {
    this.signingKey[Symbol.dispose]()
  }

  static randomOrThrow() {
    const signingKey = ExternalSigningKey.randomOrThrow()
    const address = SigningKey.getAddressOrThrow(signingKey)

    return new ExtSigner(address, signingKey)
  }

  static fromOrThrow(from: ExtSigner.From): Box<ExtSigner> {
    if (from instanceof ExtSigner)
      return Box.createAsDropped(from)
    if (from instanceof AbstractSigner)
      return ExtSigner.fromSignerOrThrow(from)
    return ExtSigner.fromSigningKeyOrThrow(from)
  }

  static fromSignerOrThrow(from: AbstractSigner): Box<ExtSigner> {
    const signingKey = ExternalSigningKey.fromOrThrow(from.signingKey)
    const address = from.address

    if (signingKey.dropped)
      return Box.createAsDropped(new ExtSigner(address, signingKey.get()))

    return Box.create(new ExtSigner(address, signingKey.get()))
  }

  static fromSigningKeyOrThrow(from: ExternalSigningKey.From): Box<ExtSigner> {
    const signingKey = ExternalSigningKey.fromOrThrow(from)
    const address = SigningKey.getAddressOrThrow(signingKey.get())

    if (signingKey.dropped)
      return Box.createAsDropped(new ExtSigner(address, signingKey.get()))

    return new Box(new ExtSigner(address, signingKey.get()))
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