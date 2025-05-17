import { Uint8Array } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { BytesAsInteger } from "mods/convert/index.js";
import { AbstractSigningKey } from "../abstract/index.js";
import { ExternalSigningKey, ExternalSigningKeyInit } from "../external/index.js";
import { SigningKey, SigningKeyInit } from "../index.js";
import { ZeroHexSigningKey, ZeroHexSigningKeyString } from "../zerohex/index.js";

export type BytesSigningKeyInit = BytesAsInteger.From

export type BytesSigningKeyBytes = Uint8Array<32>

export class BytesSigningKey extends AbstractSigningKey {

  constructor(
    readonly value: BytesSigningKeyBytes
  ) {
    super()
  }

  [Symbol.dispose]() { }

  sizeOrThrow(): 32 {
    return 32
  }

  writeOrThrow(cursor: Cursor): void {
    cursor.writeOrThrow(this.value)
  }

  intoOrThrow(): BytesSigningKeyBytes {
    return this.value
  }

  toJSON(): ZeroHexSigningKeyString {
    return ZeroHexSigningKey.fromOrThrow(this).toJSON()
  }

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
