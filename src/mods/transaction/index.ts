import { asOrNull, asOrThrow } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hexane";
import { Nullable } from "libs/nullable/index.js";
import { BytesLike, IntegerLike, ZeroHexAsInteger } from "mods/convert/index.js";
import { AbstractRlpList, BigIntAsRlpStringOrInteger, BytesAsRlpStringOrInteger, RlpList, RlpString, RlpStringAsSelfOrInteger, RlpType, ZeroHexAsRlpStringOrInteger } from "mods/rlp/index.js";

export interface Eip1559TransactionInit {
  readonly chainId: RlpStringAsSelfOrInteger.From
  readonly nonce: RlpStringAsSelfOrInteger.From
  readonly maxPriorityFeePerGas: RlpStringAsSelfOrInteger.From
  readonly maxFeePerGas: RlpStringAsSelfOrInteger.From
  readonly gasLimit: RlpStringAsSelfOrInteger.From
  readonly to: RlpStringAsSelfOrInteger.From
  readonly value: RlpStringAsSelfOrInteger.From
  readonly data?: Nullable<RlpStringAsSelfOrInteger.From>
  readonly accessList?: Nullable<AccessList>
}

export type JsAccessAddress = BytesLike<20>
export type JsAccessStorage = BytesLike<32>

export type JsAccessItem = [JsAccessAddress, JsAccessStorage[]]
export type JsAccessList = JsAccessItem[]

export type ZeroHexAccessAddress = ZeroHexString<20>
export type ZeroHexAccessStorage = ZeroHexString<32>

export type ZeroHexAccessItem = [ZeroHexAccessAddress, ZeroHexAccessStorage[]]
export type ZeroHexAccessList = ZeroHexAccessItem[]

export type RlpAccessAddress = RlpString

export type RlpAccessStorageItem = RlpString
export type RlpAccessStorageList = RlpList<RlpAccessStorageItem[]>

export type RlpAccessItem = RlpList<[RlpAccessAddress, RlpAccessStorageList]>
export type RlpAccessList = RlpList<RlpAccessItem[]>

export type AccessList =
  | RlpAccessList
  | JsAccessList
  | ZeroHexAccessList

export namespace RlpAccessList {

  export function fromOrThrow(list: AccessList): RlpAccessList {
    if (list instanceof AbstractRlpList)
      return list
    return RlpList.fromOrThrow(list.map(([address, storages]) => RlpList.fromOrThrow([RlpStringAsSelfOrInteger.fromOrThrow(address), RlpList.fromOrThrow(storages.map(storage => RlpStringAsSelfOrInteger.fromOrThrow(storage)))])))
  }

}

export namespace ZeroHexAccessList {

  export function fromOrThrow(list: AccessList): ZeroHexAccessList {
    if (list instanceof AbstractRlpList)
      return fromOrThrow(list.intoOrThrow() as JsAccessList)
    return list.map(([address, storages]) => [ZeroHexAsInteger.Length.fromOrThrow(address, 20), storages.map(storage => ZeroHexAsInteger.Length.fromOrThrow(storage, 32))])
  }

}

export namespace JsAccessList {

  export function fromOrThrow(list: AccessList) {
    return ZeroHexAccessList.fromOrThrow(list)
  }

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
    readonly accessList: Nullable<ZeroHexAccessList>,
  ) { }

  toJSON() {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = this
    return { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList }
  }

}

export namespace ZeroHexEip1559Transaction {

  export type From = Eip1559TransactionInit

  export function fromOrThrow(init: Eip1559TransactionInit): ZeroHexEip1559Transaction {
    const chainId = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.chainId)
    const nonce = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.nonce)
    const maxPriorityFeePerGas = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.maxFeePerGas)
    const gasLimit = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.gasLimit)
    const to = ZeroHexAsRlpStringOrInteger.Length.fromOrThrow(init.to, 20)
    const value = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.value)
    const data = init.data != null ? ZeroHexAsRlpStringOrInteger.fromOrThrow(init.data) : null
    const accessList = init.accessList != null ? ZeroHexAccessList.fromOrThrow(init.accessList) : null

    return new ZeroHexEip1559Transaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
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
    readonly data: Nullable<IntegerLike>,
    readonly accessList: Nullable<JsAccessList>,
  ) { }

}

export namespace JsEip1559Transaction {

  export type From = Eip1559TransactionInit

  export function fromOrThrow(init: Eip1559TransactionInit): JsEip1559Transaction {
    const chainId = BigIntAsRlpStringOrInteger.fromOrThrow(init.chainId)
    const nonce = BigIntAsRlpStringOrInteger.fromOrThrow(init.nonce)
    const maxPriorityFeePerGas = BigIntAsRlpStringOrInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = BigIntAsRlpStringOrInteger.fromOrThrow(init.maxFeePerGas)
    const gasLimit = BigIntAsRlpStringOrInteger.fromOrThrow(init.gasLimit)
    const to = ZeroHexAsRlpStringOrInteger.Length.fromOrThrow(init.to, 20)
    const value = BigIntAsRlpStringOrInteger.fromOrThrow(init.value)
    const data = init.data != null ? BytesAsRlpStringOrInteger.fromOrThrow(init.data) : null
    const accessList = init.accessList != null ? JsAccessList.fromOrThrow(init.accessList) : null

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
    const accessList = asOrNull(RlpList, list.value[cursor++])

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
    const chainId = RlpStringAsSelfOrInteger.fromOrThrow(init.chainId)
    const nonce = RlpStringAsSelfOrInteger.fromOrThrow(init.nonce)
    const maxPriorityFeePerGas = RlpStringAsSelfOrInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = RlpStringAsSelfOrInteger.fromOrThrow(init.maxFeePerGas)
    const gasLimit = RlpStringAsSelfOrInteger.fromOrThrow(init.gasLimit)
    const to = RlpStringAsSelfOrInteger.fromOrThrow(init.to)
    const value = RlpStringAsSelfOrInteger.fromOrThrow(init.value)
    const data = init.data != null ? RlpStringAsSelfOrInteger.fromOrThrow(init.data) : null
    const accessList = init.accessList != null ? RlpAccessList.fromOrThrow(init.accessList) : null

    return new RlpEip1559Transaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

}