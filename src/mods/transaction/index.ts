import { Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { asOrThrow } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hexane";
import { Nullable } from "libs/nullable/index.js";
import { BytesLike, IntegerLike, ZeroHexAsInteger } from "mods/convert/index.js";
import { Rlp } from "mods/index.js";
import { AbstractRlpList, BigIntAsRlpStringOrInteger, BytesAsRlpStringOrInteger, RlpList, RlpString, RlpStringAsSelfOrInteger, RlpType, ZeroHexAsRlpStringOrInteger } from "mods/rlp/index.js";
import { ExternalSigningKey, RsvBytesSignature, RsvSignatureInit, SigningKey } from "mods/secp256k1/index.js";

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

export type JsAccessStorageItem = BytesLike<32>
export type JsAccessStorageList = JsAccessStorageItem[]

export type JsAccessItem = [JsAccessAddress, JsAccessStorageList]
export type JsAccessList = JsAccessItem[]

export type ZeroHexAccessAddress = ZeroHexString<20>

export type ZeroHexAccessStorageItem = ZeroHexString<32>
export type ZeroHexAccessStorageList = ZeroHexAccessStorageItem[]

export type ZeroHexAccessItem = [ZeroHexAccessAddress, ZeroHexAccessStorageList]
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

export class RlpDecodedEip1559Transaction {

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
  ) { }

  static decodeOrThrow(encoded: RlpEncodedEip1559Transaction): RlpDecodedEip1559Transaction {
    const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList] = encoded.value.value

    const data = rawData.value.length > 0 ? rawData : null
    const accessList = rawAccessList.value.length > 0 ? rawAccessList : null

    return new RlpDecodedEip1559Transaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

  encodeOrThrow(): RlpEncodedEip1559Transaction {
    return RlpEncodedEip1559Transaction.encodeOrThrow(this)
  }

  signOrThrow(signingKey: ExternalSigningKey.From) {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = this

    const payload = Writable.writeToBytesOrThrow(this.encodeOrThrow())

    using signatureExt = SigningKey.signUnprefixedMessageNoOffsetOrThrow(signingKey, payload)
    const signatureRsv = RsvBytesSignature.fromOrThrow(signatureExt)

    const r = RlpStringAsSelfOrInteger.fromOrThrow(signatureRsv.r)
    const s = RlpStringAsSelfOrInteger.fromOrThrow(signatureRsv.s)
    const v = RlpStringAsSelfOrInteger.fromOrThrow(signatureRsv.v)

    return new RlpDecodedEip1559SignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s)
  }

}

export namespace RlpDecodedEip1559Transaction {

  export type From = Eip1559TransactionInit

  export function fromOrThrow(init: Eip1559TransactionInit): RlpDecodedEip1559Transaction {
    const chainId = RlpStringAsSelfOrInteger.fromOrThrow(init.chainId)
    const nonce = RlpStringAsSelfOrInteger.fromOrThrow(init.nonce)
    const maxPriorityFeePerGas = RlpStringAsSelfOrInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = RlpStringAsSelfOrInteger.fromOrThrow(init.maxFeePerGas)
    const gasLimit = RlpStringAsSelfOrInteger.fromOrThrow(init.gasLimit)
    const to = RlpStringAsSelfOrInteger.fromOrThrow(init.to)
    const value = RlpStringAsSelfOrInteger.fromOrThrow(init.value)
    const data = init.data != null ? RlpStringAsSelfOrInteger.fromOrThrow(init.data) : null
    const accessList = init.accessList != null ? RlpAccessList.fromOrThrow(init.accessList) : null

    return new RlpDecodedEip1559Transaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

}

export class RlpEncodedEip1559Transaction {
  readonly #class = RlpEncodedEip1559Transaction

  static readonly type = 0x02

  constructor(
    readonly value: RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList]>,
  ) { }

  static readOrThrow(cursor: Cursor): RlpEncodedEip1559Transaction {
    const root = Rlp.readOrThrow(cursor)
    const list = asOrThrow(RlpList, root)

    let index = 0

    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpList, list.value[index++])

    if (index !== list.value.length)
      throw new Error("Invalid format")

    return new RlpEncodedEip1559Transaction(list as any)
  }

  static encodeOrThrow(decoded: RlpDecodedEip1559Transaction): RlpEncodedEip1559Transaction {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = decoded

    const rawData = data != null ? data : RlpString.empty()
    const rawAccessList = accessList != null ? accessList : RlpList.empty<RlpAccessItem>()

    const encoded = RlpList.fromOrThrow([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList] as const)

    return new RlpEncodedEip1559Transaction(encoded)
  }

  get type() {
    return this.#class.type
  }

  sizeOrThrow() {
    return 1 + this.value.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(this.type)
    this.value.writeOrThrow(cursor)
  }

  decodeOrThrow() {
    return RlpDecodedEip1559Transaction.decodeOrThrow(this)
  }

}

export type Eip1559SignedTransactionInit = Eip1559TransactionInit & RsvSignatureInit

export class JsEip1559SignedTransaction {

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
    readonly v: IntegerLike,
    readonly r: BytesLike<32>,
    readonly s: BytesLike<32>,
  ) { }

}

export class RlpDecodedEip1559SignedTransaction {

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
  ) { }

  static decodeOrThrow(root: RlpType): RlpDecodedEip1559SignedTransaction {
    const list = asOrThrow(RlpList, root)

    let cursor = 0

    const chainId = asOrThrow(RlpString, list.value[cursor++])
    const nonce = asOrThrow(RlpString, list.value[cursor++])
    const maxPriorityFeePerGas = asOrThrow(RlpString, list.value[cursor++])
    const maxFeePerGas = asOrThrow(RlpString, list.value[cursor++])
    const gasLimit = asOrThrow(RlpString, list.value[cursor++])
    const to = asOrThrow(RlpString, list.value[cursor++])
    const value = asOrThrow(RlpString, list.value[cursor++])

    const rawData = asOrThrow(RlpString, list.value[cursor++])
    const data = rawData.value.length > 0 ? rawData : null

    const rawAccessList = asOrThrow(RlpList, list.value[cursor++]) as RlpAccessList
    const accessList = rawAccessList.value.length > 0 ? rawAccessList : null

    const v = asOrThrow(RlpString, list.value[cursor++])
    const r = asOrThrow(RlpString, list.value[cursor++])
    const s = asOrThrow(RlpString, list.value[cursor++])

    if (cursor !== list.value.length)
      throw new Error("Invalid cursor")

    return new RlpDecodedEip1559SignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s)
  }

  encodeOrThrow() {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s } = this

    const rawData = data != null ? data : RlpString.empty()
    const rawAccessList = accessList != null ? accessList : RlpList.empty()

    return RlpList.fromOrThrow([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList, v, r, s] as const)
  }

}

export namespace RlpDecodedEip1559SignedTransaction {

  export type From = Eip1559SignedTransactionInit

  export function fromOrThrow(init: Eip1559SignedTransactionInit): RlpDecodedEip1559SignedTransaction {
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

    return new RlpDecodedEip1559SignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s)
  }

}