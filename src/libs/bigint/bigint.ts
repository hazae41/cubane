import { Base16 } from "@hazae41/base16";
import { BytesOrCopiable, Copiable } from "@hazae41/box";

export namespace BigInts {

  export function tens(value: number) {
    return BigInt(`1${`0`.repeat(value)}`)
  }

  export function encode(value: bigint) {
    return value.toString(16)
  }

  export function decode(raw: string): bigint {
    return raw.length
      ? BigInt(`0x${raw}`)
      : 0n
  }

  export function exportOrThrow(value: bigint): Copiable {
    return Base16.get().padStartAndDecodeOrThrow(encode(value))
  }

  export function importOrThrow(bytes: BytesOrCopiable): bigint {
    return decode(Base16.get().encodeOrThrow(bytes))
  }

}