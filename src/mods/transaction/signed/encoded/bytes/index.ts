import { Writable } from "@hazae41/binary";
import { ZeroHexString } from "@hazae41/hexane";
import { BytesAsInteger } from "mods/convert/index.js";
import { AbstractRlpList } from "mods/rlp/index.js";
import { AbstractSignedTransaction2, DecodedSignedTransactionInit2, SignedTransaction2, SignedTransactionInit2 } from "../../index.js";
import { RlpEncodedSignedTransaction2 } from "../rlp/index.js";
import { ZeroHexEncodedSignedTransaction2 } from "../zerohex/index.js";

export type BytesEncodedSignedTransactionInit2 = Uint8Array

export type BytesEncodedSignedTransactionValue2 = Uint8Array

export class BytesEncodedSignedTransaction2 extends AbstractSignedTransaction2 {
  readonly #class = BytesEncodedSignedTransaction2

  constructor(
    readonly value: BytesEncodedSignedTransactionValue2,
  ) {
    super()
  }

}

export namespace BytesEncodedSignedTransaction2 {

  export type From = SignedTransaction2 | SignedTransactionInit2

  export function fromOrThrow(from: From): BytesEncodedSignedTransaction2 {
    if (from instanceof BytesEncodedSignedTransaction2)
      return from

    if (from instanceof RlpEncodedSignedTransaction2)
      return fromRlpOrThrow(from.value)
    if (from instanceof ZeroHexEncodedSignedTransaction2)
      return fromZeroHexOrThrow(from.value)

    if (from instanceof AbstractRlpList)
      return fromRlpOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)

    if (typeof from === "object")
      return fromDecodedOrThrow(from)

    return fromZeroHexOrThrow(from)
  }

  function fromBytesOrThrow(from: Uint8Array): BytesEncodedSignedTransaction2 {
    return new BytesEncodedSignedTransaction2(from)
  }

  function fromZeroHexOrThrow(from: ZeroHexString): BytesEncodedSignedTransaction2 {
    return fromBytesOrThrow(BytesAsInteger.fromOrThrow(from))
  }

  function fromRlpOrThrow(from: AbstractRlpList): BytesEncodedSignedTransaction2 {
    return fromBytesOrThrow(Writable.writeToBytesOrThrow(from))
  }

  function fromDecodedOrThrow(from: DecodedSignedTransactionInit2): BytesEncodedSignedTransaction2 {
    return fromBytesOrThrow(Writable.writeToBytesOrThrow(RlpEncodedSignedTransaction2.fromOrThrow(from)))
  }

}