import { Owned, Viewed, Wrapped } from "@hazae41/box";
import { Cursor } from "@hazae41/cursor";
import { Secp256k1 } from "@hazae41/secp256k1";
import { CopiableBytesAsInteger } from "mods/convert/index.js";
import { AbstractVerifyingKey } from "../abstract/index.js";
import { BytesVerifyingKey, BytesVerifyingKeyInit } from "../bytes/index.js";
import { VerifyingKey, VerifyingKeyInit } from "../index.js";
import { ZeroHexVerifyingKey, ZeroHexVerifyingKeyString } from "../zerohex/index.js";

export type ExternalVerifyingKeyInit = Secp256k1.VerifyingKey

export type ExternalVerifyingKeyObject = Secp256k1.VerifyingKey

export class ExternalVerifyingKey extends AbstractVerifyingKey {

  constructor(
    readonly wrapped: Wrapped<ExternalVerifyingKeyObject>
  ) {
    super()
  }

  get value() {
    return this.wrapped.get()
  }

  [Symbol.dispose]() {
    this.wrapped[Symbol.dispose]()
  }

  sizeOrThrow(): 65 {
    return 65
  }

  writeOrThrow(cursor: Cursor): void {
    using memory = this.value.exportUncompressedOrThrow()

    cursor.writeOrThrow(memory.bytes)
  }

  intoOrThrow(): Wrapped<ExternalVerifyingKeyObject> {
    return this.wrapped
  }

  toJSON(): ZeroHexVerifyingKeyString {
    return ZeroHexVerifyingKey.fromOrThrow(this).toJSON()
  }

}

export namespace ExternalVerifyingKey {

  export type From = VerifyingKey | VerifyingKeyInit

  export function fromOrThrow(from: From): ExternalVerifyingKey {
    if (from instanceof ExternalVerifyingKey)
      return fromExternalOrThrow(from.value)

    if (from instanceof ZeroHexVerifyingKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof BytesVerifyingKey)
      return fromOtherOrThrow(from.value)

    if (from instanceof Secp256k1.VerifyingKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalVerifyingKeyInit): ExternalVerifyingKey {
    return new ExternalVerifyingKey(new Viewed(from))
  }

  function fromOtherOrThrow(from: BytesVerifyingKeyInit): ExternalVerifyingKey {
    using memory = CopiableBytesAsInteger.Length.fromOrThrow(from, 65)
    const value = Secp256k1.get().getOrThrow().VerifyingKey.importOrThrow(memory.bytes)

    return new ExternalVerifyingKey(new Owned(value))
  }

}