export * from "./decoded/rlp/index.js";
export * from "./decoded/zerohex/index.js";
export * from "./encoded/bytes/index.js";
export * from "./encoded/rlp/index.js";
export * from "./encoded/zerohex/index.js";

import { DecodedUnsignedTransactionInit2 } from "mods/index.js";
import { RlpStringOrIntegerLike } from "mods/rlp/index.js";
import { RlpDecodedSignedTransaction2 } from "./decoded/rlp/index.js";
import { ZeroHexDecodedSignedTransaction2 } from "./decoded/zerohex/index.js";
import { BytesEncodedSignedTransaction2, BytesEncodedSignedTransactionInit2 } from "./encoded/bytes/index.js";
import { RlpEncodedSignedTransaction2, RlpEncodedSignedTransactionInit2 } from "./encoded/rlp/index.js";
import { ZeroHexEncodedSignedTransaction2, ZeroHexEncodedSignedTransactionInit2 } from "./encoded/zerohex/index.js";

export abstract class AbstractSignedTransaction2 {
  readonly #class = AbstractSignedTransaction2

  static readonly type = 0x02

  get type() {
    return this.#class.type
  }

  toZeroHexDecodedOrThrow() {
    return ZeroHexDecodedSignedTransaction2.fromOrThrow(this)
  }

  toRlpDecodedOrThrow() {
    return RlpDecodedSignedTransaction2.fromOrThrow(this)
  }

  toRlpEncodedOrThrow() {
    return RlpEncodedSignedTransaction2.fromOrThrow(this)
  }

  toBytesEncodedOrThrow() {
    return BytesEncodedSignedTransaction2.fromOrThrow(this)
  }

  toZeroHexEncodedOrThrow() {
    return ZeroHexEncodedSignedTransaction2.fromOrThrow(this)
  }

}

export type SignedTransactionInit2 =
  | DecodedSignedTransactionInit2
  | BytesEncodedSignedTransactionInit2
  | ZeroHexEncodedSignedTransactionInit2
  | RlpEncodedSignedTransactionInit2

export type SignedTransaction2 =
  | ZeroHexDecodedSignedTransaction2
  | RlpDecodedSignedTransaction2
  | RlpEncodedSignedTransaction2
  | BytesEncodedSignedTransaction2
  | ZeroHexEncodedSignedTransaction2

export namespace SignedTransaction2 {

  export function unsignOrThrow(transaction: RlpDecodedSignedTransaction2.From): DecodedUnsignedTransactionInit2 {
    // return RlpDecodedSignedTransaction2.fromOrThrow(transaction)
  }

}

export interface DecodedSignedTransactionInit2 extends DecodedUnsignedTransactionInit2 {
  readonly v: RlpStringOrIntegerLike
  readonly r: RlpStringOrIntegerLike
  readonly s: RlpStringOrIntegerLike
}