import { Base16 } from "@hazae41/base16";
import { Bytes } from "@hazae41/bytes";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";

export class Bytes1 {
  readonly #class = Bytes1
  readonly name = this.#class.name

  static readonly bytes = 1 as const
  static readonly nibbles = 2 as const
  static readonly bits = 8 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 1 }
  ) { }

  static new(value: Uint8Array & { readonly length: 1 }) {
    return new Bytes1(value)
  }

  static from(value: Uint8Array & { readonly length: 1 }) {
    return new Bytes1(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes1`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes1.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes1.bytes).unwrap()

    cursor.offset += 64 - Bytes1.nibbles

    return new Bytes1(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes1.bytes)
    cursor.offset += 32 - Bytes1.bytes
    return new Bytes1(bytes)
  }

}
export class Bytes2 {
  readonly #class = Bytes2
  readonly name = this.#class.name

  static readonly bytes = 2 as const
  static readonly nibbles = 4 as const
  static readonly bits = 16 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 2 }
  ) { }

  static new(value: Uint8Array & { readonly length: 2 }) {
    return new Bytes2(value)
  }

  static from(value: Uint8Array & { readonly length: 2 }) {
    return new Bytes2(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes2`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes2.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes2.bytes).unwrap()

    cursor.offset += 64 - Bytes2.nibbles

    return new Bytes2(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes2.bytes)
    cursor.offset += 32 - Bytes2.bytes
    return new Bytes2(bytes)
  }

}
export class Bytes3 {
  readonly #class = Bytes3
  readonly name = this.#class.name

  static readonly bytes = 3 as const
  static readonly nibbles = 6 as const
  static readonly bits = 24 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 3 }
  ) { }

  static new(value: Uint8Array & { readonly length: 3 }) {
    return new Bytes3(value)
  }

  static from(value: Uint8Array & { readonly length: 3 }) {
    return new Bytes3(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes3`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes3.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes3.bytes).unwrap()

    cursor.offset += 64 - Bytes3.nibbles

    return new Bytes3(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes3.bytes)
    cursor.offset += 32 - Bytes3.bytes
    return new Bytes3(bytes)
  }

}
export class Bytes4 {
  readonly #class = Bytes4
  readonly name = this.#class.name

  static readonly bytes = 4 as const
  static readonly nibbles = 8 as const
  static readonly bits = 32 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 4 }
  ) { }

  static new(value: Uint8Array & { readonly length: 4 }) {
    return new Bytes4(value)
  }

  static from(value: Uint8Array & { readonly length: 4 }) {
    return new Bytes4(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes4`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes4.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes4.bytes).unwrap()

    cursor.offset += 64 - Bytes4.nibbles

    return new Bytes4(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes4.bytes)
    cursor.offset += 32 - Bytes4.bytes
    return new Bytes4(bytes)
  }

}
export class Bytes5 {
  readonly #class = Bytes5
  readonly name = this.#class.name

  static readonly bytes = 5 as const
  static readonly nibbles = 10 as const
  static readonly bits = 40 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 5 }
  ) { }

  static new(value: Uint8Array & { readonly length: 5 }) {
    return new Bytes5(value)
  }

  static from(value: Uint8Array & { readonly length: 5 }) {
    return new Bytes5(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes5`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes5.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes5.bytes).unwrap()

    cursor.offset += 64 - Bytes5.nibbles

    return new Bytes5(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes5.bytes)
    cursor.offset += 32 - Bytes5.bytes
    return new Bytes5(bytes)
  }

}
export class Bytes6 {
  readonly #class = Bytes6
  readonly name = this.#class.name

  static readonly bytes = 6 as const
  static readonly nibbles = 12 as const
  static readonly bits = 48 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 6 }
  ) { }

  static new(value: Uint8Array & { readonly length: 6 }) {
    return new Bytes6(value)
  }

  static from(value: Uint8Array & { readonly length: 6 }) {
    return new Bytes6(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes6`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes6.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes6.bytes).unwrap()

    cursor.offset += 64 - Bytes6.nibbles

    return new Bytes6(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes6.bytes)
    cursor.offset += 32 - Bytes6.bytes
    return new Bytes6(bytes)
  }

}
export class Bytes7 {
  readonly #class = Bytes7
  readonly name = this.#class.name

