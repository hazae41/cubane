import { ZeroHexString } from "@hazae41/hexane";
import { Nullable } from "libs/nullable/index.js";
import { BytesAsBytes } from "mods/convert/index.js";
import { AbstractRlpList, RlpString, RlpStringAsSelfOrInteger } from "mods/rlp/index.js";
import { RlpAccessList } from "mods/transaction/access/index.js";
import { BytesEncodedSignedTransaction2 } from "../../encoded/bytes/index.js";
import { RlpEncodedSignedTransaction2, RlpEncodedSignedTransactionValue2 } from "../../encoded/rlp/index.js";
import { ZeroHexEncodedSignedTransaction2 } from "../../encoded/zerohex/index.js";
import { AbstractSignedTransaction2, DecodedSignedTransactionInit2, SignedTransactionInit2 } from "../../index.js";

export type RlpDecodedSignedTransactionInit2 = DecodedSignedTransactionInit2

export interface RlpDecodedSignedTransactionValue2 {
  readonly chainId: RlpString,
  readonly nonce: RlpString,
  readonly maxPriorityFeePerGas: RlpString,
  readonly maxFeePerGas: RlpString,
  readonly gasLimit: RlpString,
  readonly to: RlpString,
  readonly value: RlpString,
  readonly data: Nullable<RlpString>,
  readonly accessList: Nullable<RlpAccessList>,
  readonly v: RlpString,
  readonly r: RlpString,
  readonly s: RlpString
}

export class RlpDecodedSignedTransaction2 extends AbstractSignedTransaction2 {
  readonly #class = RlpDecodedSignedTransaction2

  constructor(
    readonly chainId: RlpString,
    readonly nonce: RlpString,
    readonly maxPriorityFeePerGas: RlpString,
    readonly maxFeePerGas: RlpString,
    readonly gasLimit: RlpString,
    readonly to: RlpString,
    readonly value: RlpString,
    readonly data: Nullable<RlpString>,
    readonly accessList: Nullable<RlpAccessList>,
    readonly v: RlpString,
    readonly r: RlpString,
    readonly s: RlpString,
  ) {
    super()
  }

}

export namespace RlpDecodedSignedTransaction2 {

  export function decodeOrThrow(encoded: RlpEncodedSignedTransactionValue2): RlpDecodedSignedTransaction2 {
    const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList, v, r, s] = encoded.value

    const data = rawData.value.length > 0 ? rawData : null
    const accessList = rawAccessList.value.length > 0 ? rawAccessList : null

    return new RlpDecodedSignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s)
  }

}

export namespace RlpDecodedSignedTransaction2 {

  export type From = AbstractSignedTransaction2 | SignedTransactionInit2

  export function fromOrThrow(from: From): RlpDecodedSignedTransaction2 {
    if (from instanceof RlpDecodedSignedTransaction2)
      return from

    if (from instanceof BytesEncodedSignedTransaction2)
      return fromBytesOrThrow(from.value)
    if (from instanceof RlpEncodedSignedTransaction2)
      return fromRlpOrThrow(from.value)
    if (from instanceof ZeroHexEncodedSignedTransaction2)
      return fromZeroHexOrThrow(from.value)
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

  function fromBytesOrThrow(from: Uint8Array): RlpDecodedSignedTransaction2 {
    return decodeOrThrow(RlpEncodedSignedTransaction2.fromOrThrow(from).value)
  }

  function fromRlpOrThrow(from: AbstractRlpList): RlpDecodedSignedTransaction2 {
    return decodeOrThrow(from as any)
  }

  function fromZeroHexOrThrow(from: ZeroHexString): RlpDecodedSignedTransaction2 {
    return fromBytesOrThrow(BytesAsBytes.fromOrThrow(from))
  }

  function fromDecodedOrThrow(init: DecodedSignedTransactionInit2): RlpDecodedSignedTransaction2 {
    const chainId = RlpStringAsSelfOrInteger.fromOrThrow(init.chainId)
    const nonce = RlpStringAsSelfOrInteger.fromOrThrow(init.nonce)
    const maxPriorityFeePerGas = RlpStringAsSelfOrInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = RlpStringAsSelfOrInteger.fromOrThrow(init.maxFeePerGas)
    const gasLimit = RlpStringAsSelfOrInteger.fromOrThrow(init.gasLimit)
    const to = RlpStringAsSelfOrInteger.fromOrThrow(init.to)
    const value = RlpStringAsSelfOrInteger.fromOrThrow(init.value)
    const data = init.data != null ? RlpStringAsSelfOrInteger.fromOrThrow(init.data) : null
    const accessList = init.accessList != null ? RlpAccessList.fromOrThrow(init.accessList) : null
    const v = RlpStringAsSelfOrInteger.fromOrThrow(init.v)
    const r = RlpStringAsSelfOrInteger.fromOrThrow(init.r)
    const s = RlpStringAsSelfOrInteger.fromOrThrow(init.s)

    return new RlpDecodedSignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s)
  }

}