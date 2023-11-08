import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";

export class StaticBool {
  readonly #class = StaticBool

  static readonly dynamic = false
  static readonly size = 32

  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: boolean
  ) { }

  static create(value: boolean) {
    return new StaticBool(value)
  }

  static from(value: boolean) {
    return new StaticBool(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.StaticBool`
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
      return new StaticBool(false)
    return new StaticBool(true)
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
      return new StaticBool(false)
    return new StaticBool(true)
  }

}