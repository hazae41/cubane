import { Cursor } from "@hazae41/cursor";
import { Nullable } from "libs/nullable/index.js";
import { BytesAsInteger } from "../formats/index.js";

export interface Eip1559TransactionEnvelopeInit {
  readonly to?: Nullable<BytesAsInteger.From>
  readonly from: BytesAsInteger.From
  readonly value: BytesAsInteger.From
  readonly data: BytesAsInteger.From
  readonly nonce: BytesAsInteger.From
  readonly gas: BytesAsInteger.From
  readonly gasPrice: BytesAsInteger.From
  readonly maxPriorityFeePerGas: BytesAsInteger.From
  readonly maxFeePerGas: BytesAsInteger.From
  readonly chainId: BytesAsInteger.From
}

export namespace Eip1559TransactionEnvelope {

  export type From = Eip1559TransactionEnvelopeInit

}

export class Eip1559TransactionEnvelope {

  readonly type = 0x02

  constructor(
    readonly to: Nullable<BytesAsInteger.From>,
    readonly from: BytesAsInteger.From,
    readonly value: BytesAsInteger.From,
    readonly data: BytesAsInteger.From,
    readonly nonce: BytesAsInteger.From,
    readonly gas: BytesAsInteger.From,
    readonly gasPrice: BytesAsInteger.From,
    readonly maxPriorityFeePerGas: BytesAsInteger.From,
    readonly maxFeePerGas: BytesAsInteger.From,
    readonly chainId: BytesAsInteger.From
  ) { }

  static create(init: Eip1559TransactionEnvelopeInit): Eip1559TransactionEnvelope {
    const { to, from, value, data, nonce, gas, gasPrice, maxPriorityFeePerGas, maxFeePerGas, chainId } = init
    return new Eip1559TransactionEnvelope(to, from, value, data, nonce, gas, gasPrice, maxPriorityFeePerGas, maxFeePerGas, chainId)
  }

  static fromOrThrow(init: Eip1559TransactionEnvelopeInit): Eip1559TransactionEnvelope {
    return Eip1559TransactionEnvelope.create(init)
  }

  writeOrThrow(cursor: Cursor) {

  }

}

export interface Eip2718TransactionEnvelope {


}