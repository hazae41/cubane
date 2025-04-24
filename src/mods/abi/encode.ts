import { ZeroHexString } from "@hazae41/hex"

export interface Encodable {
  encodeOrThrow(): string
}

export function encodeOrThrow(encodable: Encodable): ZeroHexString {
  return `0x${encodable.encodeOrThrow()}` as ZeroHexString
}