import { Base16 } from "@hazae41/base16";
import { BytesOrCopiable, Copiable } from "@hazae41/box";
import { Result } from "@hazae41/result";

export namespace BigInts {

  export function decodeRawHexSafe(rawHex: string): bigint {
    return rawHex.length ? BigInt("0x" + rawHex) : 0n
  }

  export function exportOrThrow(value: bigint): Copiable {
    return Base16.get().padStartAndDecodeOrThrow(value.toString(16))
  }

  export function tryExport(value: bigint): Result<Copiable, Base16.DecodingError> {
    return Base16.get().tryPadStartAndDecode(value.toString(16))
  }

  export function importOrThrow(bytes: BytesOrCopiable): bigint {
    return decodeRawHexSafe(Base16.get().encodeOrThrow(bytes))
  }

  export function tryImport(bytes: BytesOrCopiable): Result<bigint, Base16.EncodingError> {
    return Base16.get().tryEncode(bytes).mapSync(decodeRawHexSafe)
  }

}