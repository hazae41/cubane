import { Uint8Array } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { BytesAsInteger } from "mods/convert/index.js";
import { AbstractVerifyingKey } from "../abstract/index.js";
import { ExternalVerifyingKey, ExternalVerifyingKeyInit } from "../external/index.js";
import { VerifyingKey, VerifyingKeyInit } from "../index.js";
import { ZeroHexVerifyingKey, ZeroHexVerifyingKeyString } from "../zerohex/index.js";

export type BytesVerifyingKeyInit = BytesAsInteger.From

export type BytesVerifyingKeyBytes = Uint8Array<65>

export class BytesVerifyingKey extends AbstractVerifyingKey<BytesVerifyingKeyBytes> {

  constructor(
    readonly value: BytesVerifyingKeyBytes
  ) {
    super()
  }

  [Symbol.dispose]() { }

  sizeOrThrow(): 65 {
    return 65
  }

  writeOrThrow(cursor: Cursor): void {
    cursor.writeOrThrow(this.value)
  }

  intoOrThrow(): BytesVerifyingKeyBytes {
    return this.value
  }

  toJSON(): ZeroHexVerifyingKeyString {
    return ZeroHexVerifyingKey.fromOrThrow(this).intoOrThrow()
  }

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