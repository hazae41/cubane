import { Secp256k1 } from "@hazae41/secp256k1"
import { BytesSignature, BytesSignatureInit } from "./bytes/index.js"
import { ExternalSignature, ExternalSignatureInit } from "./external/index.js"
import { RsvBytesSignature, RsvBytesSignatureInit } from "./rsvbytes/index.js"
import { RsvZeroHexSignature, RsvZeroHexSignatureInit } from "./rsvzerohex/index.js"
import { ZeroHexSignature, ZeroHexSignatureInit } from "./zerohex/index.js"

export type SignatureInit =
  | RsvZeroHexSignatureInit
  | RsvBytesSignatureInit
  | ZeroHexSignatureInit
  | BytesSignatureInit
  | ExternalSignatureInit

export type Signature =
  | RsvZeroHexSignature
  | RsvBytesSignature
  | ZeroHexSignature
  | BytesSignature
  | ExternalSignature

export abstract class AbstractSignature { }

export namespace Signature {

  export function is(value: unknown): value is Signature {
    return value instanceof AbstractSignature
  }

}

export namespace Signature {

  export type From = Signature | SignatureInit

  export function fromOrThrow(from: From): Signature {
    if (is(from))
      return from
    if (from instanceof Secp256k1.SignatureAndRecovery)
      return ExternalSignature.fromOrThrow(from)
    if (from instanceof Uint8Array)
      return BytesSignature.fromOrThrow(from)
    return ZeroHexSignature.fromOrThrow(from)
  }

}

export type RsvSignatureInit =
  | RsvZeroHexSignatureInit
  | RsvBytesSignatureInit

export type RsvSignature =
  | RsvZeroHexSignature
  | RsvBytesSignature