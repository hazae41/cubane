import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesAsUtf8, RawHexAsUtf8, StringAsUtf8 } from "mods/types/wrapped/generic.js";
import { AbiBytes, BytesAbiBytes, RawHexAbiBytes } from "../bytes/dynamic.js";

export { AbiString as String };

export namespace AbiString {

  export type Create =
    | BytesAbiBytes.Create
    | RawHexAbiBytes.Create

  export type From =
    | BytesAsUtf8.From
    | RawHexAsUtf8.From

}

export class AbiString {
  readonly #class = AbiString

  static readonly dynamic = true

  readonly dynamic = this.#class.dynamic

  constructor(
    readonly value: AbiBytes
  ) { }

  static create(value: AbiString.Create) {
    if (value instanceof Uint8Array)
      return new AbiString(new BytesAbiBytes(value))
    return new AbiString(new RawHexAbiBytes(value))
  }

  static fromOrThrow(value: AbiString.From) {
    if (value instanceof Uint8Array)
      return new AbiString(new BytesAbiBytes(value))
    return new AbiString(new RawHexAbiBytes(RawHexAsUtf8.fromOrThrow(value)))
  }

  intoOrThrow(): string {
    return StringAsUtf8.fromOrThrow(this.value.value)
  }

  /**
   * @deprecated
   */
  toJSON(): string {
    return this.intoOrThrow()
  }

  static codegen() {
    return `Abi.String`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.encodeOrThrow()
  }

  encodePackedOrThrow() {
    return this.value.encodePackedOrThrow()
  }

  static decodeOrThrow(cursor: TextCursor) {
    return new AbiString(AbiBytes.decodeOrThrow(cursor))
  }

  sizeOrThrow() {
    return this.value.sizeOrThrow()
  }

  writeOrThrow(cursor: Cursor) {
    return this.value.writeOrThrow(cursor)
  }

  static readOrThrow(cursor: Cursor) {
    return new AbiString(AbiBytes.readOrThrow(cursor))
  }

}