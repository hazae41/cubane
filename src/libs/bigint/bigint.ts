import { Base16 } from "@hazae41/base16";
import { BytesOrCopiable, Copiable } from "@hazae41/box";
import { ZeroHexString } from "index.js";

export namespace BigInts {

  export function tens(value: number) {
    return BigInt(`1${`0`.repeat(value)}`)
  }

  export function encodeRawHex(value: bigint) {
    return value.toString(16)
  }

  export function decodeRawHex(value: string): bigint {
    return value.length ? BigInt(`0x${value}`) : 0n
  }

  export function encode(value: bigint): ZeroHexString {
    return `0x${encodeRawHex(value)}`
  }

  export function decode(value: ZeroHexString) {
    return decodeRawHex(value.slice(2))
  }

  export function exportOrThrow(value: bigint): Copiable {
    return Base16.get().padStartAndDecodeOrThrow(encodeRawHex(value))
  }

  export function importOrThrow(bytes: BytesOrCopiable): bigint {
    return decodeRawHex(Base16.get().encodeOrThrow(bytes))
  }

}