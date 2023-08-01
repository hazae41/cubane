import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";

export class StaticAddress {
  readonly #class = StaticAddress

  readonly size = 32 as const

  private constructor(
    /**
     * 0x-prefixed hex address
     */
    readonly value: string
  ) { }

  static new(value: string) {
    return new StaticAddress(value)
  }

  get class() {
    return this.#class
  }

  encode() {
    return this.value.slice(2).padStart(64, "0")
  }

  encodePacked() {
    return this.value.slice(2)
  }

  static decode(cursor: TextCursor) {
    cursor.offset += 24

    // p42:ignore-next-statement
    return new StaticAddress("0x" + cursor.read(40))
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 32 - 20)

      const hex = this.value.slice(2)
      const bytes = Bytes.fromHexSafe(hex)
      cursor.tryWrite(bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<StaticAddress, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - 20

      const bytes = cursor.tryRead(20).throw(t)

      // p42:ignore-next-statement
      const value = "0x" + Bytes.toHex(bytes)

      return new Ok(new StaticAddress(value))
    })
  }

}