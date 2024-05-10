import { Base16 } from "@hazae41/base16";
import { BytesOrCopiable, Copiable } from "@hazae41/box";
import { ZeroHexInteger } from "index.js";

export namespace Numbers {

  export function tens(value: number) {
    return Number(`1${`0`.repeat(value)}`)
  }

  export function encodeRawHex(value: number) {
    return value.toString(16)
  }

  export function decodeRawHex(value: string): number {
    return value.length < 2 ? 0 : Number(`0x${value}`)
  }

  export function encodeZeroHex(value: number): ZeroHexInteger {
    return `0x${encodeRawHex(value)}`
  }

  export function decodeZeroHex(value: ZeroHexInteger): number {
    return value.length < 3 ? 0 : Number(value)
  }

  export function encodeDecimal(value: number): string {
    return value.toString()
  }

  export function decodeDecimal(value: string): number {
    return value.length < 2 ? 0 : Number(value)
  }

  export function decodeZeroHexOrDecimal(value: string): number {
    if (ZeroHexInteger.is(value))
      return decodeZeroHex(value)
    else
      return decodeDecimal(value)
  }

  export function exportOrThrow(value: number): Copiable {
    return Base16.get().padStartAndDecodeOrThrow(encodeRawHex(value))
  }

  export function importOrThrow(bytes: BytesOrCopiable): number {
    return decodeRawHex(Base16.get().encodeOrThrow(bytes))
  }

}