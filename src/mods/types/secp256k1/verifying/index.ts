import { Base16 } from "@hazae41/base16";
import { Box } from "@hazae41/box";
import { Bytes, Uint8Array } from "@hazae41/bytes";
import { ZeroHexString } from "@hazae41/hex";
import { Keccak256 } from "@hazae41/keccak256";
import { Secp256k1 } from "@hazae41/secp256k1";
import { Copiable } from "libs/copiable/index.js";
import { BytesAsInteger, BytesAsUtf8, ZeroHexAsInteger } from "mods/types/formats/index.js";
import { ExtSignature } from "../signature/index.js";

export function recoverUnsafeMessageOrThrow(signature: ExtSignature.From, message: BytesAsUtf8.From) {
  using tsignature = ExtSignature.fromOrThrow(signature)
  const tmessage = BytesAsUtf8.fromOrThrow(message)

  using hash = Keccak256.get().getOrThrow().hashOrThrow(tmessage)

  return Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hash, tsignature.get())
}

export function recoverPersonalMessageOrThrow(signature: ExtSignature.From, message: BytesAsUtf8.From) {
  using tsignature = ExtSignature.fromOrThrow(signature)
  const tmessage = BytesAsUtf8.fromOrThrow(message)

  const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
  const concat = Bytes.concat([prefix, tmessage])

  using hash = Keccak256.get().getOrThrow().hashOrThrow(concat)

  return Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hash, tsignature.get())
}

export type VerifyingKey =
  | ExtVerifyingKey

export namespace VerifyingKey {

  export type From =
    | ExtVerifyingKey.From

  export function verifyUnsafeMessageOrThrow(verifyingKey: VerifyingKey.From, signature: ExtSignature.From, message: BytesAsUtf8.From) {
    using tverifyingKey = ExtVerifyingKey.fromOrThrow(verifyingKey)
    using tsignature = ExtSignature.fromOrThrow(signature)
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    using hash = Keccak256.get().getOrThrow().hashOrThrow(tmessage)
    using recovered = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hash, tsignature.get())

    using left = tverifyingKey.get().exportUncompressedOrThrow()
    using right = recovered.exportUncompressedOrThrow()

    return Bytes.equals(left.bytes, right.bytes)
  }

  export function verifyPersonalMessageOrThrow(verifyingKey: VerifyingKey.From, signature: ExtSignature.From, message: BytesAsUtf8.From) {
    using tverifyingKey = ExtVerifyingKey.fromOrThrow(verifyingKey)
    using tsignature = ExtSignature.fromOrThrow(signature)
    const tmessage = BytesAsUtf8.fromOrThrow(message)

    const prefix = Bytes.fromUtf8("\x19Ethereum Signed Message:\n" + tmessage.length.toString())
    const concat = Bytes.concat([prefix, tmessage])

    using hash = Keccak256.get().getOrThrow().hashOrThrow(concat)
    using recovered = Secp256k1.get().getOrThrow().VerifyingKey.recoverOrThrow(hash, tsignature.get())

    using left = tverifyingKey.get().exportUncompressedOrThrow()
    using right = recovered.exportUncompressedOrThrow()

    return Bytes.equals(left.bytes, right.bytes)
  }

}

export type ZeroHexVerifyingKey = ZeroHexString<65>

export namespace ZeroHexVerifyingKey {

  export type From = ZeroHexAsInteger.From

  export function fromOrThrow(from: VerifyingKey.From): ZeroHexVerifyingKey {
    if (from instanceof Secp256k1.VerifyingKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtVerifyingKey): ZeroHexVerifyingKey {
    using slice = from.exportUncompressedOrThrow()

    const base16 = Base16.get().getOrThrow().encodeOrThrow(slice.bytes)

    return `0x${base16}` as ZeroHexString<65>
  }

  export function fromOtherOrThrow(from: ZeroHexAsInteger.From): ZeroHexVerifyingKey {
    return ZeroHexAsInteger.Length.fromOrThrow(from, 65)
  }

}

export type BytesVerifyingKey = Uint8Array<65>

export namespace BytesVerifyingKey {

  export type From = BytesAsInteger.From

  export function fromOrThrow(from: VerifyingKey.From): BytesVerifyingKey {
    if (from instanceof Secp256k1.VerifyingKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtVerifyingKey): BytesVerifyingKey {
    return Copiable.copyAndDispose(from.exportUncompressedOrThrow()) as Uint8Array<65>
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): BytesVerifyingKey {
    return BytesAsInteger.Length.fromOrThrow(from, 65)
  }

}

export type ExtVerifyingKey = Secp256k1.VerifyingKey

export namespace ExtVerifyingKey {

  export type From = Secp256k1.VerifyingKey

  export function fromOrThrow(from: VerifyingKey.From): Box<ExtVerifyingKey> {
    if (from instanceof Secp256k1.VerifyingKey)
      return fromExtOrThrow(from)
    return fromOtherOrThrow(from)
  }

  export function fromExtOrThrow(from: ExtVerifyingKey): Box<ExtVerifyingKey> {
    return new Box(from).moveOrThrow()
  }

  export function fromOtherOrThrow(from: BytesAsInteger.From): Box<ExtVerifyingKey> {
    return new Box(Secp256k1.get().getOrThrow().VerifyingKey.importOrThrow(BytesAsInteger.Length.fromOrThrow(from, 65)))
  }

}