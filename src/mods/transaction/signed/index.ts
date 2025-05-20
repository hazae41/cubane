import { Readable, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { asOrThrow } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hexane";
import { Nullable } from "libs/nullable/index.js";
import { BytesAsInteger, ZeroHexAsInteger } from "mods/convert/index.js";
import { DecodedUnsignedTransactionInit2, Rlp } from "mods/index.js";
import { AbstractRlpList, RlpList, RlpString, RlpStringAsSelfOrInteger, ZeroHexAsRlpStringOrInteger } from "mods/rlp/index.js";
import { RlpAccessItem, RlpAccessList, ZeroHexAccessList } from "../access/index.js";

export interface DecodedSignedTransactionInit2 extends DecodedUnsignedTransactionInit2 {
  readonly v: RlpStringAsSelfOrInteger.From
  readonly r: RlpStringAsSelfOrInteger.From
  readonly s: RlpStringAsSelfOrInteger.From
}

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

export class ZeroHexDecodedSignedTransaction2 {
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
  ) { }

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

  export type From =
    | DecodedSignedTransactionInit2
    | ZeroHexEncodedSignedTransaction2
    | RlpEncodedSignedTransaction2
    | ZeroHexEncodedSignedTransactionInit2
    | RlpEncodedSignedTransactionInit2

  export function fromOrThrow(from: From): ZeroHexDecodedSignedTransaction2 {
    if (from instanceof ZeroHexDecodedSignedTransaction2)
      return from

    if (from instanceof RlpEncodedSignedTransaction2)
      return fromRlpOrThrow(from.value)
    if (from instanceof ZeroHexEncodedSignedTransaction2)
      return fromZeroHexOrThrow(from.value)

    if (from instanceof AbstractRlpList)
      return fromRlpOrThrow(from)

    if (typeof from === "object")
      return fromDecodedOrThrow(from)

    return fromZeroHexOrThrow(from)
  }

  function fromRlpOrThrow(from: AbstractRlpList): ZeroHexDecodedSignedTransaction2 {
    const encoded = new RlpEncodedSignedTransaction2(from as any)
    const decoded = RlpDecodedSignedTransaction2.decodeOrThrow(encoded)

    return fromDecodedOrThrow(decoded)
  }

  function fromZeroHexOrThrow(from: ZeroHexString): ZeroHexDecodedSignedTransaction2 {
    const bytes = BytesAsInteger.fromOrThrow(from)

    const encoded = Readable.readFromBytesOrThrow(RlpEncodedSignedTransaction2, bytes)
    const decoded = RlpDecodedSignedTransaction2.decodeOrThrow(encoded)

    return fromDecodedOrThrow(decoded)
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

  toRlpEncodedOrThrow() {
    return RlpEncodedSignedTransaction2.encodeOrThrow(this)
  }

  toZeroHexEncodedOrThrow() {
    return ZeroHexEncodedSignedTransaction2.fromOrThrow(this)
  }

  toZeroHexDecodedOrThrow() {
    return ZeroHexDecodedSignedTransaction2.fromOrThrow(this)
  }

}

export namespace RlpDecodedSignedTransaction2 {

  export type From =
    | DecodedSignedTransactionInit2
    | BytesEncodedSignedTransaction2
    | ZeroHexEncodedSignedTransaction2
    | RlpEncodedSignedTransaction2
    | BytesEncodedSignedTransactionInit2
    | ZeroHexEncodedSignedTransactionInit2
    | RlpEncodedSignedTransactionInit2

  export function fromOrThrow(from: From): RlpDecodedSignedTransaction2 {
    if (from instanceof RlpDecodedSignedTransaction2)
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

  function fromBytesOrThrow(from: Uint8Array): RlpDecodedSignedTransaction2 {
    return RlpDecodedSignedTransaction2.decodeOrThrow(Readable.readFromBytesOrThrow(RlpEncodedSignedTransaction2, from))
  }

  function fromRlpOrThrow(from: AbstractRlpList): RlpDecodedSignedTransaction2 {
    return RlpDecodedSignedTransaction2.decodeOrThrow(new RlpEncodedSignedTransaction2(from as any))
  }

  function fromZeroHexOrThrow(from: ZeroHexString): RlpDecodedSignedTransaction2 {
    return fromBytesOrThrow(BytesAsInteger.fromOrThrow(from))
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

export type RlpEncodedSignedTransactionInit2 = RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList, RlpString, RlpString, RlpString]>

export type RlpEncodedSignedTransactionValue2 = RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList, RlpString, RlpString, RlpString]>

export class RlpEncodedSignedTransaction2 {
  readonly #class = RlpEncodedSignedTransaction2

  static readonly type = 0x02

  constructor(
    readonly value: RlpEncodedSignedTransactionValue2
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

  toRlpDecodedOrThrow() {
    return RlpDecodedSignedTransaction2.decodeOrThrow(this)
  }

  toZeroHexEncodedOrThrow() {
    return ZeroHexEncodedSignedTransaction2.fromOrThrow(this)
  }

}

export namespace RlpEncodedSignedTransaction2 {

  export type From =
    | DecodedSignedTransactionInit2
    | BytesEncodedSignedTransaction2
    | ZeroHexEncodedSignedTransaction2
    | RlpEncodedSignedTransaction2
    | BytesEncodedSignedTransactionInit2
    | ZeroHexEncodedSignedTransactionInit2
    | RlpEncodedSignedTransactionInit2

  export function fromOrThrow(from: From): RlpEncodedSignedTransaction2 {
    if (from instanceof RlpEncodedSignedTransaction2)
      return from

    if (from instanceof BytesEncodedSignedTransaction2)
      return fromBytesOrThrow(from.value)
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

  function fromRlpOrThrow(from: AbstractRlpList): RlpEncodedSignedTransaction2 {
    return new RlpEncodedSignedTransaction2(from as RlpEncodedSignedTransactionValue2)
  }

  function fromBytesOrThrow(from: BytesEncodedSignedTransactionInit2): RlpEncodedSignedTransaction2 {
    return Readable.readFromBytesOrThrow(RlpEncodedSignedTransaction2, from)
  }

  function fromZeroHexOrThrow(from: ZeroHexString): RlpEncodedSignedTransaction2 {
    return fromBytesOrThrow(BytesAsInteger.fromOrThrow(from))
  }

  function fromDecodedOrThrow(from: DecodedSignedTransactionInit2): RlpEncodedSignedTransaction2 {
    return RlpEncodedSignedTransaction2.encodeOrThrow(RlpDecodedSignedTransaction2.fromOrThrow(from))
  }

}

export type BytesEncodedSignedTransactionInit2 = Uint8Array

export type BytesEncodedSignedTransactionValue2 = Uint8Array

export class BytesEncodedSignedTransaction2 {
  readonly #class = BytesEncodedSignedTransaction2

  constructor(
    readonly value: BytesEncodedSignedTransactionValue2,
  ) { }

}

export namespace BytesEncodedSignedTransaction2 {

  export type From =
    | DecodedSignedTransactionInit2
    | BytesEncodedSignedTransaction2
    | ZeroHexEncodedSignedTransaction2
    | RlpEncodedSignedTransaction2
    | BytesEncodedSignedTransactionInit2
    | ZeroHexEncodedSignedTransactionInit2
    | RlpEncodedSignedTransactionInit2

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

  function fromBytesOrThrow(from: BytesEncodedSignedTransactionInit2): BytesEncodedSignedTransaction2 {
    return new BytesEncodedSignedTransaction2(from)
  }

  function fromZeroHexOrThrow(from: ZeroHexString): BytesEncodedSignedTransaction2 {
    const bytes = BytesAsInteger.fromOrThrow(from)

    return new BytesEncodedSignedTransaction2(bytes)
  }

  function fromRlpOrThrow(from: AbstractRlpList): BytesEncodedSignedTransaction2 {
    const bytes = Writable.writeToBytesOrThrow(from)

    return new BytesEncodedSignedTransaction2(bytes)
  }

  function fromDecodedOrThrow(from: DecodedSignedTransactionInit2): BytesEncodedSignedTransaction2 {
    const encoded = RlpEncodedSignedTransaction2.fromOrThrow(from)
    const bytes = Writable.writeToBytesOrThrow(encoded)

    return new BytesEncodedSignedTransaction2(bytes)
  }

}

export type ZeroHexEncodedSignedTransactionInit2 = ZeroHexString

export type ZeroHexEncodedSignedTransactionValue2 = ZeroHexString

export class ZeroHexEncodedSignedTransaction2 {
  readonly #class = ZeroHexEncodedSignedTransaction2

  constructor(
    readonly value: ZeroHexString,
  ) { }

  toRlpDecodedOrThrow() {
    return RlpDecodedSignedTransaction2.fromOrThrow(this)
  }

  toRlpEncodedOrThrow() {
    return RlpEncodedSignedTransaction2.fromOrThrow(this)
  }

}

export namespace ZeroHexEncodedSignedTransaction2 {

  export type From =
    | DecodedSignedTransactionInit2
    | BytesEncodedSignedTransaction2
    | ZeroHexEncodedSignedTransaction2
    | RlpEncodedSignedTransaction2
    | BytesEncodedSignedTransactionInit2
    | ZeroHexEncodedSignedTransactionInit2
    | RlpEncodedSignedTransactionInit2

  export function fromOrThrow(from: From): ZeroHexEncodedSignedTransaction2 {
    if (from instanceof ZeroHexEncodedSignedTransaction2)
      return from

    if (from instanceof BytesEncodedSignedTransaction2)
      return fromBytesOrThrow(from.value)
    if (from instanceof RlpEncodedSignedTransaction2)
      return fromRlpOrThrow(from.value)

    if (from instanceof AbstractRlpList)
      return fromRlpOrThrow(from)
    if (from instanceof Uint8Array)
      return fromBytesOrThrow(from)

    if (typeof from === "object")
      return fromDecodedOrThrow(from)

    return fromZeroHexOrThrow(from)
  }

  function fromZeroHexOrThrow(from: ZeroHexString): ZeroHexEncodedSignedTransaction2 {
    return new ZeroHexEncodedSignedTransaction2(from)
  }

  function fromBytesOrThrow(from: Uint8Array): ZeroHexEncodedSignedTransaction2 {
    const zerohex = ZeroHexAsInteger.fromOrThrow(from)

    return new ZeroHexEncodedSignedTransaction2(zerohex)
  }

  function fromRlpOrThrow(from: AbstractRlpList): ZeroHexEncodedSignedTransaction2 {
    const bytes = Writable.writeToBytesOrThrow(from)
    const zerohex = ZeroHexAsInteger.fromOrThrow(bytes)

    return new ZeroHexEncodedSignedTransaction2(zerohex)
  }

  function fromDecodedOrThrow(from: DecodedSignedTransactionInit2): ZeroHexEncodedSignedTransaction2 {
    const encoded = RlpEncodedSignedTransaction2.fromOrThrow(from)
    const bytes = Writable.writeToBytesOrThrow(encoded)
    const zerohex = ZeroHexAsInteger.fromOrThrow(bytes)

    return new ZeroHexEncodedSignedTransaction2(zerohex)
  }

}