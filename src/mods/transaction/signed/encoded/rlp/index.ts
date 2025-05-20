import { Readable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { asOrThrow } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hexane";
import { BytesAsInteger } from "mods/convert/index.js";
import { Rlp } from "mods/index.js";
import { AbstractRlpList, RlpList, RlpString } from "mods/rlp/index.js";
import { RlpAccessItem, RlpAccessList } from "../access/index.js";

export type RlpEncodedSignedTransactionInit2 = RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList, RlpString, RlpString, RlpString]>

export type RlpEncodedSignedTransactionValue2 = RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList, RlpString, RlpString, RlpString]>

export class RlpEncodedSignedTransaction2 extends AbstractSignedTransaction2 {
  readonly #class = RlpEncodedSignedTransaction2

  static readonly type = 0x02

  constructor(
    readonly value: RlpEncodedSignedTransactionValue2
  ) {
    super()
  }

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

  export type From = SignedTransaction2 | SignedTransactionInit2

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