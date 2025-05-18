import { Box } from "@hazae41/box";
import { Cursor } from "@hazae41/cursor";
import { Secp256k1 } from "@hazae41/secp256k1";
import { CopiableBytesAsInteger } from "mods/convert/index.js";
import { AbstractSigningKey } from "../abstract/index.js";
import { BytesSigningKey, BytesSigningKeyInit } from "../bytes/index.js";
import { SigningKey, SigningKeyInit } from "../index.js";
import { ZeroHexSigningKey, ZeroHexSigningKeyString } from "../zerohex/index.js";

export type ExternalSigningKeyInit = Secp256k1.SigningKey

export type ExternalSigningKeyObject = Secp256k1.SigningKey

export class ExternalSigningKey extends AbstractSigningKey {

  constructor(
    readonly boxed: Box<ExternalSigningKeyObject>
  ) {
    super()
  }

  get value() {
    return this.boxed.get()
  }

  [Symbol.dispose]() {
    this.boxed[Symbol.dispose]()
  }

  sizeOrThrow(): 32 {
    return 32
  }

  writeOrThrow(cursor: Cursor): void {
    using memory = this.value.exportOrThrow()

    cursor.writeOrThrow(memory.bytes)
  }

  intoOrThrow(): Box<ExternalSigningKeyObject> {
    return this.boxed
  }

  toJSON(): ZeroHexSigningKeyString {
    return ZeroHexSigningKey.fromOrThrow(this).toJSON()
  }

}

export namespace ExternalSigningKey {

  export type From = SigningKey | SigningKeyInit

  export function fromOrThrow(from: From): ExternalSigningKey {
    if (from instanceof ExternalSigningKey)
      return fromExternalOrThrow(from.value)

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