import { Base16 } from "@hazae41/base16";
import { BytesOrCopiable, Copiable } from "@hazae41/box";
import { ZeroHexString } from "mods/index.js";
import { ZeroHexInteger } from "mods/types/integer/index.js";

export namespace BigInts {

  export function tens(value: number) {
    return BigInt(`1${`0`.repeat(value)}`)
  }

  export function encodeRawHex(value: bigint) {
    return value.toString(16)
  }

  export function decodeRawHex(value: string): bigint {
    return value.length < 1 ? 0n : BigInt(`0x${value}`)
  }

  export function encodeZeroHex(value: bigint): ZeroHexInteger {
    return `0x${encodeRawHex(value)}`
  }

  export function decodeZeroHex(value: ZeroHexInteger): bigint {
    return value.length < 3 ? 0n : BigInt(value)
  }

  export function encodeDecimal(value: bigint): string {
    return value.toString()
  }

  export function decodeDecimal(value: string): bigint {
    return value.length < 1 ? 0n : BigInt(value)
  }

  export function decodeZeroHexOrDecimal(value: string): bigint {
    if (ZeroHexString.String.is(value))
      return decodeZeroHex(value)
    else
      return decodeDecimal(value)
  }

  export function exportOrThrow(value: bigint): Copiable {
    return Base16.get().padStartAndDecodeOrThrow(encodeRawHex(value))
  }

  export function importOrThrow(bytes: BytesOrCopiable): bigint {
    return decodeRawHex(Base16.get().encodeOrThrow(bytes))
  }

}