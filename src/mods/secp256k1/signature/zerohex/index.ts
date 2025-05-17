import { Base16 } from "@hazae41/base16"
import { Cursor } from "@hazae41/cursor"
import { RawHexString, ZeroHexString } from "@hazae41/hexane"
import { Secp256k1 } from "@hazae41/secp256k1"
import { CopiableBytesAsInteger, RawHexAsInteger, ZeroHexAsInteger } from "mods/convert/index.js"
import { BytesSignature } from "../bytes/index.js"
import { ExternalSignature, ExternalSignatureInit } from "../external/index.js"
import { AbstractSignature, RsvSignatureInit, Signature, SignatureInit } from "../index.js"

export type ZeroHexSignatureInit = ZeroHexAsInteger.From

export type ZeroHexSignatureString = ZeroHexString<65>

export class ZeroHexSignature extends AbstractSignature {

  constructor(
    readonly value: ZeroHexSignatureString
  ) {
    super()
  }

  [Symbol.dispose]() { }

  sizeOrThrow(): 65 {
    return 65
  }

  writeOrThrow(cursor: Cursor) {
    using memory = CopiableBytesAsInteger.fromZeroHexOrThrow(this.value)

    cursor.writeOrThrow(memory.bytes)
  }

  intoOrThrow(): ZeroHexSignatureString {
    return this.value
  }

  toJSON(): ZeroHexSignatureString {
    return this.value
  }

}

export namespace ZeroHexSignature {

  export type From = Signature | SignatureInit

  export function fromOrThrow(from: From): ZeroHexSignature {
    if (from instanceof ZeroHexSignature)
      return from

    if (from instanceof BytesSignature)
      return fromOtherOrThrow(from.value)
    if (from instanceof ExternalSignature)
      return fromExternalOrThrow(from.value)

    if (from instanceof Secp256k1.SignatureAndRecovery)
      return fromExternalOrThrow(from)
    if (from instanceof Uint8Array)
      return fromOtherOrThrow(from)
    if (typeof from === "object")
      return fromRsvOrThrow(from)
    return fromOtherOrThrow(from)
  }

  function fromRsvOrThrow(from: RsvSignatureInit): ZeroHexSignature {
    const { r, s, v } = from

    const hr = RawHexAsInteger.Length.fromOrThrow(r, 32)
    const hs = RawHexAsInteger.Length.fromOrThrow(s, 32)

    const hvx = RawHexAsInteger.fromOrThrow(v)
    const hvp = RawHexString.padStart(hvx)

    return new ZeroHexSignature(`0x${hr}${hs}${hvp}` as ZeroHexString<65>)
  }

  function fromExternalOrThrow(from: ExternalSignatureInit): ZeroHexSignature {
    using memory = from.exportOrThrow()
    const base16 = Base16.get().getOrThrow().encodeOrThrow(memory.bytes)

    return new ZeroHexSignature(`0x${base16}` as ZeroHexString<65>)
  }

  function fromOtherOrThrow(from: ZeroHexSignatureInit): ZeroHexSignature {
    return new ZeroHexSignature(ZeroHexAsInteger.Length.fromOrThrow(from, 65))
  }

}
