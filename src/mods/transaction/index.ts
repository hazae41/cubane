import { Cursor } from "@hazae41/cursor";
import { ZeroHexString } from "@hazae41/hexane";
import { BigIntAsInteger, BytesAsInteger, ZeroHexAsInteger } from "mods/convert/index.js";
import { RlpString, RlpStringAsInteger } from "mods/rlp/index.js";

export interface Eip1559TransactionInit {
  readonly to: RlpStringAsInteger.From
  readonly from: RlpStringAsInteger.From
  readonly value: RlpStringAsInteger.From
  readonly data: RlpStringAsInteger.From
  readonly nonce: RlpStringAsInteger.From
  readonly gas: RlpStringAsInteger.From
  readonly gasPrice: RlpStringAsInteger.From
  readonly maxPriorityFeePerGas: RlpStringAsInteger.From
  readonly maxFeePerGas: RlpStringAsInteger.From
  readonly chainId: RlpStringAsInteger.From
}

export class ZeroHexEip1559Transaction {

  constructor(
    readonly to: ZeroHexString<20>,
    readonly from: ZeroHexString<20>,
    readonly value: ZeroHexString,
    readonly data: ZeroHexString,
    readonly nonce: ZeroHexString,
    readonly gas: ZeroHexString,
    readonly gasPrice: ZeroHexString,
    readonly maxPriorityFeePerGas: ZeroHexString,
    readonly maxFeePerGas: ZeroHexString,
    readonly chainId: ZeroHexString
  ) { }

  toJSON() {
    const { to, from, value, data, nonce, gas, gasPrice, maxPriorityFeePerGas, maxFeePerGas, chainId } = this
    return { to, from, value, data, nonce, gas, gasPrice, maxPriorityFeePerGas, maxFeePerGas, chainId }
  }

}

export class RawEip1559Transaction {

  constructor(
    readonly to: ZeroHexString<20>,
    readonly from: ZeroHexString<20>,
    readonly value: bigint,
    readonly data: Uint8Array,
    readonly nonce: bigint,
    readonly gas: bigint,
    readonly gasPrice: bigint,
    readonly maxPriorityFeePerGas: bigint,
    readonly maxFeePerGas: bigint,
    readonly chainId: bigint
  ) { }

}

export namespace RawEip1559Transaction {

  export type From = Eip1559TransactionInit

  export function fromOrThrow(init: Eip1559TransactionInit): RawEip1559Transaction {
    const to = ZeroHexAsInteger.Length.fromOrThrow(RlpString.unwrap(init.to), 20)
    const from = ZeroHexAsInteger.Length.fromOrThrow(RlpString.unwrap(init.from), 20)
    const value = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.value))
    const data = BytesAsInteger.fromOrThrow(RlpString.unwrap(init.data))
    const nonce = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.nonce))
    const gas = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.gas))
    const gasPrice = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.gasPrice))
    const maxPriorityFeePerGas = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.maxPriorityFeePerGas))
    const maxFeePerGas = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.maxFeePerGas))
    const chainId = BigIntAsInteger.fromOrThrow(RlpString.unwrap(init.chainId))

    return new RawEip1559Transaction(to, from, value, data, nonce, gas, gasPrice, maxPriorityFeePerGas, maxFeePerGas, chainId)
  }
}

export class RlpEip1559Transaction {

  constructor(
    readonly to: RlpString,
    readonly from: RlpString,
    readonly value: RlpString,
    readonly data: RlpString,
    readonly nonce: RlpString,
    readonly gas: RlpString,
    readonly gasPrice: RlpString,
    readonly maxPriorityFeePerGas: RlpString,
    readonly maxFeePerGas: RlpString,
    readonly chainId: RlpString
  ) { }

  sizeOrThrow() {
    return 0
      + this.to.sizeOrThrow()
      + this.from.sizeOrThrow()
      + this.value.sizeOrThrow()
      + this.data.sizeOrThrow()
      + this.nonce.sizeOrThrow()
      + this.gas.sizeOrThrow()
      + this.gasPrice.sizeOrThrow()
      + this.maxPriorityFeePerGas.sizeOrThrow()
      + this.maxFeePerGas.sizeOrThrow()
      + this.chainId.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    this.to.writeOrThrow(cursor)
    this.from.writeOrThrow(cursor)
    this.value.writeOrThrow(cursor)
    this.data.writeOrThrow(cursor)
    this.nonce.writeOrThrow(cursor)
    this.gas.writeOrThrow(cursor)
    this.gasPrice.writeOrThrow(cursor)
    this.maxPriorityFeePerGas.writeOrThrow(cursor)
    this.maxFeePerGas.writeOrThrow(cursor)
    this.chainId.writeOrThrow(cursor)
  }

}

export namespace RlpEip1559Transaction {

  export type From = Eip1559TransactionInit

  export function fromOrThrow(init: Eip1559TransactionInit): RlpEip1559Transaction {
    const to = RlpStringAsInteger.fromOrThrow(init.to)
    const from = RlpStringAsInteger.fromOrThrow(init.from)
    const value = RlpStringAsInteger.fromOrThrow(init.value)
    const data = RlpStringAsInteger.fromOrThrow(init.data)
    const nonce = RlpStringAsInteger.fromOrThrow(init.nonce)
    const gas = RlpStringAsInteger.fromOrThrow(init.gas)
    const gasPrice = RlpStringAsInteger.fromOrThrow(init.gasPrice)
    const maxPriorityFeePerGas = RlpStringAsInteger.fromOrThrow(init.maxPriorityFeePerGas)
    const maxFeePerGas = RlpStringAsInteger.fromOrThrow(init.maxFeePerGas)
    const chainId = RlpStringAsInteger.fromOrThrow(init.chainId)

    return new RlpEip1559Transaction(to, from, value, data, nonce, gas, gasPrice, maxPriorityFeePerGas, maxFeePerGas, chainId)
  }

}