  static readonly bytes = 7 as const
  static readonly nibbles = 14 as const
  static readonly bits = 56 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 7 }
  ) { }

  static new(value: Uint8Array & { readonly length: 7 }) {
    return new Bytes7(value)
  }

  static from(value: Uint8Array & { readonly length: 7 }) {
    return new Bytes7(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes7`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes7.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes7.bytes).unwrap()

    cursor.offset += 64 - Bytes7.nibbles

    return new Bytes7(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes7.bytes)
    cursor.offset += 32 - Bytes7.bytes
    return new Bytes7(bytes)
  }

}
export class Bytes8 {
  readonly #class = Bytes8
  readonly name = this.#class.name

  static readonly bytes = 8 as const
  static readonly nibbles = 16 as const
  static readonly bits = 64 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 8 }
  ) { }

  static new(value: Uint8Array & { readonly length: 8 }) {
    return new Bytes8(value)
  }

  static from(value: Uint8Array & { readonly length: 8 }) {
    return new Bytes8(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes8`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes8.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes8.bytes).unwrap()

    cursor.offset += 64 - Bytes8.nibbles

    return new Bytes8(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes8.bytes)
    cursor.offset += 32 - Bytes8.bytes
    return new Bytes8(bytes)
  }

}
export class Bytes9 {
  readonly #class = Bytes9
  readonly name = this.#class.name

  static readonly bytes = 9 as const
  static readonly nibbles = 18 as const
  static readonly bits = 72 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 9 }
  ) { }

  static new(value: Uint8Array & { readonly length: 9 }) {
    return new Bytes9(value)
  }

  static from(value: Uint8Array & { readonly length: 9 }) {
    return new Bytes9(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes9`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes9.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes9.bytes).unwrap()

    cursor.offset += 64 - Bytes9.nibbles

    return new Bytes9(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes9.bytes)
    cursor.offset += 32 - Bytes9.bytes
    return new Bytes9(bytes)
  }

}
export class Bytes10 {
  readonly #class = Bytes10
  readonly name = this.#class.name

  static readonly bytes = 10 as const
  static readonly nibbles = 20 as const
  static readonly bits = 80 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 10 }
  ) { }

  static new(value: Uint8Array & { readonly length: 10 }) {
    return new Bytes10(value)
  }

  static from(value: Uint8Array & { readonly length: 10 }) {
    return new Bytes10(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes10`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes10.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes10.bytes).unwrap()

    cursor.offset += 64 - Bytes10.nibbles

    return new Bytes10(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes10.bytes)
    cursor.offset += 32 - Bytes10.bytes
    return new Bytes10(bytes)
  }

}
export class Bytes11 {
  readonly #class = Bytes11
  readonly name = this.#class.name

  static readonly bytes = 11 as const
  static readonly nibbles = 22 as const
  static readonly bits = 88 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 11 }
  ) { }

  static new(value: Uint8Array & { readonly length: 11 }) {
    return new Bytes11(value)
  }

  static from(value: Uint8Array & { readonly length: 11 }) {
    return new Bytes11(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes11`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes11.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes11.bytes).unwrap()

    cursor.offset += 64 - Bytes11.nibbles

    return new Bytes11(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes11.bytes)
    cursor.offset += 32 - Bytes11.bytes
    return new Bytes11(bytes)
  }

}
export class Bytes12 {
  readonly #class = Bytes12
  readonly name = this.#class.name

  static readonly bytes = 12 as const
  static readonly nibbles = 24 as const
  static readonly bits = 96 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 12 }
  ) { }

  static new(value: Uint8Array & { readonly length: 12 }) {
    return new Bytes12(value)
  }

  static from(value: Uint8Array & { readonly length: 12 }) {
    return new Bytes12(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes12`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes12.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes12.bytes).unwrap()

    cursor.offset += 64 - Bytes12.nibbles

    return new Bytes12(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes12.bytes)
    cursor.offset += 32 - Bytes12.bytes
    return new Bytes12(bytes)
  }

}
export class Bytes13 {
  readonly #class = Bytes13
  readonly name = this.#class.name

