import { Base16 } from "@hazae41/base16"
import { Cursor } from "@hazae41/cursor"
import { ZeroHexString } from "@hazae41/hexane"
import { Secp256k1 } from "@hazae41/secp256k1"
import { CopiableBytesAsInteger, NumberAsInteger, ZeroHexAsInteger } from "mods/convert/index.js"
import { BytesSignature } from "../bytes/index.js"
import { ExternalSignature, ExternalSignatureInit } from "../external/index.js"
import { AbstractSignature, RsvSignatureInit, Signature, SignatureInit } from "../index.js"
import { ZeroHexSignature } from "../zerohex/index.js"

export interface RsvZeroHexSignatureInit {
  readonly r: ZeroHexAsInteger.From
  readonly s: ZeroHexAsInteger.From
  readonly v: NumberAsInteger.From
}

export interface RsvZeroHexSignatureObject {
  readonly r: ZeroHexString<32>,
  readonly s: ZeroHexString<32>,
  readonly v: number
}

export class RsvZeroHexSignature extends AbstractSignature {

  constructor(
    readonly r: ZeroHexString<32>,
    readonly s: ZeroHexString<32>,
    readonly v: number
  ) {
    super()
  }

  [Symbol.dispose]() { }

  sizeOrThrow() {
    return 65
  }

  writeOrThrow(cursor: Cursor) {
    const { r, s, v } = this

    using br = CopiableBytesAsInteger.Length.fromOrThrow(r, 32)
    using bs = CopiableBytesAsInteger.Length.fromOrThrow(s, 32)

    const nv = NumberAsInteger.fromOrThrow(v)

    cursor.writeOrThrow(br.bytes)
    cursor.writeOrThrow(bs.bytes)
    cursor.writeUint8OrThrow(nv)
  }

  intoOrThrow(): RsvZeroHexSignatureObject {
    const { r, s, v } = this
    return { r, s, v }
  }

  toJSON(): RsvZeroHexSignatureObject {
    const { r, s, v } = this
    return { r, s, v }
  }

}

export namespace RsvZeroHexSignature {

  export function readOrThrow(cursor: Cursor): RsvZeroHexSignature {
    const hr = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>
    const hs = Base16.get().getOrThrow().encodeOrThrow(cursor.readOrThrow(32)) as ZeroHexString<32>

    const nv = cursor.readUint8OrThrow()

    return new RsvZeroHexSignature(hr, hs, nv)
  }

}

export namespace RsvZeroHexSignature {

  export type From = Signature | SignatureInit

  export function fromOrThrow(from: From): RsvZeroHexSignature {
    if (from instanceof RsvZeroHexSignature)
      return from

    if (from instanceof BytesSignature)
      return fromOtherOrThrow(from.value)
    if (from instanceof ZeroHexSignature)
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

  function fromRsvOrThrow(from: RsvSignatureInit): RsvZeroHexSignature {
    const { r, s, v } = from

    const hr = ZeroHexAsInteger.Length.fromOrThrow(r, 32)
    const hs = ZeroHexAsInteger.Length.fromOrThrow(s, 32)
    const nv = NumberAsInteger.fromOrThrow(v)

    return new RsvZeroHexSignature(hr, hs, nv)
  }

  function fromExternalOrThrow(from: ExternalSignatureInit): RsvZeroHexSignature {
    using memory = from.exportOrThrow()

    return readOrThrow(new Cursor(memory.bytes))
  }

  function fromOtherOrThrow(from: ZeroHexAsInteger.From): RsvZeroHexSignature {
    using memory = CopiableBytesAsInteger.Length.fromOrThrow(from, 65)

    return readOrThrow(new Cursor(memory.bytes))
  }


}
