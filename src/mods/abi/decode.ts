import { Result } from "@hazae41/result"
import { TextCursor } from "libs/cursor/cursor.js"
import { ZeroHexString } from "mods/types/zerohex/index.js"

export interface Decodable<T> {
  decodeOrThrow(text: TextCursor): T
}

export class DecodeError extends Error {
  readonly #class = DecodeError
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Could not decode`, options)
  }

  static from(cause: unknown) {
    return new DecodeError({ cause })
  }

}

export function decodeOrThrow<T>(decodable: Decodable<T>, hex: ZeroHexString): T {
  const cursor = new TextCursor(hex.slice(2))
  const decoded = decodable.decodeOrThrow(cursor)

  if (cursor.remaining >= 64)
    throw new Error(`Underflow`)

  return decoded
}

export function tryDecode<T>(decodable: Decodable<T>, hex: ZeroHexString): Result<T, DecodeError> {
  return Result.runAndDoubleWrapSync(() => {
    return decodeOrThrow(decodable, hex)
  }).mapErrSync(DecodeError.from)
}