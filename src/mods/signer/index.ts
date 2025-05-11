import { Box } from "@hazae41/box";
import { AddressString } from "../address/index.js";
import { BytesAsUtf8 } from "../convert/index.js";
import { BytesSigningKey, ExtSigningKey, SigningKey, ZeroHexSigningKey } from "../secp256k1/index.js";

export abstract class Signer {
  abstract readonly address: AddressString
  abstract readonly signingKey: SigningKey
}

export namespace ZeroHexSigner {
  export type From = Signer | ZeroHexSigningKey.From
}

export class ZeroHexSigner extends Signer {

  private constructor(
    readonly address: AddressString,
    readonly signingKey: ZeroHexSigningKey
  ) {
    super()
  }

  static fromOrThrow(from: ZeroHexSigner.From): ZeroHexSigner {
    if (from instanceof ZeroHexSigner)
      return from
    if (from instanceof Signer)
      return ZeroHexSigner.fromSignerOrThrow(from)
    return ZeroHexSigner.fromSigningKeyOrThrow(from)
  }

  static fromSignerOrThrow(from: Signer): ZeroHexSigner {
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
    return ZeroHexSigningKey.getVerifyingKeyOrThrow(this.signingKey)
  }

  signUnprefixedMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return ZeroHexSigningKey.signUnprefixedMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signUnprefixedMessageOrThrow(message: BytesAsUtf8.From) {
    return ZeroHexSigningKey.signUnprefixedMessageOrThrow(this.signingKey, message)
  }

  signMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return ZeroHexSigningKey.signMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signMessageOrThrow(message: BytesAsUtf8.From) {
    return ZeroHexSigningKey.signMessageOrThrow(this.signingKey, message)
  }

}

export namespace BytesSigner {
  export type From = Signer | BytesSigningKey.From
}

export class BytesSigner {

  private constructor(
    readonly address: AddressString,
    readonly signingKey: BytesSigningKey
  ) { }

  static fromOrThrow(from: BytesSigner.From): BytesSigner {
    if (from instanceof BytesSigner)
      return from
    if (from instanceof Signer)
      return BytesSigner.fromSignerOrThrow(from)
    return BytesSigner.fromSigningKeyOrThrow(from)
  }

  static fromSignerOrThrow(from: Signer): BytesSigner {
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
    return BytesSigningKey.getVerifyingKeyOrThrow(this.signingKey)
  }

  signUnprefixedMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return BytesSigningKey.signUnprefixedMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signUnprefixedMessageOrThrow(message: BytesAsUtf8.From) {
    return BytesSigningKey.signUnprefixedMessageOrThrow(this.signingKey, message)
  }

  signMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return BytesSigningKey.signMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signMessageOrThrow(message: BytesAsUtf8.From) {
    return BytesSigningKey.signMessageOrThrow(this.signingKey, message)
  }

}

export namespace ExtSigner {
  export type From = Signer | ExtSigningKey.From
}

export class ExtSigner {

  constructor(
    readonly address: AddressString,
    readonly signingKey: ExtSigningKey
  ) { }

  [Symbol.dispose]() {
    this.signingKey[Symbol.dispose]()
  }

  static randomOrThrow() {
    const signingKey = ExtSigningKey.randomOrThrow()
    const address = SigningKey.getAddressOrThrow(signingKey)

    return new ExtSigner(address, signingKey)
  }

  static fromOrThrow(from: ExtSigner.From): Box<ExtSigner> {
    if (from instanceof ExtSigner)
      return Box.createAsDropped(from)
    if (from instanceof Signer)
      return ExtSigner.fromSignerOrThrow(from)
    return ExtSigner.fromSigningKeyOrThrow(from)
  }

  static fromSignerOrThrow(from: Signer): Box<ExtSigner> {
    const signingKey = ExtSigningKey.fromOrThrow(from.signingKey)
    const address = from.address

    if (signingKey.dropped)
      return Box.createAsDropped(new ExtSigner(address, signingKey.get()))

    return Box.create(new ExtSigner(address, signingKey.get()))
  }

  static fromSigningKeyOrThrow(from: ExtSigningKey.From): Box<ExtSigner> {
    const signingKey = ExtSigningKey.fromOrThrow(from)
    const address = SigningKey.getAddressOrThrow(signingKey.get())

    if (signingKey.dropped)
      return Box.createAsDropped(new ExtSigner(address, signingKey.get()))

    return new Box(new ExtSigner(address, signingKey.get()))
  }

  toJSON() {
    return ZeroHexSigner.fromOrThrow(this).toJSON()
  }

  getVerifyingKeyOrThrow() {
    return ExtSigningKey.getVerifyingKeyOrThrow(this.signingKey)
  }

  signUnprefixedMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return ExtSigningKey.signUnprefixedMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signUnprefixedMessageOrThrow(message: BytesAsUtf8.From) {
    return ExtSigningKey.signUnprefixedMessageOrThrow(this.signingKey, message)
  }

  signMessageNoOffsetOrThrow(message: BytesAsUtf8.From) {
    return ExtSigningKey.signMessageNoOffsetOrThrow(this.signingKey, message)
  }

  signMessageOrThrow(message: BytesAsUtf8.From) {
    return ExtSigningKey.signMessageOrThrow(this.signingKey, message)
  }

}