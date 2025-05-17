import { Base16 } from "@hazae41/base16";
import { ZeroHexString } from "@hazae41/hexane";
import { Secp256k1 } from "@hazae41/secp256k1";
import { ZeroHexAsInteger } from "mods/convert/index.js";
import { AbstractSigningKey } from "../abstract/index.js";
import { BytesSigningKey } from "../bytes/index.js";
import { ExternalSigningKey, ExternalSigningKeyInit } from "../external/index.js";
import { SigningKey, SigningKeyInit } from "../index.js";

export type ZeroHexSigningKeyInit = ZeroHexAsInteger.From

export type ZeroHexSigningKeyString = ZeroHexString<32>

export class ZeroHexSigningKey extends AbstractSigningKey {

  constructor(
    readonly value: ZeroHexSigningKeyString
  ) {
    super()
  }

  [Symbol.dispose]() { }

}

export namespace ZeroHexSigningKey {

  export type From = SigningKey | SigningKeyInit

  export function fromOrThrow(from: From): ZeroHexSigningKey {
    if (from instanceof ZeroHexSigningKey)
      return from

    if (from instanceof BytesSigningKey)
      return fromOtherOrThrow(from.value)
    if (from instanceof ExternalSigningKey)
      return fromExternalOrThrow(from.value)

    if (from instanceof Secp256k1.SigningKey)
      return fromExternalOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromExternalOrThrow(from: ExternalSigningKeyInit): ZeroHexSigningKey {
    using memory = from.exportOrThrow()
    const base16 = Base16.get().getOrThrow().encodeOrThrow(memory.bytes)

    return new ZeroHexSigningKey(`0x${base16}` as ZeroHexString<32>)
  }

  function fromOtherOrThrow(from: ZeroHexSigningKeyInit): ZeroHexSigningKey {
    return new ZeroHexSigningKey(ZeroHexAsInteger.Length.fromOrThrow(from, 32))
  }

}