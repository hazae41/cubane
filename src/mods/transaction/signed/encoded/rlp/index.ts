import { Readable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { asOrThrow } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hexane";
import { BytesAsBytes } from "mods/convert/index.js";
import { AbstractSignedTransaction2, DecodedSignedTransactionInit2, Rlp, SignedTransactionInit2 } from "mods/index.js";
import { AbstractRlpList, RlpList, RlpString } from "mods/rlp/index.js";
import { RlpAccessItem, RlpAccessList } from "../../../access/index.js";
import { RlpDecodedSignedTransaction2 } from "../../decoded/rlp/index.js";
import { BytesEncodedSignedTransaction2 } from "../bytes/index.js";
import { ZeroHexEncodedSignedTransaction2 } from "../zerohex/index.js";

export type RlpEncodedSignedTransactionInit2 = RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList, RlpString, RlpString, RlpString]>

export type RlpEncodedSignedTransactionValue2 = RlpList<[RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpString, RlpAccessList, RlpString, RlpString, RlpString]>

export class RlpEncodedSignedTransaction2 extends AbstractSignedTransaction2 {
  readonly #class = RlpEncodedSignedTransaction2

  constructor(
    readonly value: RlpEncodedSignedTransactionValue2
  ) {
    super()
  }

  sizeOrThrow() {
    return 1 + this.value.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeUint8OrThrow(this.type)
    this.value.writeOrThrow(cursor)
  }

}

export namespace RlpEncodedSignedTransaction2 {

  export function readOrThrow(cursor: Cursor): RlpEncodedSignedTransaction2 {
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

}

export namespace RlpEncodedSignedTransaction2 {

  export function encodeOrThrow(decoded: RlpDecodedSignedTransaction2): RlpEncodedSignedTransaction2 {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, data, accessList, v, r, s } = decoded

    const rawData = data != null ? data : RlpString.empty()
    const rawAccessList = accessList != null ? accessList : RlpList.empty<RlpAccessItem>()

    const encoded = RlpList.fromOrThrow([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, to, value, rawData, rawAccessList, v, r, s] as const)

    return new RlpEncodedSignedTransaction2(encoded)
  }

}

export namespace RlpEncodedSignedTransaction2 {

  export type From = AbstractSignedTransaction2 | SignedTransactionInit2

  export function fromOrThrow(from: From): RlpEncodedSignedTransaction2 {
    if (from instanceof RlpEncodedSignedTransaction2)
      return from

    if (from instanceof BytesEncodedSignedTransaction2)
      return fromBytesOrThrow(from.value)
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

  function fromRlpOrThrow(from: AbstractRlpList): RlpEncodedSignedTransaction2 {
    return new RlpEncodedSignedTransaction2(from as any)
  }

  function fromBytesOrThrow(from: Uint8Array): RlpEncodedSignedTransaction2 {
    return Readable.readFromBytesOrThrow(RlpEncodedSignedTransaction2, from)
  }

  function fromZeroHexOrThrow(from: ZeroHexString): RlpEncodedSignedTransaction2 {
    return fromBytesOrThrow(BytesAsBytes.fromOrThrow(from))
  }

  function fromDecodedOrThrow(from: DecodedSignedTransactionInit2): RlpEncodedSignedTransaction2 {
    return encodeOrThrow(RlpDecodedSignedTransaction2.fromOrThrow(from))
  }

}