import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { ZeroHexString } from "@hazae41/hexane";
import { Secp256k1 } from "@hazae41/secp256k1";
import { ZeroHexAsInteger } from "mods/convert/index.js";
import { AbstractVerifyingKey } from "../abstract/index.js";
import { BytesVerifyingKey } from "../bytes/index.js";
import { ExternalVerifyingKey, ExternalVerifyingKeyInit } from "../external/index.js";
import { VerifyingKey, VerifyingKeyInit } from "../index.js";

export type ZeroHexVerifyingKeyInit = ZeroHexAsInteger.From

export type ZeroHexVerifyingKeyString = ZeroHexString<65>

export class ZeroHexVerifyingKey extends AbstractVerifyingKey<ZeroHexVerifyingKeyString> {

  constructor(
    readonly value: ZeroHexVerifyingKeyString
  ) {
    super()
  }

  [Symbol.dispose]() { }

  sizeOrThrow(): 65 {
    return 65
  }

  writeOrThrow(cursor: Cursor): void {
    using memory = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(memory.bytes)
  }

  intoOrThrow(): ZeroHexVerifyingKeyString {
    return this.value
  }

  toJSON(): ZeroHexVerifyingKeyString {
    return this.value
  }

}

export namespace ZeroHexVerifyingKey {

  export type From = VerifyingKey | VerifyingKeyInit

  export function fromOrThrow(from: From): ZeroHexVerifyingKey {
    if (from instanceof ZeroHexVerifyingKey)
      return from

    if (from instanceof BytesVerifyingKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof ExternalVerifyingKey)
      return fromExternalOrThrow(from.value)

    if (from instanceof Secp256k1.VerifyingKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalVerifyingKeyInit): ZeroHexVerifyingKey {
    using memory = from.exportUncompressedOrThrow()
    const base16 = Base16.get().getOrThrow().encodeOrThrow(memory.bytes)

    return new ZeroHexVerifyingKey(`0x${base16}` as ZeroHexString<65>)
  }

  function fromOtherOrThrow(from: ZeroHexVerifyingKeyInit): ZeroHexVerifyingKey {
    return new ZeroHexVerifyingKey(ZeroHexAsInteger.Length.fromOrThrow(from, 65))
  }


}