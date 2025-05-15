export * from "./abstract/index.js"
export * from "./bytes/index.js"
export * from "./external/index.js"
export * from "./rsvbytes/index.js"
export * from "./rsvzerohex/index.js"
export * from "./zerohex/index.js"

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

export namespace Signature {

  export type From = Signature | SignatureInit

  export function fromOrThrow(from: From): Signature {
    if (from instanceof BytesSignature)
      return from
    if (from instanceof ZeroHexSignature)
      return from
    if (from instanceof RsvBytesSignature)
      return from
    if (from instanceof RsvZeroHexSignature)
      return from
    if (from instanceof ExternalSignature)
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