  static readonly bytes = 13 as const
  static readonly nibbles = 26 as const
  static readonly bits = 104 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 13 }
  ) { }

  static new(value: Uint8Array & { readonly length: 13 }) {
    return new Bytes13(value)
  }

  static from(value: Uint8Array & { readonly length: 13 }) {
    return new Bytes13(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes13`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes13.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes13.bytes).unwrap()

    cursor.offset += 64 - Bytes13.nibbles

    return new Bytes13(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes13.bytes)
    cursor.offset += 32 - Bytes13.bytes
    return new Bytes13(bytes)
  }

}
export class Bytes14 {
  readonly #class = Bytes14
  readonly name = this.#class.name

  static readonly bytes = 14 as const
  static readonly nibbles = 28 as const
  static readonly bits = 112 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 14 }
  ) { }

  static new(value: Uint8Array & { readonly length: 14 }) {
    return new Bytes14(value)
  }

  static from(value: Uint8Array & { readonly length: 14 }) {
    return new Bytes14(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes14`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes14.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes14.bytes).unwrap()

    cursor.offset += 64 - Bytes14.nibbles

    return new Bytes14(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes14.bytes)
    cursor.offset += 32 - Bytes14.bytes
    return new Bytes14(bytes)
  }

}
export class Bytes15 {
  readonly #class = Bytes15
  readonly name = this.#class.name

  static readonly bytes = 15 as const
  static readonly nibbles = 30 as const
  static readonly bits = 120 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 15 }
  ) { }

  static new(value: Uint8Array & { readonly length: 15 }) {
    return new Bytes15(value)
  }

  static from(value: Uint8Array & { readonly length: 15 }) {
    return new Bytes15(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes15`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes15.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes15.bytes).unwrap()

    cursor.offset += 64 - Bytes15.nibbles

    return new Bytes15(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes15.bytes)
    cursor.offset += 32 - Bytes15.bytes
    return new Bytes15(bytes)
  }

}
export class Bytes16 {
  readonly #class = Bytes16
  readonly name = this.#class.name

  static readonly bytes = 16 as const
  static readonly nibbles = 32 as const
  static readonly bits = 128 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 16 }
  ) { }

  static new(value: Uint8Array & { readonly length: 16 }) {
    return new Bytes16(value)
  }

  static from(value: Uint8Array & { readonly length: 16 }) {
    return new Bytes16(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes16`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes16.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes16.bytes).unwrap()

    cursor.offset += 64 - Bytes16.nibbles

    return new Bytes16(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes16.bytes)
    cursor.offset += 32 - Bytes16.bytes
    return new Bytes16(bytes)
  }

}
export class Bytes17 {
  readonly #class = Bytes17
  readonly name = this.#class.name

  static readonly bytes = 17 as const
  static readonly nibbles = 34 as const
  static readonly bits = 136 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 17 }
  ) { }

  static new(value: Uint8Array & { readonly length: 17 }) {
    return new Bytes17(value)
  }

  static from(value: Uint8Array & { readonly length: 17 }) {
    return new Bytes17(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes17`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes17.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes17.bytes).unwrap()

    cursor.offset += 64 - Bytes17.nibbles

    return new Bytes17(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes17.bytes)
    cursor.offset += 32 - Bytes17.bytes
    return new Bytes17(bytes)
  }

}
export class Bytes18 {
  readonly #class = Bytes18
  readonly name = this.#class.name

  static readonly bytes = 18 as const
  static readonly nibbles = 36 as const
  static readonly bits = 144 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 18 }
  ) { }

  static new(value: Uint8Array & { readonly length: 18 }) {
    return new Bytes18(value)
  }

  static from(value: Uint8Array & { readonly length: 18 }) {
    return new Bytes18(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes18`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes18.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes18.bytes).unwrap()

    cursor.offset += 64 - Bytes18.nibbles

    return new Bytes18(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes18.bytes)
    cursor.offset += 32 - Bytes18.bytes
    return new Bytes18(bytes)
  }

}
export class Bytes19 {
  readonly #class = Bytes19
  readonly name = this.#class.name

