import { Base16 } from "@hazae41/base16";
import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { BigInts } from "libs/bigint/bigint.js";
import { TextCursor } from "libs/cursor/cursor.js";

export class Uint8 {
  readonly #class = Uint8
  readonly name = this.#class.name

  static readonly bytes = 1
  static readonly bits = 8

  readonly size = 32 as const

  private constructor(
    readonly value: number
  ) { }

  static new(value: number) {
    return new Uint8(value)
  }

  static from(value: number) {
    return new Uint8(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint8`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - 8

    const value = parseInt(cursor.readOrThrow(8), 16)

    return new Uint8(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 32 - 4)
      cursor.tryWriteUint32(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint8, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - 4

      const value = cursor.tryReadUint32().throw(t)

      return new Ok(new Uint8(value))
    })
  }
}
export class Uint16 {
  readonly #class = Uint16
  readonly name = this.#class.name

  static readonly bytes = 2
  static readonly bits = 16

  readonly size = 32 as const

  private constructor(
    readonly value: number
  ) { }

  static new(value: number) {
    return new Uint16(value)
  }

  static from(value: number) {
    return new Uint16(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint16`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - 8

    const value = parseInt(cursor.readOrThrow(8), 16)

    return new Uint16(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 32 - 4)
      cursor.tryWriteUint32(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint16, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - 4

      const value = cursor.tryReadUint32().throw(t)

      return new Ok(new Uint16(value))
    })
  }
}
export class Uint24 {
  readonly #class = Uint24
  readonly name = this.#class.name

  static readonly bytes = 3
  static readonly bits = 24

  readonly size = 32 as const

  private constructor(
    readonly value: number
  ) { }

  static new(value: number) {
    return new Uint24(value)
  }

  static from(value: number) {
    return new Uint24(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint24`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - 8

    const value = parseInt(cursor.readOrThrow(8), 16)

    return new Uint24(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 32 - 4)
      cursor.tryWriteUint32(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint24, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - 4

      const value = cursor.tryReadUint32().throw(t)

      return new Ok(new Uint24(value))
    })
  }
}
export class Uint32 {
  readonly #class = Uint32
  readonly name = this.#class.name

  static readonly bytes = 4
  static readonly bits = 32

  readonly size = 32 as const

  private constructor(
    readonly value: number
  ) { }

  static new(value: number) {
    return new Uint32(value)
  }

  static from(value: number) {
    return new Uint32(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint32`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - 8

    const value = parseInt(cursor.readOrThrow(8), 16)

    return new Uint32(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError> {
    return Result.unthrowSync(t => {
      cursor.fill(0, 32 - 4)
      cursor.tryWriteUint32(this.value).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint32, BinaryReadError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - 4

      const value = cursor.tryReadUint32().throw(t)

      return new Ok(new Uint32(value))
    })
  }
}
export class Uint40 {
  readonly #class = Uint40
  readonly name = this.#class.name

  static readonly bytes = 5
  static readonly bits = 40
  static readonly nibbles = 10

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint40(value)
  }

  static from(value: bigint) {
    return new Uint40(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint40`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint40.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint40.nibbles))

    return new Uint40(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint40, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint40.bytes

      const bytes = cursor.tryRead(Uint40.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint40(value))
    })
  }
}
export class Uint48 {
  readonly #class = Uint48
  readonly name = this.#class.name

  static readonly bytes = 6
  static readonly bits = 48
  static readonly nibbles = 12

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint48(value)
  }

  static from(value: bigint) {
    return new Uint48(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint48`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint48.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint48.nibbles))

    return new Uint48(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint48, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint48.bytes

      const bytes = cursor.tryRead(Uint48.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint48(value))
    })
  }
}
export class Uint56 {
  readonly #class = Uint56
  readonly name = this.#class.name

  static readonly bytes = 7
  static readonly bits = 56
  static readonly nibbles = 14

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint56(value)
  }

  static from(value: bigint) {
    return new Uint56(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint56`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint56.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint56.nibbles))

    return new Uint56(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint56, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint56.bytes

      const bytes = cursor.tryRead(Uint56.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint56(value))
    })
  }
}
export class Uint64 {
  readonly #class = Uint64
  readonly name = this.#class.name

  static readonly bytes = 8
  static readonly bits = 64
  static readonly nibbles = 16

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint64(value)
  }

  static from(value: bigint) {
    return new Uint64(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint64`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint64.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint64.nibbles))

    return new Uint64(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint64, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint64.bytes

      const bytes = cursor.tryRead(Uint64.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint64(value))
    })
  }
}
export class Uint72 {
  readonly #class = Uint72
  readonly name = this.#class.name

