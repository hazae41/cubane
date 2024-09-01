import { ZeroHexString } from "mods/types/string/index.js"

export interface Encodable {
  encodeOrThrow(): string
}

export function encodeOrThrow(encodable: Encodable): ZeroHexString {
  return `0x${encodable.encodeOrThrow()}` as ZeroHexString
}