  static readonly bytes = 19 as const
  static readonly nibbles = 38 as const
  static readonly bits = 152 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 19 }
  ) { }

  static new(value: Uint8Array & { readonly length: 19 }) {
    return new Bytes19(value)
  }

  static from(value: Uint8Array & { readonly length: 19 }) {
    return new Bytes19(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes19`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes19.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes19.bytes).unwrap()

    cursor.offset += 64 - Bytes19.nibbles

    return new Bytes19(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes19.bytes)
    cursor.offset += 32 - Bytes19.bytes
    return new Bytes19(bytes)
  }

}
export class Bytes20 {
  readonly #class = Bytes20
  readonly name = this.#class.name

  static readonly bytes = 20 as const
  static readonly nibbles = 40 as const
  static readonly bits = 160 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 20 }
  ) { }

  static new(value: Uint8Array & { readonly length: 20 }) {
    return new Bytes20(value)
  }

  static from(value: Uint8Array & { readonly length: 20 }) {
    return new Bytes20(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes20`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes20.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes20.bytes).unwrap()

    cursor.offset += 64 - Bytes20.nibbles

    return new Bytes20(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes20.bytes)
    cursor.offset += 32 - Bytes20.bytes
    return new Bytes20(bytes)
  }

}
export class Bytes21 {
  readonly #class = Bytes21
  readonly name = this.#class.name

  static readonly bytes = 21 as const
  static readonly nibbles = 42 as const
  static readonly bits = 168 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 21 }
  ) { }

  static new(value: Uint8Array & { readonly length: 21 }) {
    return new Bytes21(value)
  }

  static from(value: Uint8Array & { readonly length: 21 }) {
    return new Bytes21(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes21`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes21.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes21.bytes).unwrap()

    cursor.offset += 64 - Bytes21.nibbles

    return new Bytes21(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes21.bytes)
    cursor.offset += 32 - Bytes21.bytes
    return new Bytes21(bytes)
  }

}
export class Bytes22 {
  readonly #class = Bytes22
  readonly name = this.#class.name

  static readonly bytes = 22 as const
  static readonly nibbles = 44 as const
  static readonly bits = 176 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 22 }
  ) { }

  static new(value: Uint8Array & { readonly length: 22 }) {
    return new Bytes22(value)
  }

  static from(value: Uint8Array & { readonly length: 22 }) {
    return new Bytes22(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes22`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes22.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes22.bytes).unwrap()

    cursor.offset += 64 - Bytes22.nibbles

    return new Bytes22(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes22.bytes)
    cursor.offset += 32 - Bytes22.bytes
    return new Bytes22(bytes)
  }

}
export class Bytes23 {
  readonly #class = Bytes23
  readonly name = this.#class.name

  static readonly bytes = 23 as const
  static readonly nibbles = 46 as const
  static readonly bits = 184 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 23 }
  ) { }

  static new(value: Uint8Array & { readonly length: 23 }) {
    return new Bytes23(value)
  }

  static from(value: Uint8Array & { readonly length: 23 }) {
    return new Bytes23(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes23`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes23.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes23.bytes).unwrap()

    cursor.offset += 64 - Bytes23.nibbles

    return new Bytes23(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes23.bytes)
    cursor.offset += 32 - Bytes23.bytes
    return new Bytes23(bytes)
  }

}
export class Bytes24 {
  readonly #class = Bytes24
  readonly name = this.#class.name

  static readonly bytes = 24 as const
  static readonly nibbles = 48 as const
  static readonly bits = 192 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 24 }
  ) { }

  static new(value: Uint8Array & { readonly length: 24 }) {
    return new Bytes24(value)
  }

  static from(value: Uint8Array & { readonly length: 24 }) {
    return new Bytes24(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes24`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes24.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes24.bytes).unwrap()

    cursor.offset += 64 - Bytes24.nibbles

    return new Bytes24(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes24.bytes)
    cursor.offset += 32 - Bytes24.bytes
    return new Bytes24(bytes)
  }

}
export class Bytes25 {
  readonly #class = Bytes25
  readonly name = this.#class.name

