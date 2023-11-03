import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";

export class StaticBool {
  readonly #class = StaticBool

  readonly size = 32 as const

  private constructor(
    readonly value: boolean
  ) { }

  static new(value: boolean) {
    return new StaticBool(value)
  }

  static from(value: boolean) {
    return new StaticBool(value)
  }

  into() {
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

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fillOrThrow(0, 31)

    const byte = this.value ? 1 : 0
    cursor.writeUint8OrThrow(byte)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 31)

      const byte = this.value ? 1 : 0
      cursor.tryWriteUint8(byte).throw(t)

      return Ok.void()
    })
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 31

    const byte = cursor.readUint8OrThrow()

    if (byte === 0)
      return new StaticBool(false)
    return new StaticBool(true)
  }

  static tryRead(cursor: Cursor): Result<StaticBool, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 31

      const byte = cursor.tryReadUint8().throw(t)

      if (byte === 0)
        return new Ok(new StaticBool(false))
      return new Ok(new StaticBool(true))
    })
  }

}