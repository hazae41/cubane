import { Base16, Copiable } from "@hazae41/base16";
import { Result } from "@hazae41/result";

export namespace BigInts {

  export function tryExport(value: bigint): Result<Copiable, Base16.DecodingError> {
    return Base16.get().tryPadStartAndDecode(value.toString(16))
  }

  export function tryImport(bytes: Uint8Array): Result<bigint, Base16.EncodingError> {
    return Base16.get().tryEncode(bytes).mapSync(x => BigInt("0x" + x))
  }

}