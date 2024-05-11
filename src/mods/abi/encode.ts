import { Result } from "@hazae41/result"
import { ZeroHexString } from "mods/types/string/index.js"

export interface Encodable {
  encodeOrThrow(): string
}

export class EncodeError extends Error {
  readonly #class = EncodeError
  readonly name = this.#class.name

  constructor(options?: ErrorOptions) {
    super(`Could not encode`, options)
  }

  static from(cause: unknown) {
    return new EncodeError({ cause })
  }

}

export function encodeOrThrow(encodable: Encodable): ZeroHexString {
  return `0x${encodable.encodeOrThrow()}`
}

export function tryEncode(encodable: Encodable): Result<ZeroHexString, EncodeError> {
  return Result.runAndDoubleWrapSync(() => {
    return encodeOrThrow(encodable)
  }).mapErrSync(EncodeError.from)
}