import { Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { asOrThrow } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hexane";
import { Nullable } from "libs/nullable/index.js";
import { Rlp } from "mods/index.js";
import { RlpList, RlpString, RlpStringAsSelfOrInteger, RlpStringOrIntegerLike, ZeroHexAsRlpStringOrInteger } from "mods/rlp/index.js";
import { ExternalSigningKey, RsvBytesSignature, SigningKey } from "mods/secp256k1/index.js";
import { AccessList, RlpAccessItem, RlpAccessList, ZeroHexAccessList } from "../access/index.js";
import { RlpDecodedSignedTransaction2 } from "../signed/index.js";

export abstract class AbstractUnsignedTransaction2 {
  readonly #class = AbstractUnsignedTransaction2

  static readonly type = 0x02

  get type() {
    return this.#class.type
  }

}

export interface DecodedUnsignedTransactionInit2 {
  readonly chainId: RlpStringOrIntegerLike
  readonly nonce: RlpStringOrIntegerLike
  readonly maxPriorityFeePerGas: RlpStringOrIntegerLike
  readonly maxFeePerGas: RlpStringOrIntegerLike
  readonly gasLimit: RlpStringOrIntegerLike
  readonly to: RlpStringOrIntegerLike
  readonly value: RlpStringOrIntegerLike
  readonly data?: Nullable<RlpStringOrIntegerLike>
  readonly accessList?: Nullable<AccessList>
}

export namespace UnsignedTransaction2 {

  export function signOrThrow(transaction: RlpDecodedUnsignedTransaction2.From, signingKey: ExternalSigningKey.From): RlpDecodedSignedTransaction2 {
    return RlpDecodedUnsignedTransaction2.fromOrThrow(transaction).signOrThrow(signingKey)
  }

}

export class ZeroHexDecodedUnsignedTransaction2 extends AbstractUnsignedTransaction2 {

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
  ) {
    super()
  }

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

export class RlpDecodedUnsignedTransaction2 extends AbstractUnsignedTransaction2 {

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
  ) {
    super()
  }

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

export class RlpEncodedTransaction2 extends AbstractUnsignedTransaction2 {
  readonly #class = RlpEncodedTransaction2

  static readonly type = 0x02

  constructor(
    readonly value: RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList]>,
  ) {
    super()
  }

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