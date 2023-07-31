export class TextCursor {

  offset = 0

  constructor(
    readonly text: string,
  ) { }

  read(length: number) {
    return this.text.slice(this.offset, this.offset += length)
  }

}