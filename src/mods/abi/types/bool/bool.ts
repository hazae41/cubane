import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";

export { AbiBool as Bool };

export namespace AbiBool {
  export type Create = boolean
  export type From = boolean
}

export class AbiBool {
  readonly #class = AbiBool

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: boolean
  ) { }

  static create(value: AbiBool.Create) {
    return new AbiBool(value)
  }

  static fromOrThrow(value: AbiBool.From) {
    return new AbiBool(value)
  }

  intoOrThrow(): boolean {
    return this.value
  }

  toJSON(): boolean {
    return this.value
  }

  static codegen() {
    return `Abi.Bool`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.encodePackedOrThrow().padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value ? "1" : "0"
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 62

    if (cursor.readOrThrow(2) === "00")
      return new AbiBool(false)
    return new AbiBool(true)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 31)

    const byte = this.value ? 1 : 0
    cursor.writeUint8OrThrow(byte)
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 31

    const byte = cursor.readUint8OrThrow()

    if (byte === 0)
      return new AbiBool(false)
    return new AbiBool(true)
  }

}