  static readonly bytes = 9
  static readonly bits = 72
  static readonly nibbles = 18

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint72(value)
  }

  static from(value: bigint) {
    return new Uint72(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint72`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint72.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint72.nibbles))

    return new Uint72(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint72, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint72.bytes

      const bytes = cursor.tryRead(Uint72.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint72(value))
    })
  }
}
export class Uint80 {
  readonly #class = Uint80
  readonly name = this.#class.name

  static readonly bytes = 10
  static readonly bits = 80
  static readonly nibbles = 20

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint80(value)
  }

  static from(value: bigint) {
    return new Uint80(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint80`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint80.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint80.nibbles))

    return new Uint80(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint80, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint80.bytes

      const bytes = cursor.tryRead(Uint80.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint80(value))
    })
  }
}
export class Uint88 {
  readonly #class = Uint88
  readonly name = this.#class.name

  static readonly bytes = 11
  static readonly bits = 88
  static readonly nibbles = 22

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint88(value)
  }

  static from(value: bigint) {
    return new Uint88(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint88`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint88.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint88.nibbles))

    return new Uint88(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint88, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint88.bytes

      const bytes = cursor.tryRead(Uint88.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint88(value))
    })
  }
}
export class Uint96 {
  readonly #class = Uint96
  readonly name = this.#class.name

  static readonly bytes = 12
  static readonly bits = 96
  static readonly nibbles = 24

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint96(value)
  }

  static from(value: bigint) {
    return new Uint96(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint96`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint96.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint96.nibbles))

    return new Uint96(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint96, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint96.bytes

      const bytes = cursor.tryRead(Uint96.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint96(value))
    })
  }
}
export class Uint104 {
  readonly #class = Uint104
  readonly name = this.#class.name

  static readonly bytes = 13
  static readonly bits = 104
  static readonly nibbles = 26

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint104(value)
  }

  static from(value: bigint) {
    return new Uint104(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint104`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint104.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint104.nibbles))

    return new Uint104(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint104, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint104.bytes

      const bytes = cursor.tryRead(Uint104.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint104(value))
    })
  }
}
export class Uint112 {
  readonly #class = Uint112
  readonly name = this.#class.name

  static readonly bytes = 14
  static readonly bits = 112
  static readonly nibbles = 28

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint112(value)
  }

  static from(value: bigint) {
    return new Uint112(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint112`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint112.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint112.nibbles))

    return new Uint112(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint112, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint112.bytes

      const bytes = cursor.tryRead(Uint112.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint112(value))
    })
  }
}
export class Uint120 {
  readonly #class = Uint120
  readonly name = this.#class.name

  static readonly bytes = 15
  static readonly bits = 120
  static readonly nibbles = 30

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint120(value)
  }

  static from(value: bigint) {
    return new Uint120(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint120`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint120.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint120.nibbles))

    return new Uint120(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint120, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint120.bytes

      const bytes = cursor.tryRead(Uint120.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint120(value))
    })
  }
}
export class Uint128 {
  readonly #class = Uint128
  readonly name = this.#class.name

  static readonly bytes = 16
  static readonly bits = 128
  static readonly nibbles = 32

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint128(value)
  }

  static from(value: bigint) {
    return new Uint128(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint128`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint128.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint128.nibbles))

    return new Uint128(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint128, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint128.bytes

      const bytes = cursor.tryRead(Uint128.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint128(value))
    })
  }
}
export class Uint136 {
  readonly #class = Uint136
  readonly name = this.#class.name

  static readonly bytes = 17
  static readonly bits = 136
  static readonly nibbles = 34

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint136(value)
  }

  static from(value: bigint) {
    return new Uint136(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint136`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint136.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint136.nibbles))

    return new Uint136(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint136, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint136.bytes

      const bytes = cursor.tryRead(Uint136.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint136(value))
    })
  }
}
export class Uint144 {
  readonly #class = Uint144
  readonly name = this.#class.name

  static readonly bytes = 18
  static readonly bits = 144
  static readonly nibbles = 36

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint144(value)
  }

  static from(value: bigint) {
    return new Uint144(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint144`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint144.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint144.nibbles))

    return new Uint144(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint144, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint144.bytes

      const bytes = cursor.tryRead(Uint144.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint144(value))
    })
  }
}
export class Uint152 {
  readonly #class = Uint152
  readonly name = this.#class.name

