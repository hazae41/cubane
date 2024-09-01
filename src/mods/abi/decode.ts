import { TextCursor } from "libs/cursor/cursor.js"
import { ZeroHexString } from "mods/types/string/index.js"

export interface Decodable<T> {
  decodeOrThrow(text: TextCursor): T
}

export function decodeOrThrow<T>(decodable: Decodable<T>, hex: ZeroHexString): T {
  return decodable.decodeOrThrow(new TextCursor(hex.slice(2)))
}