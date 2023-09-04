import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { ZeroHexString } from "mods/types/hex.js";

export class StaticAddress {
  readonly #class = StaticAddress

  readonly size = 32 as const

  private constructor(
    readonly value: ZeroHexString
  ) { }

  static new(value: ZeroHexString) {
    return new StaticAddress(value)
  }

  static from(value: ZeroHexString) {
    return new StaticAddress(value)
  }

  static codegen() {
    return `Cubane.Abi.StaticAddress`
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
    const value = "0x" + cursor.read(40)

    return new StaticAddress(value as ZeroHexString)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, Error> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 32 - 20)

      const hex = this.value.slice(2)
      using slice = Base16.get().tryPadStartAndDecode(hex).throw(t)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<StaticAddress, Error> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - 20

      const bytes = cursor.tryRead(20).throw(t)

      // p42:ignore-next-statement
      const value = "0x" + Base16.get().tryEncode(bytes).throw(t)

      return new Ok(new StaticAddress(value as ZeroHexString))
    })
  }

}