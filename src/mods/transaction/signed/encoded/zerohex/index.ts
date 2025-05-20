import { Writable } from "@hazae41/binary";
import { ZeroHexString } from "@hazae41/hexane";
import { ZeroHexAsInteger } from "mods/convert/index.js";
import { AbstractRlpList } from "mods/rlp/index.js";
import { AbstractSignedTransaction2, DecodedSignedTransactionInit2, SignedTransactionInit2 } from "../../index.js";
import { BytesEncodedSignedTransaction2 } from "../bytes/index.js";
import { RlpEncodedSignedTransaction2 } from "../rlp/index.js";

export type ZeroHexEncodedSignedTransactionInit2 = ZeroHexString

export type ZeroHexEncodedSignedTransactionValue2 = ZeroHexString

export class ZeroHexEncodedSignedTransaction2 extends AbstractSignedTransaction2 {
  readonly #class = ZeroHexEncodedSignedTransaction2

  constructor(
    readonly value: ZeroHexString,
  ) {
    super()
  }

}

export namespace ZeroHexEncodedSignedTransaction2 {

  export type From = AbstractSignedTransaction2 | SignedTransactionInit2

  export function fromOrThrow(from: From): ZeroHexEncodedSignedTransaction2 {
    if (from instanceof ZeroHexEncodedSignedTransaction2)
      return from

    if (from instanceof BytesEncodedSignedTransaction2)
      return fromBytesOrThrow(from.value)
    if (from instanceof RlpEncodedSignedTransaction2)
      return fromRlpOrThrow(from.value)
    if (from instanceof AbstractSignedTransaction2)
      throw new Error()

    if (from instanceof AbstractRlpList)
      return fromRlpOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)

    if (typeof from === "object")
      return fromDecodedOrThrow(from)
    if (typeof from === "string")
      return fromZeroHexOrThrow(from)

    throw new Error()
  }

  function fromZeroHexOrThrow(from: ZeroHexString): ZeroHexEncodedSignedTransaction2 {
    return new ZeroHexEncodedSignedTransaction2(from)
  }

  function fromBytesOrThrow(from: Uint8Array): ZeroHexEncodedSignedTransaction2 {
    return fromZeroHexOrThrow(ZeroHexAsInteger.fromOrThrow(from))
  }

  function fromRlpOrThrow(from: AbstractRlpList): ZeroHexEncodedSignedTransaction2 {
    return fromBytesOrThrow(Writable.writeToBytesOrThrow(from))
  }

  function fromDecodedOrThrow(from: DecodedSignedTransactionInit2): ZeroHexEncodedSignedTransaction2 {
    return fromBytesOrThrow(Writable.writeToBytesOrThrow(RlpEncodedSignedTransaction2.fromOrThrow(from)))
  }

}