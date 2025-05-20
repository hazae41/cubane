import { ZeroHexString } from "@hazae41/hexane";
import { Nullable } from "libs/nullable/index.js";
import { BytesAsInteger } from "mods/convert/index.js";
import { AbstractRlpList, ZeroHexAsRlpStringOrInteger } from "mods/rlp/index.js";
import { ZeroHexAccessList } from "../../../access/index.js";
import { BytesEncodedSignedTransaction2 } from "../../encoded/bytes/index.js";
import { RlpEncodedSignedTransaction2 } from "../../encoded/rlp/index.js";
import { ZeroHexEncodedSignedTransaction2 } from "../../encoded/zerohex/index.js";
import { AbstractSignedTransaction2, DecodedSignedTransactionInit2, SignedTransaction2, SignedTransactionInit2 } from "../../index.js";
import { RlpDecodedSignedTransaction2 } from "../rlp/index.js";

export type ZeroHexDecodedSignedTransactionInit2 = DecodedSignedTransactionInit2

export interface ZeroHexDecodedSignedTransactionValue2 {
  readonly chainId: ZeroHexString,
  readonly nonce: ZeroHexString,
  readonly maxPriorityFeePerGas: ZeroHexString,
  readonly maxFeePerGas: ZeroHexString,
  readonly gasLimit: ZeroHexString,
  readonly to: ZeroHexString<20>,
  readonly value: ZeroHexString,
  readonly data: Nullable<ZeroHexString>,
  readonly accessList: Nullable<ZeroHexAccessList>,
  readonly v: ZeroHexString,
  readonly r: ZeroHexString<32>,
  readonly s: ZeroHexString<32>,
}

export class ZeroHexDecodedSignedTransaction2 extends AbstractSignedTransaction2 {
  readonly #class = ZeroHexDecodedSignedTransaction2

  constructor(
    readonly chainId: ZeroHexString,
    readonly nonce: ZeroHexString,
    readonly maxPriorityFeePerGas: ZeroHexString,
    readonly maxFeePerGas: ZeroHexString,
    readonly gasLimit: ZeroHexString,
    readonly to: ZeroHexString<20>,
    readonly value: ZeroHexString,
    readonly data: Nullable<ZeroHexString>,
    readonly accessList: Nullable<ZeroHexAccessList>,
    readonly v: ZeroHexString,
    readonly r: ZeroHexString<32>,
    readonly s: ZeroHexString<32>,
  ) {
    super()
  }

  toJSON() {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s } = this
    return { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s }
  }

  toRlpDecodedOrThrow() {
    return RlpDecodedSignedTransaction2.fromOrThrow(this)
  }

  toRlpEncodedOrThrow() {
    return RlpEncodedSignedTransaction2.fromOrThrow(this)
  }

  toZeroHexEncodedOrThrow() {
    return ZeroHexEncodedSignedTransaction2.fromOrThrow(this)
  }

}

export namespace ZeroHexDecodedSignedTransaction2 {

  export type From = SignedTransaction2 | SignedTransactionInit2

  export function fromOrThrow(from: From): ZeroHexDecodedSignedTransaction2 {
    if (from instanceof ZeroHexDecodedSignedTransaction2)
      return from

    if (from instanceof BytesEncodedSignedTransaction2)
      return fromBytesOrThrow(from.value)
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

  function fromBytesOrThrow(from: Uint8Array): ZeroHexDecodedSignedTransaction2 {
    return fromDecodedOrThrow(RlpDecodedSignedTransaction2.fromOrThrow(from))
  }

  function fromRlpOrThrow(from: AbstractRlpList): ZeroHexDecodedSignedTransaction2 {
    return fromDecodedOrThrow(RlpDecodedSignedTransaction2.fromOrThrow(from as any))
  }

  function fromZeroHexOrThrow(from: ZeroHexString): ZeroHexDecodedSignedTransaction2 {
    return fromBytesOrThrow(BytesAsInteger.fromOrThrow(from))
  }

  function fromDecodedOrThrow(from: DecodedSignedTransactionInit2): ZeroHexDecodedSignedTransaction2 {
    const chainId = ZeroHexAsRlpStringOrInteger.fromOrThrow(from.chainId)
    const nonce = ZeroHexAsRlpStringOrInteger.fromOrThrow(from.nonce)
    const maxPriorityFeePerGas = ZeroHexAsRlpStringOrInteger.fromOrThrow(from.maxPriorityFeePerGas)
    const maxFeePerGas = ZeroHexAsRlpStringOrInteger.fromOrThrow(from.maxFeePerGas)
    const gasLimit = ZeroHexAsRlpStringOrInteger.fromOrThrow(from.gasLimit)
    const to = ZeroHexAsRlpStringOrInteger.Length.fromOrThrow(from.to, 20)
    const value = ZeroHexAsRlpStringOrInteger.fromOrThrow(from.value)
    const data = from.data != null ? ZeroHexAsRlpStringOrInteger.fromOrThrow(from.data) : null
    const accessList = from.accessList != null ? ZeroHexAccessList.fromOrThrow(from.accessList) : null
    const v = ZeroHexAsRlpStringOrInteger.fromOrThrow(from.v)
    const r = ZeroHexAsRlpStringOrInteger.Length.fromOrThrow(from.r, 32)
    const s = ZeroHexAsRlpStringOrInteger.Length.fromOrThrow(from.s, 32)

    return new ZeroHexDecodedSignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s)
  }

}