import { RawHexString } from "index.js"

export class TextCursor {

  offset = 0

  constructor(
    readonly text: string,
  ) { }

  get remaining() {
    return this.text.length - this.offset
  }

  readOrThrow<N extends number>(length: N): RawHexString<N> {
    if (length > this.remaining)
      throw new Error(`Overflow`)
    return this.text.slice(this.offset, this.offset += length) as RawHexString<N>
  }

}