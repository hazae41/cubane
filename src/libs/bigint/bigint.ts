import { Base16 } from "@hazae41/base16";
import { BytesOrCopiable, Copiable } from "@hazae41/box";
import { ZeroHexInteger } from "index.js";

export namespace BigInts {

  export function tens(value: number) {
    return BigInt(`1${`0`.repeat(value)}`)
  }

  export function encodeRaw(value: bigint) {
    return value.toString(16)
  }

  export function decodeRaw(value: string): bigint {
    return value.length === 0 ? 0n : BigInt(`0x${value}`)
  }

  export function encode(value: bigint): ZeroHexInteger {
    return `0x${encodeRaw(value)}`
  }

  export function decode(value: ZeroHexInteger) {
    return value.length === 2 ? 0n : BigInt(value)
  }

  export function exportOrThrow(value: bigint): Copiable {
    return Base16.get().padStartAndDecodeOrThrow(encodeRaw(value))
  }

  export function importOrThrow(bytes: BytesOrCopiable): bigint {
    return decodeRaw(Base16.get().encodeOrThrow(bytes))
  }

}