  static readonly bytes = 19
  static readonly bits = 152
  static readonly nibbles = 38

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint152(value)
  }

  static from(value: bigint) {
    return new Uint152(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint152`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint152.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint152.nibbles))

    return new Uint152(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint152, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint152.bytes

      const bytes = cursor.tryRead(Uint152.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint152(value))
    })
  }
}
export class Uint160 {
  readonly #class = Uint160
  readonly name = this.#class.name

  static readonly bytes = 20
  static readonly bits = 160
  static readonly nibbles = 40

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint160(value)
  }

  static from(value: bigint) {
    return new Uint160(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint160`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint160.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint160.nibbles))

    return new Uint160(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint160, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint160.bytes

      const bytes = cursor.tryRead(Uint160.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint160(value))
    })
  }
}
export class Uint168 {
  readonly #class = Uint168
  readonly name = this.#class.name

  static readonly bytes = 21
  static readonly bits = 168
  static readonly nibbles = 42

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint168(value)
  }

  static from(value: bigint) {
    return new Uint168(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint168`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint168.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint168.nibbles))

    return new Uint168(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint168, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint168.bytes

      const bytes = cursor.tryRead(Uint168.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint168(value))
    })
  }
}
export class Uint176 {
  readonly #class = Uint176
  readonly name = this.#class.name

  static readonly bytes = 22
  static readonly bits = 176
  static readonly nibbles = 44

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint176(value)
  }

  static from(value: bigint) {
    return new Uint176(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint176`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint176.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint176.nibbles))

    return new Uint176(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint176, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint176.bytes

      const bytes = cursor.tryRead(Uint176.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint176(value))
    })
  }
}
export class Uint184 {
  readonly #class = Uint184
  readonly name = this.#class.name

  static readonly bytes = 23
  static readonly bits = 184
  static readonly nibbles = 46

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint184(value)
  }

  static from(value: bigint) {
    return new Uint184(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint184`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint184.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint184.nibbles))

    return new Uint184(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint184, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint184.bytes

      const bytes = cursor.tryRead(Uint184.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint184(value))
    })
  }
}
export class Uint192 {
  readonly #class = Uint192
  readonly name = this.#class.name

  static readonly bytes = 24
  static readonly bits = 192
  static readonly nibbles = 48

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint192(value)
  }

  static from(value: bigint) {
    return new Uint192(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint192`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint192.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint192.nibbles))

    return new Uint192(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint192, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint192.bytes

      const bytes = cursor.tryRead(Uint192.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint192(value))
    })
  }
}
export class Uint200 {
  readonly #class = Uint200
  readonly name = this.#class.name

  static readonly bytes = 25
  static readonly bits = 200
  static readonly nibbles = 50

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint200(value)
  }

  static from(value: bigint) {
    return new Uint200(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint200`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint200.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint200.nibbles))

    return new Uint200(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint200, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint200.bytes

      const bytes = cursor.tryRead(Uint200.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint200(value))
    })
  }
}
export class Uint208 {
  readonly #class = Uint208
  readonly name = this.#class.name

  static readonly bytes = 26
  static readonly bits = 208
  static readonly nibbles = 52

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint208(value)
  }

  static from(value: bigint) {
    return new Uint208(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint208`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint208.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint208.nibbles))

    return new Uint208(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint208, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint208.bytes

      const bytes = cursor.tryRead(Uint208.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint208(value))
    })
  }
}
export class Uint216 {
  readonly #class = Uint216
  readonly name = this.#class.name

  static readonly bytes = 27
  static readonly bits = 216
  static readonly nibbles = 54

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint216(value)
  }

  static from(value: bigint) {
    return new Uint216(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint216`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint216.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint216.nibbles))

    return new Uint216(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint216, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint216.bytes

      const bytes = cursor.tryRead(Uint216.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint216(value))
    })
  }
}
export class Uint224 {
  readonly #class = Uint224
  readonly name = this.#class.name

  static readonly bytes = 28
  static readonly bits = 224
  static readonly nibbles = 56

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint224(value)
  }

  static from(value: bigint) {
    return new Uint224(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint224`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint224.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint224.nibbles))

    return new Uint224(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint224, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint224.bytes

      const bytes = cursor.tryRead(Uint224.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint224(value))
    })
  }
}
export class Uint232 {
  readonly #class = Uint232
  readonly name = this.#class.name

