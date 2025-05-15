import { Writable } from "@hazae41/binary";
import { asOrNull, asOrThrow } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hexane";
import { Nullable } from "libs/nullable/index.js";
import { BigIntAsInteger, BytesAsInteger, ZeroHexAsInteger } from "mods/convert/index.js";
import { RlpList, RlpString, RlpStringAsInteger, RlpType } from "mods/rlp/index.js";

export interface Eip1559TransactionInit {
  readonly chainId: RlpStringAsInteger.From
  readonly nonce: RlpStringAsInteger.From
  readonly maxPriorityFeePerGas: RlpStringAsInteger.From
  readonly maxFeePerGas: RlpStringAsInteger.From
  readonly gasLimit: RlpStringAsInteger.From
  readonly to: RlpStringAsInteger.From
  readonly value: RlpStringAsInteger.From
  readonly data?: Nullable<RlpStringAsInteger.From>
  readonly accessList?: Nullable<RlpStringAsInteger.From>
}

export class ZeroHexEip1559Transaction {

  constructor(
    readonly chainId: ZeroHexString,
    readonly nonce: ZeroHexString,
    readonly maxPriorityFeePerGas: ZeroHexString,
    readonly maxFeePerGas: ZeroHexString,
    readonly gasLimit: ZeroHexString,
    readonly to: ZeroHexString<20>,
    readonly value: ZeroHexString,
    readonly data: Nullable<ZeroHexString>,
    readonly accessList: Nullable<ZeroHexString>,
  ) { }

  toJSON() {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = this
    return { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList }
  }

}

export class JsEip1559Transaction {

  constructor(
    readonly chainId: bigint,
    readonly nonce: bigint,
    readonly maxPriorityFeePerGas: bigint,
    readonly maxFeePerGas: bigint,
    readonly gasLimit: bigint,
    readonly to: ZeroHexString<20>,
    readonly value: bigint,
    readonly data: Nullable<Uint8Array>,
    readonly accessList: Nullable<Uint8Array>,
  ) { }

}

export namespace JsEip1559Transaction {

  export type From = Eip1559TransactionInit

  export function fromOrThrow(init: Eip1559TransactionInit): JsEip1559Transaction {
    const chainId = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.chainId))
    const nonce = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.nonce))
    const maxPriorityFeePerGas = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.maxPriorityFeePerGas))
    const maxFeePerGas = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.maxFeePerGas))
    const gasLimit = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.gasLimit))
    const to = ZeroHexAsInteger.Length.fromOrThrow(RlpString.unwrap(init.to), 20)
    const value = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.value))
    const data = init.data != null ? BytesAsInteger.fromOrThrow(RlpString.unwrap(init.data)) : null
    const accessList = init.accessList != null ? BytesAsInteger.fromOrThrow(RlpString.unwrap(init.accessList)) : null

    return new JsEip1559Transaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }
}

export class RlpEip1559Transaction {

  constructor(
    readonly chainId: RlpString,
    readonly nonce: RlpString,
    readonly maxPriorityFeePerGas: RlpString,
    readonly maxFeePerGas: RlpString,
    readonly gasLimit: RlpString,
    readonly to: RlpString,
    readonly value: RlpString,
    readonly data: Nullable<RlpString>,
    readonly accessList: Nullable<RlpType>,
  ) { }

  static decodeOrThrow(root: RlpType): RlpEip1559Transaction {
    const list = asOrThrow(RlpList, root)

    let cursor = 0

    const chainId = asOrThrow(RlpString, list.value[cursor++])
    const nonce = asOrThrow(RlpString, list.value[cursor++])
    const maxPriorityFeePerGas = asOrThrow(RlpString, list.value[cursor++])
    const maxFeePerGas = asOrThrow(RlpString, list.value[cursor++])
    const gasLimit = asOrThrow(RlpString, list.value[cursor++])
    const to = asOrThrow(RlpString, list.value[cursor++])
    const value = asOrThrow(RlpString, list.value[cursor++])
    const data = asOrNull(RlpString, list.value[cursor++])
    const accessList = asOrNull(RlpString, list.value[cursor++])

    if (cursor !== list.value.length)
      throw new Error("Invalid cursor")

    return new RlpEip1559Transaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

  encodeOrThrow(): RlpList {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = this

    const list: RlpType[] = [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value]

    if (data != null)
      list.push(data)

    if (accessList != null)
      list.push(accessList)

    return RlpList.fromOrThrow(list)
  }

}

export namespace RlpEip1559Transaction {

  export type From = Eip1559TransactionInit

  export function fromOrThrow(init: Eip1559TransactionInit): RlpEip1559Transaction {
    const chainId = RlpStringAsInteger.fromOrThrow(init.chainId)
    const nonce = RlpStringAsInteger.fromOrThrow(init.nonce)
    const maxPriorityFeePerGas = RlpStringAsInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = RlpStringAsInteger.fromOrThrow(init.maxFeePerGas)
    const gasLimit = RlpStringAsInteger.fromOrThrow(init.gasLimit)
    const to = RlpStringAsInteger.fromOrThrow(init.to)
    const value = RlpStringAsInteger.fromOrThrow(init.value)
    const data = init.data != null ? RlpStringAsInteger.fromOrThrow(init.data) : null
    const accessList = init.accessList != null ? RlpStringAsInteger.fromOrThrow(init.accessList) : null

    return new RlpEip1559Transaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

}

function tx2bytes(x: JsEip1559Transaction) {
  return Writable.writeToBytesOrThrow(RlpEip1559Transaction.fromOrThrow(x).encodeOrThrow())
}