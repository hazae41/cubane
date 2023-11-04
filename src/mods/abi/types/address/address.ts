import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { ZeroHexString } from "mods/types/zerohex/index.js";

export class StaticAddress {
  readonly #class = StaticAddress

  readonly size = 32 as const

  private constructor(
    /**
     * Dynamic type conversion
     */
    readonly value: ZeroHexString.From
  ) { }

  /**
   * For best performances, use bytes to encode into bytes, others if you encode into string
   * @param value 
   * @returns 
   */
  static new(value: ZeroHexString.From) {
    return new StaticAddress(value)
  }

  /**
   * For best performances, use bytes to encode into bytes, others if you encode into string
   * @param value 
   * @returns 
   */
  static from(value: ZeroHexString.From) {
    return new StaticAddress(value)
  }

  into() {
    return ZeroHexString.from(this.value)
  }

  static codegen() {
    return `Cubane.Abi.StaticAddress`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    if (typeof this.value === "number")
      return this.value.toString(16).padStart(64, "0")
    if (typeof this.value === "bigint")
      return this.value.toString(16).padStart(64, "0")
    if (this.value instanceof Uint8Array)
      return Base16.get().encodeOrThrow(this.value).padStart(64, "0")
    if (ZeroHexString.is(this.value))
      return this.value.slice(2).padStart(64, "0")
    return this.value.padStart(64, "0")
  }

  encodePackedOrThrow() {
    if (typeof this.value === "number")
      return this.value.toString(16)
    if (typeof this.value === "bigint")
      return this.value.toString(16)
    if (this.value instanceof Uint8Array)
      return Base16.get().encodeOrThrow(this.value)
    if (ZeroHexString.is(this.value))
      return this.value.slice(2)
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 24

    const value = cursor.readOrThrow(40)

    return new StaticAddress(value)
  }

  sizeOrThrow() {
    return this.size
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  writeOrThrow(cursor: Cursor) {
    cursor.fill(0, 32 - 20)

    if (this.value instanceof Uint8Array) {
      cursor.writeOrThrow(this.value)
      return
    }

    const hex = this.encodePackedOrThrow()
    using slice = Base16.get().padStartAndDecodeOrThrow(hex)
    cursor.writeOrThrow(slice.bytes)
  }

  tryWrite(cursor: Cursor): Result<void, Error> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 32 - 20)

      if (this.value instanceof Uint8Array) {
        cursor.tryWrite(this.value).throw(t)
        return Ok.void()
      }

      const hex = this.encodePackedOrThrow()
      using slice = Base16.get().tryPadStartAndDecode(hex).throw(t)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static readOrThrow(cursor: Cursor) {
    cursor.offset += 32 - 20

    const bytes = cursor.readOrThrow(20)

    return new StaticAddress(bytes)
  }

  static tryRead(cursor: Cursor): Result<StaticAddress, Error> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - 20

      const bytes = cursor.tryRead(20).throw(t)

      return new Ok(new StaticAddress(bytes))
    })
  }

}