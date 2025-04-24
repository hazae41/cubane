import { RawHexString } from "@hazae41/hex"

export class TextCursor {

  offset = 0

  constructor(
    readonly text: string,
  ) { }

  get before() {
    return this.text.slice(0, this.offset)
  }

  get after() {
    return this.text.slice(this.offset)
  }

  get remaining() {
    return this.text.length - this.offset
  }

  readOrThrow<N extends number>(length: N): RawHexString<N> {
    return this.text.slice(this.offset, this.offset += length).padEnd(length, "0") as RawHexString<N>
  }

}