  static readonly bytes = 25 as const
  static readonly nibbles = 50 as const
  static readonly bits = 200 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 25 }
  ) { }

  static new(value: Uint8Array & { readonly length: 25 }) {
    return new Bytes25(value)
  }

  static from(value: Uint8Array & { readonly length: 25 }) {
    return new Bytes25(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes25`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes25.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes25.bytes).unwrap()

    cursor.offset += 64 - Bytes25.nibbles

    return new Bytes25(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes25.bytes)
    cursor.offset += 32 - Bytes25.bytes
    return new Bytes25(bytes)
  }

}
export class Bytes26 {
  readonly #class = Bytes26
  readonly name = this.#class.name

  static readonly bytes = 26 as const
  static readonly nibbles = 52 as const
  static readonly bits = 208 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 26 }
  ) { }

  static new(value: Uint8Array & { readonly length: 26 }) {
    return new Bytes26(value)
  }

  static from(value: Uint8Array & { readonly length: 26 }) {
    return new Bytes26(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes26`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes26.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes26.bytes).unwrap()

    cursor.offset += 64 - Bytes26.nibbles

    return new Bytes26(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes26.bytes)
    cursor.offset += 32 - Bytes26.bytes
    return new Bytes26(bytes)
  }

}
export class Bytes27 {
  readonly #class = Bytes27
  readonly name = this.#class.name

  static readonly bytes = 27 as const
  static readonly nibbles = 54 as const
  static readonly bits = 216 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 27 }
  ) { }

  static new(value: Uint8Array & { readonly length: 27 }) {
    return new Bytes27(value)
  }

  static from(value: Uint8Array & { readonly length: 27 }) {
    return new Bytes27(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes27`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes27.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes27.bytes).unwrap()

    cursor.offset += 64 - Bytes27.nibbles

    return new Bytes27(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes27.bytes)
    cursor.offset += 32 - Bytes27.bytes
    return new Bytes27(bytes)
  }

}
export class Bytes28 {
  readonly #class = Bytes28
  readonly name = this.#class.name

  static readonly bytes = 28 as const
  static readonly nibbles = 56 as const
  static readonly bits = 224 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 28 }
  ) { }

  static new(value: Uint8Array & { readonly length: 28 }) {
    return new Bytes28(value)
  }

  static from(value: Uint8Array & { readonly length: 28 }) {
    return new Bytes28(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes28`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes28.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes28.bytes).unwrap()

    cursor.offset += 64 - Bytes28.nibbles

    return new Bytes28(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes28.bytes)
    cursor.offset += 32 - Bytes28.bytes
    return new Bytes28(bytes)
  }

}
export class Bytes29 {
  readonly #class = Bytes29
  readonly name = this.#class.name

  static readonly bytes = 29 as const
  static readonly nibbles = 58 as const
  static readonly bits = 232 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 29 }
  ) { }

  static new(value: Uint8Array & { readonly length: 29 }) {
    return new Bytes29(value)
  }

  static from(value: Uint8Array & { readonly length: 29 }) {
    return new Bytes29(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes29`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes29.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes29.bytes).unwrap()

    cursor.offset += 64 - Bytes29.nibbles

    return new Bytes29(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes29.bytes)
    cursor.offset += 32 - Bytes29.bytes
    return new Bytes29(bytes)
  }

}
export class Bytes30 {
  readonly #class = Bytes30
  readonly name = this.#class.name

  static readonly bytes = 30 as const
  static readonly nibbles = 60 as const
  static readonly bits = 240 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 30 }
  ) { }

  static new(value: Uint8Array & { readonly length: 30 }) {
    return new Bytes30(value)
  }

  static from(value: Uint8Array & { readonly length: 30 }) {
    return new Bytes30(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes30`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes30.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes30.bytes).unwrap()

    cursor.offset += 64 - Bytes30.nibbles

    return new Bytes30(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes30.bytes)
    cursor.offset += 32 - Bytes30.bytes
    return new Bytes30(bytes)
  }

}
export class Bytes31 {
  readonly #class = Bytes31
  readonly name = this.#class.name

