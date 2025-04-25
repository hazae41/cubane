import { Base16 } from "@hazae41/base16";
import { Box } from "@hazae41/box";
import { Bytes, Uint8Array } from "@hazae41/bytes";
import { ZeroHexString } from "@hazae41/hex";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { BytesAsInteger, BytesAsUtf8, ZeroHexAsInteger } from "mods/types/formats/index.js";
import { ExtSignature } from "../signature/index.js";

export type SigningKey =
  | ZeroHexSigningKey
  | BytesSigningKey
  | ExtSigningKey

export namespace SigningKey {

  export type From =
    | ZeroHexSigningKey.From
    | BytesSigningKey.From
    | ExtSigningKey.From

  export function getVerifyingKeyOrThrow(privateKeyFrom: SigningKey.From) {
    using tsigningKey = ExtSigningKey.fromOrThrow(privateKeyFrom)

    return tsigningKey.get().getVerifyingKeyOrThrow()
  }

  export function signUnsafeMessageOrThrow(privateKey: SigningKey.From, message: BytesAsUtf8.From): ExtSignature {
    using tsigningKey = ExtSigningKey.fromOrThrow(privateKey)
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    using hash = Keccak256.get().getOrThrow().hashOrThrow(tmessage)

    return tsigningKey.get().signOrThrow(hash)
  }

  export function signPersonalMessageOrThrow(privateKey: SigningKey.From, message: BytesAsUtf8.From) {
    using tsigningKey = ExtSigningKey.fromOrThrow(privateKey)
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
    const concat = Bytes.concat([prefix, tmessage])

    using hash = Keccak256.get().getOrThrow().hashOrThrow(concat)

    return tsigningKey.get().signOrThrow(hash)
  }

}

export type ZeroHexSigningKey = ZeroHexString<32>

export namespace ZeroHexSigningKey {

  export type From = ZeroHexAsInteger.From

  export function fromOrThrow(from: SigningKey.From): ZeroHexSigningKey {
    if (from instanceof Secp256k1.SigningKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSigningKey): ZeroHexSigningKey {
    using slice = from.exportOrThrow()

    const base16 = Base16.get().getOrThrow().encodeOrThrow(slice.bytes)

    return `0x${base16}` as ZeroHexString<32>
  }

  export function fromOtherOrThrow(from: ZeroHexAsInteger.From): ZeroHexSigningKey {
    return ZeroHexAsInteger.Length.fromOrThrow(from, 32)
  }

}

export type BytesSigningKey = Uint8Array<32>

export namespace BytesSigningKey {

  export type From = BytesAsInteger.From

  export function fromOrThrow(from: SigningKey.From): BytesSigningKey {
    if (from instanceof Secp256k1.SigningKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSigningKey): BytesSigningKey {
    return Copiable.copyAndDispose(from.exportOrThrow()) as Uint8Array<32>
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): BytesSigningKey {
    return BytesAsInteger.Length.fromOrThrow(from, 32)
  }

}

export type ExtSigningKey = Secp256k1.SigningKey

export namespace ExtSigningKey {

  export type From = Secp256k1.SigningKey

  export function fromOrThrow(from: SigningKey.From): Box<ExtSigningKey> {
    if (from instanceof Secp256k1.SigningKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtSigningKey): Box<ExtSigningKey> {
    return Box.createAsDropped(from)
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): Box<ExtSigningKey> {
    return new Box(Secp256k1.get().getOrThrow().SigningKey.importOrThrow(BytesAsInteger.Length.fromOrThrow(from, 32)))
  }

}