  static readonly bytes = 29
  static readonly bits = 232
  static readonly nibbles = 58

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint232(value)
  }

  static from(value: bigint) {
    return new Uint232(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint232`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint232.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint232.nibbles))

    return new Uint232(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint232, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint232.bytes

      const bytes = cursor.tryRead(Uint232.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint232(value))
    })
  }
}
export class Uint240 {
  readonly #class = Uint240
  readonly name = this.#class.name

  static readonly bytes = 30
  static readonly bits = 240
  static readonly nibbles = 60

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint240(value)
  }

  static from(value: bigint) {
    return new Uint240(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint240`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint240.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint240.nibbles))

    return new Uint240(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint240, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint240.bytes

      const bytes = cursor.tryRead(Uint240.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint240(value))
    })
  }
}
export class Uint248 {
  readonly #class = Uint248
  readonly name = this.#class.name

  static readonly bytes = 31
  static readonly bits = 248
  static readonly nibbles = 62

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint248(value)
  }

  static from(value: bigint) {
    return new Uint248(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint248`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint248.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint248.nibbles))

    return new Uint248(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint248, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint248.bytes

      const bytes = cursor.tryRead(Uint248.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint248(value))
    })
  }
}
export class Uint256 {
  readonly #class = Uint256
  readonly name = this.#class.name

  static readonly bytes = 32
  static readonly bits = 256
  static readonly nibbles = 64

  readonly size = 32 as const

  private constructor(
    readonly value: bigint
  ) { }

  static new(value: bigint) {
    return new Uint256(value)
  }

  static from(value: bigint) {
    return new Uint256(value)
  }

  into() {
    return this.value
  }

  static codegen() {
    return `Cubane.Abi.Uint256`
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
    return this.value.toString(16).padStart(64, "0")
  }

  encodePackedOrThrow() {
    return this.value.toString(16)
  }

  static decodeOrThrow(cursor: TextCursor) {
    cursor.offset += 64 - Uint256.nibbles

    // p42:ignore-next-statement
    const value = BigInts.decodeRawHexSafe(cursor.readOrThrow(Uint256.nibbles))

    return new Uint256(value)
  }

  trySize(): Result<32, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      using slice = BigInts.tryExport(this.value).throw(t)

      cursor.fill(0, 32 - slice.bytes.length)
      cursor.tryWrite(slice.bytes).throw(t)

      return Ok.void()
    })
  }

  static tryRead(cursor: Cursor): Result<Uint256, BinaryReadError | Base16.AnyError> {
    return Result.unthrowSync(t => {
      cursor.offset += 32 - Uint256.bytes

      const bytes = cursor.tryRead(Uint256.bytes).throw(t)
      const value = BigInts.tryImport(bytes).throw(t)

      return new Ok(new Uint256(value))
    })
  }
}

export type UintByName = {
  uint8: typeof Uint8,
  uint16: typeof Uint16,
  uint24: typeof Uint24,
  uint32: typeof Uint32,
  uint40: typeof Uint40,
  uint48: typeof Uint48,
  uint56: typeof Uint56,
  uint64: typeof Uint64,
  uint72: typeof Uint72,
  uint80: typeof Uint80,
  uint88: typeof Uint88,
  uint96: typeof Uint96,
  uint104: typeof Uint104,
  uint112: typeof Uint112,
  uint120: typeof Uint120,
  uint128: typeof Uint128,
  uint136: typeof Uint136,
  uint144: typeof Uint144,
  uint152: typeof Uint152,
  uint160: typeof Uint160,
  uint168: typeof Uint168,
  uint176: typeof Uint176,
  uint184: typeof Uint184,
  uint192: typeof Uint192,
  uint200: typeof Uint200,
  uint208: typeof Uint208,
  uint216: typeof Uint216,
  uint224: typeof Uint224,
  uint232: typeof Uint232,
  uint240: typeof Uint240,
  uint248: typeof Uint248,
  uint256: typeof Uint256,
}

export const uintByName: UintByName = {
  uint8: Uint8,
  uint16: Uint16,
  uint24: Uint24,
  uint32: Uint32,
  uint40: Uint40,
  uint48: Uint48,
  uint56: Uint56,
  uint64: Uint64,
  uint72: Uint72,
  uint80: Uint80,
  uint88: Uint88,
  uint96: Uint96,
  uint104: Uint104,
  uint112: Uint112,
  uint120: Uint120,
  uint128: Uint128,
  uint136: Uint136,
  uint144: Uint144,
  uint152: Uint152,
  uint160: Uint160,
  uint168: Uint168,
  uint176: Uint176,
  uint184: Uint184,
  uint192: Uint192,
  uint200: Uint200,
  uint208: Uint208,
  uint216: Uint216,
  uint224: Uint224,
  uint232: Uint232,
  uint240: Uint240,
  uint248: Uint248,
  uint256: Uint256,
} as const