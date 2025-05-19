export * from "./access/index.js";

import { Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { asOrThrow } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hexane";
import { Nullable } from "libs/nullable/index.js";
import { BytesLike, IntegerLike } from "mods/convert/index.js";
import { Rlp } from "mods/index.js";
import { RlpList, RlpString, RlpStringAsSelfOrInteger, ZeroHexAsRlpStringOrInteger } from "mods/rlp/index.js";
import { ExternalSigningKey, RsvBytesSignature, SigningKey } from "mods/secp256k1/index.js";
import { AccessList, RlpAccessItem, RlpAccessList, ZeroHexAccessList } from "./access/index.js";

export interface DecodedUnsignedTransactionInit2 {
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

export namespace UnsignedTransaction2 {

  export function signOrThrow(transaction: RlpDecodedUnsignedTransaction2.From, signingKey: ExternalSigningKey.From): RlpDecodedSignedTransaction2 {
    return RlpDecodedUnsignedTransaction2.fromOrThrow(transaction).signOrThrow(signingKey)
  }

}

export class ZeroHexDecodedUnsignedTransaction2 {

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

export namespace ZeroHexDecodedUnsignedTransaction2 {

  export type From = DecodedUnsignedTransactionInit2

  export function fromOrThrow(init: DecodedUnsignedTransactionInit2): ZeroHexDecodedUnsignedTransaction2 {
    const chainId = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.chainId)
    const nonce = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.nonce)
    const maxPriorityFeePerGas = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.maxFeePerGas)
    const gasLimit = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.gasLimit)
    const to = ZeroHexAsRlpStringOrInteger.Length.fromOrThrow(init.to, 20)
    const value = ZeroHexAsRlpStringOrInteger.fromOrThrow(init.value)
    const data = init.data != null ? ZeroHexAsRlpStringOrInteger.fromOrThrow(init.data) : null
    const accessList = init.accessList != null ? ZeroHexAccessList.fromOrThrow(init.accessList) : null

    return new ZeroHexDecodedUnsignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

}

export class RlpDecodedUnsignedTransaction2 {

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

  static decodeOrThrow(encoded: RlpEncodedTransaction2): RlpDecodedUnsignedTransaction2 {
    const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList] = encoded.value.value

    const data = rawData.value.length > 0 ? rawData : null
    const accessList = rawAccessList.value.length > 0 ? rawAccessList : null

    return new RlpDecodedUnsignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

  encodeOrThrow(): RlpEncodedTransaction2 {
    return RlpEncodedTransaction2.encodeOrThrow(this)
  }

  signOrThrow(signingKey: ExternalSigningKey.From) {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = this

    const payload = Writable.writeToBytesOrThrow(this.encodeOrThrow())

    using signatureExt = SigningKey.signUnprefixedMessageNoOffsetOrThrow(signingKey, payload)
    const signatureRsv = RsvBytesSignature.fromOrThrow(signatureExt)

    const r = RlpStringAsSelfOrInteger.fromOrThrow(signatureRsv.r)
    const s = RlpStringAsSelfOrInteger.fromOrThrow(signatureRsv.s)
    const v = RlpStringAsSelfOrInteger.fromOrThrow(signatureRsv.v)

    return new RlpDecodedSignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s)
  }

}

export namespace RlpDecodedUnsignedTransaction2 {

  export type From = DecodedUnsignedTransactionInit2

  export function fromOrThrow(init: DecodedUnsignedTransactionInit2): RlpDecodedUnsignedTransaction2 {
    const chainId = RlpStringAsSelfOrInteger.fromOrThrow(init.chainId)
    const nonce = RlpStringAsSelfOrInteger.fromOrThrow(init.nonce)
    const maxPriorityFeePerGas = RlpStringAsSelfOrInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = RlpStringAsSelfOrInteger.fromOrThrow(init.maxFeePerGas)
    const gasLimit = RlpStringAsSelfOrInteger.fromOrThrow(init.gasLimit)
    const to = RlpStringAsSelfOrInteger.fromOrThrow(init.to)
    const value = RlpStringAsSelfOrInteger.fromOrThrow(init.value)
    const data = init.data != null ? RlpStringAsSelfOrInteger.fromOrThrow(init.data) : null
    const accessList = init.accessList != null ? RlpAccessList.fromOrThrow(init.accessList) : null

    return new RlpDecodedUnsignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList)
  }

}

export class RlpEncodedTransaction2 {
  readonly #class = RlpEncodedTransaction2

  static readonly type = 0x02

  constructor(
    readonly value: RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList]>,
  ) { }

  static readOrThrow(cursor: Cursor): RlpEncodedTransaction2 {
    const type = cursor.readUint8OrThrow()

    if (type !== RlpEncodedTransaction2.type)
      throw new Error("Invalid type")

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

    return new RlpEncodedTransaction2(list as any)
  }

  static encodeOrThrow(decoded: RlpDecodedUnsignedTransaction2): RlpEncodedTransaction2 {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList } = decoded

    const rawData = data != null ? data : RlpString.empty()
    const rawAccessList = accessList != null ? accessList : RlpList.empty<RlpAccessItem>()

    const encoded = RlpList.fromOrThrow([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList] as const)

    return new RlpEncodedTransaction2(encoded)
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
    return RlpDecodedUnsignedTransaction2.decodeOrThrow(this)
  }

}

export interface DecodedSignedTransactionInit2 extends DecodedUnsignedTransactionInit2 {
  readonly v: IntegerLike
  readonly r: BytesLike<32>
  readonly s: BytesLike<32>
}

export class RlpDecodedSignedTransaction2 {

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

  static decodeOrThrow(encoded: RlpEncodedSignedTransaction2): RlpDecodedSignedTransaction2 {
    const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList, v, r, s] = encoded.value.value

    const data = rawData.value.length > 0 ? rawData : null
    const accessList = rawAccessList.value.length > 0 ? rawAccessList : null

    return new RlpDecodedSignedTransaction2(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s)
  }

  encodeOrThrow() {
    return RlpEncodedSignedTransaction2.encodeOrThrow(this)
  }

}

export namespace RlpDecodedSignedTransaction2 {

  export type From = DecodedSignedTransactionInit2

  export function fromOrThrow(init: DecodedSignedTransactionInit2): RlpDecodedSignedTransaction2 {
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

export class RlpEncodedSignedTransaction2 {
  readonly #class = RlpEncodedSignedTransaction2

  static readonly type = 0x02

  constructor(
    readonly value: RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList, RlpString, RlpString, RlpString]>
  ) { }

  static readOrThrow(cursor: Cursor): RlpEncodedSignedTransaction2 {
    const type = cursor.readUint8OrThrow()

    if (type !== RlpEncodedSignedTransaction2.type)
      throw new Error("Invalid type")

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
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])
    asOrThrow(RlpString, list.value[index++])

    if (index !== list.value.length)
      throw new Error("Invalid length")

    return new RlpEncodedSignedTransaction2(list as any)
  }

  static encodeOrThrow(decoded: RlpDecodedSignedTransaction2): RlpEncodedSignedTransaction2 {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s } = decoded

    const rawData = data != null ? data : RlpString.empty()
    const rawAccessList = accessList != null ? accessList : RlpList.empty<RlpAccessItem>()

    const encoded = RlpList.fromOrThrow([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList, v, r, s] as const)

    return new RlpEncodedSignedTransaction2(encoded)
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
    return RlpDecodedSignedTransaction2.decodeOrThrow(this)
  }

}