  static readonly bytes = 31 as const
  static readonly nibbles = 62 as const
  static readonly bits = 248 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 31 }
  ) { }

  static new(value: Uint8Array & { readonly length: 31 }) {
    return new Bytes31(value)
  }

  static from(value: Uint8Array & { readonly length: 31 }) {
    return new Bytes31(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes31`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes31.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes31.bytes).unwrap()

    cursor.offset += 64 - Bytes31.nibbles

    return new Bytes31(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes31.bytes)
    cursor.offset += 32 - Bytes31.bytes
    return new Bytes31(bytes)
  }

}
export class Bytes32 {
  readonly #class = Bytes32
  readonly name = this.#class.name

  static readonly bytes = 32 as const
  static readonly nibbles = 64 as const
  static readonly bits = 256 as const

  readonly size = 32 as const

  private constructor(
    readonly value: Uint8Array & { readonly length: 32 }
  ) { }

  static new(value: Uint8Array & { readonly length: 32 }) {
    return new Bytes32(value)
  }

  static from(value: Uint8Array & { readonly length: 32 }) {
    return new Bytes32(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Bytes32`
  }

  get class() {
    return this.#class
  }

  get bits() {
    return this.#class.bits
  }

  get bytes() {
    return this.#class.bytes
  }

  encodeOrThrow() {
    const hex = Base16.get().tryEncode(this.value).unwrap()
    return hex.padStart(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().tryEncode(this.value).unwrap()
  }

  static decodeOrThrow(cursor: TextCursor) {
    const text = cursor.readOrThrow(Bytes32.nibbles)

    const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
    const sized = Bytes.tryCast(unsized, Bytes32.bytes).unwrap()

    cursor.offset += 64 - Bytes32.nibbles

    return new Bytes32(sized)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - this.value.length)
  }

  static readOrThrow(cursor: Cursor) {
    const bytes = cursor.readOrThrow(Bytes32.bytes)
    cursor.offset += 32 - Bytes32.bytes
    return new Bytes32(bytes)
  }

}

export type BytesByName = {
  bytes1: typeof Bytes1,
  bytes2: typeof Bytes2,
  bytes3: typeof Bytes3,
  bytes4: typeof Bytes4,
  bytes5: typeof Bytes5,
  bytes6: typeof Bytes6,
  bytes7: typeof Bytes7,
  bytes8: typeof Bytes8,
  bytes9: typeof Bytes9,
  bytes10: typeof Bytes10,
  bytes11: typeof Bytes11,
  bytes12: typeof Bytes12,
  bytes13: typeof Bytes13,
  bytes14: typeof Bytes14,
  bytes15: typeof Bytes15,
  bytes16: typeof Bytes16,
  bytes17: typeof Bytes17,
  bytes18: typeof Bytes18,
  bytes19: typeof Bytes19,
  bytes20: typeof Bytes20,
  bytes21: typeof Bytes21,
  bytes22: typeof Bytes22,
  bytes23: typeof Bytes23,
  bytes24: typeof Bytes24,
  bytes25: typeof Bytes25,
  bytes26: typeof Bytes26,
  bytes27: typeof Bytes27,
  bytes28: typeof Bytes28,
  bytes29: typeof Bytes29,
  bytes30: typeof Bytes30,
  bytes31: typeof Bytes31,
  bytes32: typeof Bytes32,
}

export const bytesByName: BytesByName = {
  bytes1: Bytes1,
  bytes2: Bytes2,
  bytes3: Bytes3,
  bytes4: Bytes4,
  bytes5: Bytes5,
  bytes6: Bytes6,
  bytes7: Bytes7,
  bytes8: Bytes8,
  bytes9: Bytes9,
  bytes10: Bytes10,
  bytes11: Bytes11,
  bytes12: Bytes12,
  bytes13: Bytes13,
  bytes14: Bytes14,
  bytes15: Bytes15,
  bytes16: Bytes16,
  bytes17: Bytes17,
  bytes18: Bytes18,
  bytes19: Bytes19,
  bytes20: Bytes20,
  bytes21: Bytes21,
  bytes22: Bytes22,
  bytes23: Bytes23,
  bytes24: Bytes24,
  bytes25: Bytes25,
  bytes26: Bytes26,
  bytes27: Bytes27,
  bytes28: Bytes28,
  bytes29: Bytes29,
  bytes30: Bytes30,
  bytes31: Bytes31,
  bytes32: Bytes32,
} as const