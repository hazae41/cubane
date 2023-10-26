import { Base16 } from "@hazae41/base16";
  import { BinaryReadError, BinaryWriteError } from "@hazae41/binary";
  import { Cursor } from "@hazae41/cursor";
  import { Ok, Result } from "@hazae41/result";
  import { BigInts } from "libs/bigint/bigint.js";
  import { TextCursor } from "libs/cursor/cursor.js";
  
  const BN_0 = 0n
  const BN_1 = 1n

export class Int8 {
    readonly #class = Int8
    readonly name = this.#class.name

    static readonly bytes = 1
    static readonly bits = 8
    static readonly bitsn = BigInt(8)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int8(value)
    }

    static from(value: bigint) {
      return new Int8(value)
    }

    static codegen() {
      return `Cubane.Abi.Int8`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int8(-(((~value) & mask) + BN_1))
      return new Int8(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int8, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int8.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int8.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int8(-(((~value) & mask) + BN_1)))
        return new Ok(new Int8(value))
      })
    }
  }
export class Int16 {
    readonly #class = Int16
    readonly name = this.#class.name

    static readonly bytes = 2
    static readonly bits = 16
    static readonly bitsn = BigInt(16)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int16(value)
    }

    static from(value: bigint) {
      return new Int16(value)
    }

    static codegen() {
      return `Cubane.Abi.Int16`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int16(-(((~value) & mask) + BN_1))
      return new Int16(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int16, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int16.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int16.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int16(-(((~value) & mask) + BN_1)))
        return new Ok(new Int16(value))
      })
    }
  }
export class Int24 {
    readonly #class = Int24
    readonly name = this.#class.name

    static readonly bytes = 3
    static readonly bits = 24
    static readonly bitsn = BigInt(24)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int24(value)
    }

    static from(value: bigint) {
      return new Int24(value)
    }

    static codegen() {
      return `Cubane.Abi.Int24`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int24(-(((~value) & mask) + BN_1))
      return new Int24(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int24, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int24.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int24.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int24(-(((~value) & mask) + BN_1)))
        return new Ok(new Int24(value))
      })
    }
  }
export class Int32 {
    readonly #class = Int32
    readonly name = this.#class.name

    static readonly bytes = 4
    static readonly bits = 32
    static readonly bitsn = BigInt(32)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int32(value)
    }

    static from(value: bigint) {
      return new Int32(value)
    }

    static codegen() {
      return `Cubane.Abi.Int32`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int32(-(((~value) & mask) + BN_1))
      return new Int32(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int32, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int32.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int32.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int32(-(((~value) & mask) + BN_1)))
        return new Ok(new Int32(value))
      })
    }
  }
export class Int40 {
    readonly #class = Int40
    readonly name = this.#class.name

    static readonly bytes = 5
    static readonly bits = 40
    static readonly bitsn = BigInt(40)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int40(value)
    }

    static from(value: bigint) {
      return new Int40(value)
    }

    static codegen() {
      return `Cubane.Abi.Int40`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int40(-(((~value) & mask) + BN_1))
      return new Int40(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int40, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int40.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int40.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int40(-(((~value) & mask) + BN_1)))
        return new Ok(new Int40(value))
      })
    }
  }
export class Int48 {
    readonly #class = Int48
    readonly name = this.#class.name

    static readonly bytes = 6
    static readonly bits = 48
    static readonly bitsn = BigInt(48)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int48(value)
    }

    static from(value: bigint) {
      return new Int48(value)
    }

    static codegen() {
      return `Cubane.Abi.Int48`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int48(-(((~value) & mask) + BN_1))
      return new Int48(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int48, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int48.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int48.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int48(-(((~value) & mask) + BN_1)))
        return new Ok(new Int48(value))
      })
    }
  }
export class Int56 {
    readonly #class = Int56
    readonly name = this.#class.name

    static readonly bytes = 7
    static readonly bits = 56
    static readonly bitsn = BigInt(56)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int56(value)
    }

    static from(value: bigint) {
      return new Int56(value)
    }

    static codegen() {
      return `Cubane.Abi.Int56`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int56(-(((~value) & mask) + BN_1))
      return new Int56(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int56, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int56.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int56.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int56(-(((~value) & mask) + BN_1)))
        return new Ok(new Int56(value))
      })
    }
  }
export class Int64 {
    readonly #class = Int64
    readonly name = this.#class.name

    static readonly bytes = 8
    static readonly bits = 64
    static readonly bitsn = BigInt(64)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int64(value)
    }

    static from(value: bigint) {
      return new Int64(value)
    }

    static codegen() {
      return `Cubane.Abi.Int64`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int64(-(((~value) & mask) + BN_1))
      return new Int64(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int64, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int64.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int64.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int64(-(((~value) & mask) + BN_1)))
        return new Ok(new Int64(value))
      })
    }
  }
export class Int72 {
    readonly #class = Int72
    readonly name = this.#class.name

    static readonly bytes = 9
    static readonly bits = 72
    static readonly bitsn = BigInt(72)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int72(value)
    }

    static from(value: bigint) {
      return new Int72(value)
    }

    static codegen() {
      return `Cubane.Abi.Int72`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int72(-(((~value) & mask) + BN_1))
      return new Int72(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int72, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int72.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int72.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int72(-(((~value) & mask) + BN_1)))
        return new Ok(new Int72(value))
      })
    }
  }
export class Int80 {
    readonly #class = Int80
    readonly name = this.#class.name

    static readonly bytes = 10
    static readonly bits = 80
    static readonly bitsn = BigInt(80)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int80(value)
    }

    static from(value: bigint) {
      return new Int80(value)
    }

    static codegen() {
      return `Cubane.Abi.Int80`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int80(-(((~value) & mask) + BN_1))
      return new Int80(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int80, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int80.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int80.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int80(-(((~value) & mask) + BN_1)))
        return new Ok(new Int80(value))
      })
    }
  }
export class Int88 {
    readonly #class = Int88
    readonly name = this.#class.name

    static readonly bytes = 11
    static readonly bits = 88
    static readonly bitsn = BigInt(88)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int88(value)
    }

    static from(value: bigint) {
      return new Int88(value)
    }

    static codegen() {
      return `Cubane.Abi.Int88`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int88(-(((~value) & mask) + BN_1))
      return new Int88(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int88, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int88.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int88.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int88(-(((~value) & mask) + BN_1)))
        return new Ok(new Int88(value))
      })
    }
  }
export class Int96 {
    readonly #class = Int96
    readonly name = this.#class.name

    static readonly bytes = 12
    static readonly bits = 96
    static readonly bitsn = BigInt(96)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int96(value)
    }

    static from(value: bigint) {
      return new Int96(value)
    }

    static codegen() {
      return `Cubane.Abi.Int96`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int96(-(((~value) & mask) + BN_1))
      return new Int96(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int96, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int96.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int96.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int96(-(((~value) & mask) + BN_1)))
        return new Ok(new Int96(value))
      })
    }
  }
export class Int104 {
    readonly #class = Int104
    readonly name = this.#class.name

    static readonly bytes = 13
    static readonly bits = 104
    static readonly bitsn = BigInt(104)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int104(value)
    }

    static from(value: bigint) {
      return new Int104(value)
    }

    static codegen() {
      return `Cubane.Abi.Int104`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int104(-(((~value) & mask) + BN_1))
      return new Int104(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int104, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int104.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int104.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int104(-(((~value) & mask) + BN_1)))
        return new Ok(new Int104(value))
      })
    }
  }
export class Int112 {
    readonly #class = Int112
    readonly name = this.#class.name

    static readonly bytes = 14
    static readonly bits = 112
    static readonly bitsn = BigInt(112)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int112(value)
    }

    static from(value: bigint) {
      return new Int112(value)
    }

    static codegen() {
      return `Cubane.Abi.Int112`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int112(-(((~value) & mask) + BN_1))
      return new Int112(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int112, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int112.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int112.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int112(-(((~value) & mask) + BN_1)))
        return new Ok(new Int112(value))
      })
    }
  }
export class Int120 {
    readonly #class = Int120
    readonly name = this.#class.name

    static readonly bytes = 15
    static readonly bits = 120
    static readonly bitsn = BigInt(120)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int120(value)
    }

    static from(value: bigint) {
      return new Int120(value)
    }

    static codegen() {
      return `Cubane.Abi.Int120`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int120(-(((~value) & mask) + BN_1))
      return new Int120(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int120, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int120.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int120.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int120(-(((~value) & mask) + BN_1)))
        return new Ok(new Int120(value))
      })
    }
  }
export class Int128 {
    readonly #class = Int128
    readonly name = this.#class.name

    static readonly bytes = 16
    static readonly bits = 128
    static readonly bitsn = BigInt(128)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int128(value)
    }

    static from(value: bigint) {
      return new Int128(value)
    }

    static codegen() {
      return `Cubane.Abi.Int128`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int128(-(((~value) & mask) + BN_1))
      return new Int128(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int128, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int128.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int128.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int128(-(((~value) & mask) + BN_1)))
        return new Ok(new Int128(value))
      })
    }
  }
export class Int136 {
    readonly #class = Int136
    readonly name = this.#class.name

    static readonly bytes = 17
    static readonly bits = 136
    static readonly bitsn = BigInt(136)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int136(value)
    }

    static from(value: bigint) {
      return new Int136(value)
    }

    static codegen() {
      return `Cubane.Abi.Int136`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int136(-(((~value) & mask) + BN_1))
      return new Int136(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int136, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int136.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int136.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int136(-(((~value) & mask) + BN_1)))
        return new Ok(new Int136(value))
      })
    }
  }
export class Int144 {
    readonly #class = Int144
    readonly name = this.#class.name

    static readonly bytes = 18
    static readonly bits = 144
    static readonly bitsn = BigInt(144)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int144(value)
    }

    static from(value: bigint) {
      return new Int144(value)
    }

    static codegen() {
      return `Cubane.Abi.Int144`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int144(-(((~value) & mask) + BN_1))
      return new Int144(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int144, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int144.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int144.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int144(-(((~value) & mask) + BN_1)))
        return new Ok(new Int144(value))
      })
    }
  }
export class Int152 {
    readonly #class = Int152
    readonly name = this.#class.name

    static readonly bytes = 19
    static readonly bits = 152
    static readonly bitsn = BigInt(152)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int152(value)
    }

    static from(value: bigint) {
      return new Int152(value)
    }

    static codegen() {
      return `Cubane.Abi.Int152`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int152(-(((~value) & mask) + BN_1))
      return new Int152(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int152, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int152.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int152.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int152(-(((~value) & mask) + BN_1)))
        return new Ok(new Int152(value))
      })
    }
  }
export class Int160 {
    readonly #class = Int160
    readonly name = this.#class.name

    static readonly bytes = 20
    static readonly bits = 160
    static readonly bitsn = BigInt(160)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int160(value)
    }

    static from(value: bigint) {
      return new Int160(value)
    }

    static codegen() {
      return `Cubane.Abi.Int160`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int160(-(((~value) & mask) + BN_1))
      return new Int160(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int160, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int160.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int160.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int160(-(((~value) & mask) + BN_1)))
        return new Ok(new Int160(value))
      })
    }
  }
export class Int168 {
    readonly #class = Int168
    readonly name = this.#class.name

    static readonly bytes = 21
    static readonly bits = 168
    static readonly bitsn = BigInt(168)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int168(value)
    }

    static from(value: bigint) {
      return new Int168(value)
    }

    static codegen() {
      return `Cubane.Abi.Int168`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int168(-(((~value) & mask) + BN_1))
      return new Int168(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int168, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int168.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int168.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int168(-(((~value) & mask) + BN_1)))
        return new Ok(new Int168(value))
      })
    }
  }
export class Int176 {
    readonly #class = Int176
    readonly name = this.#class.name

    static readonly bytes = 22
    static readonly bits = 176
    static readonly bitsn = BigInt(176)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int176(value)
    }

    static from(value: bigint) {
      return new Int176(value)
    }

    static codegen() {
      return `Cubane.Abi.Int176`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int176(-(((~value) & mask) + BN_1))
      return new Int176(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int176, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int176.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int176.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int176(-(((~value) & mask) + BN_1)))
        return new Ok(new Int176(value))
      })
    }
  }
export class Int184 {
    readonly #class = Int184
    readonly name = this.#class.name

    static readonly bytes = 23
    static readonly bits = 184
    static readonly bitsn = BigInt(184)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int184(value)
    }

    static from(value: bigint) {
      return new Int184(value)
    }

    static codegen() {
      return `Cubane.Abi.Int184`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int184(-(((~value) & mask) + BN_1))
      return new Int184(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int184, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int184.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int184.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int184(-(((~value) & mask) + BN_1)))
        return new Ok(new Int184(value))
      })
    }
  }
export class Int192 {
    readonly #class = Int192
    readonly name = this.#class.name

    static readonly bytes = 24
    static readonly bits = 192
    static readonly bitsn = BigInt(192)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int192(value)
    }

    static from(value: bigint) {
      return new Int192(value)
    }

    static codegen() {
      return `Cubane.Abi.Int192`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int192(-(((~value) & mask) + BN_1))
      return new Int192(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int192, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int192.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int192.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int192(-(((~value) & mask) + BN_1)))
        return new Ok(new Int192(value))
      })
    }
  }
export class Int200 {
    readonly #class = Int200
    readonly name = this.#class.name

    static readonly bytes = 25
    static readonly bits = 200
    static readonly bitsn = BigInt(200)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int200(value)
    }

    static from(value: bigint) {
      return new Int200(value)
    }

    static codegen() {
      return `Cubane.Abi.Int200`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int200(-(((~value) & mask) + BN_1))
      return new Int200(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int200, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int200.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int200.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int200(-(((~value) & mask) + BN_1)))
        return new Ok(new Int200(value))
      })
    }
  }
export class Int208 {
    readonly #class = Int208
    readonly name = this.#class.name

    static readonly bytes = 26
    static readonly bits = 208
    static readonly bitsn = BigInt(208)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int208(value)
    }

    static from(value: bigint) {
      return new Int208(value)
    }

    static codegen() {
      return `Cubane.Abi.Int208`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int208(-(((~value) & mask) + BN_1))
      return new Int208(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int208, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int208.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int208.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int208(-(((~value) & mask) + BN_1)))
        return new Ok(new Int208(value))
      })
    }
  }
export class Int216 {
    readonly #class = Int216
    readonly name = this.#class.name

    static readonly bytes = 27
    static readonly bits = 216
    static readonly bitsn = BigInt(216)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int216(value)
    }

    static from(value: bigint) {
      return new Int216(value)
    }

    static codegen() {
      return `Cubane.Abi.Int216`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int216(-(((~value) & mask) + BN_1))
      return new Int216(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int216, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int216.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int216.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int216(-(((~value) & mask) + BN_1)))
        return new Ok(new Int216(value))
      })
    }
  }
export class Int224 {
    readonly #class = Int224
    readonly name = this.#class.name

    static readonly bytes = 28
    static readonly bits = 224
    static readonly bitsn = BigInt(224)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int224(value)
    }

    static from(value: bigint) {
      return new Int224(value)
    }

    static codegen() {
      return `Cubane.Abi.Int224`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int224(-(((~value) & mask) + BN_1))
      return new Int224(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int224, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int224.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int224.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int224(-(((~value) & mask) + BN_1)))
        return new Ok(new Int224(value))
      })
    }
  }
export class Int232 {
    readonly #class = Int232
    readonly name = this.#class.name

    static readonly bytes = 29
    static readonly bits = 232
    static readonly bitsn = BigInt(232)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int232(value)
    }

    static from(value: bigint) {
      return new Int232(value)
    }

    static codegen() {
      return `Cubane.Abi.Int232`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int232(-(((~value) & mask) + BN_1))
      return new Int232(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int232, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int232.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int232.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int232(-(((~value) & mask) + BN_1)))
        return new Ok(new Int232(value))
      })
    }
  }
export class Int240 {
    readonly #class = Int240
    readonly name = this.#class.name

    static readonly bytes = 30
    static readonly bits = 240
    static readonly bitsn = BigInt(240)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int240(value)
    }

    static from(value: bigint) {
      return new Int240(value)
    }

    static codegen() {
      return `Cubane.Abi.Int240`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int240(-(((~value) & mask) + BN_1))
      return new Int240(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int240, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int240.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int240.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int240(-(((~value) & mask) + BN_1)))
        return new Ok(new Int240(value))
      })
    }
  }
export class Int248 {
    readonly #class = Int248
    readonly name = this.#class.name

    static readonly bytes = 31
    static readonly bits = 248
    static readonly bitsn = BigInt(248)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int248(value)
    }

    static from(value: bigint) {
      return new Int248(value)
    }

    static codegen() {
      return `Cubane.Abi.Int248`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int248(-(((~value) & mask) + BN_1))
      return new Int248(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int248, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int248.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int248.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int248(-(((~value) & mask) + BN_1)))
        return new Ok(new Int248(value))
      })
    }
  }
export class Int256 {
    readonly #class = Int256
    readonly name = this.#class.name

    static readonly bytes = 32
    static readonly bits = 256
    static readonly bitsn = BigInt(256)

    readonly size = 32 as const

    private constructor(
      readonly value: bigint
    ) { }

    static new(value: bigint) {
      return new Int256(value)
    }

    static from(value: bigint) {
      return new Int256(value)
    }

    static codegen() {
      return `Cubane.Abi.Int256`
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
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16).padStart(64, "0")
      }

      return this.value.toString(16).padStart(64, "0")
    }

    encodePackedOrThrow() {
      if (this.value < BN_0) {
        const mask = (BN_1 << 256n) - BN_1
        const value = ((~(-this.value)) & mask) + BN_1

        return value.toString(16)
      }

      return this.value.toString(16)
    }

    static decodeOrThrow(cursor: TextCursor) {
      const mask = (BN_1 << this.bitsn) - BN_1

      // p42:ignore-next-statement
      const value = BigInt("0x" + cursor.read(64))

      if ((value & mask) >> (this.bitsn - BN_1))
        return new Int256(-(((~value) & mask) + BN_1))
      return new Int256(value)
    }

    trySize(): Result<32, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, BinaryWriteError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        if (this.value < BN_0) {
          const mask = (BN_1 << 256n) - BN_1
          const value = ((~(-this.value)) & mask) + BN_1

          using slice = BigInts.tryExport(value).throw(t)

          cursor.tryWrite(slice.bytes).throw(t)

          return Ok.void()
        }

        using slice = BigInts.tryExport(this.value).throw(t)

        cursor.fill(0, 32 - slice.bytes.length)
        cursor.tryWrite(slice.bytes).throw(t)

        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<Int256, BinaryReadError | Base16.AnyError> {
      return Result.unthrowSync(t => {
        cursor.offset += 32 - Int256.bytes

        const mask = (BN_1 << this.bitsn) - BN_1

        const bytes = cursor.tryRead(Int256.bytes).throw(t)
        const value = BigInts.tryImport(bytes).throw(t)

        if ((value & mask) >> (this.bitsn - BN_1))
          return new Ok(new Int256(-(((~value) & mask) + BN_1)))
        return new Ok(new Int256(value))
      })
    }
  }

export type IntByName = {
    int8: typeof Int8,
    int16: typeof Int16,
    int24: typeof Int24,
    int32: typeof Int32,
    int40: typeof Int40,
    int48: typeof Int48,
    int56: typeof Int56,
    int64: typeof Int64,
    int72: typeof Int72,
    int80: typeof Int80,
    int88: typeof Int88,
    int96: typeof Int96,
    int104: typeof Int104,
    int112: typeof Int112,
    int120: typeof Int120,
    int128: typeof Int128,
    int136: typeof Int136,
    int144: typeof Int144,
    int152: typeof Int152,
    int160: typeof Int160,
    int168: typeof Int168,
    int176: typeof Int176,
    int184: typeof Int184,
    int192: typeof Int192,
    int200: typeof Int200,
    int208: typeof Int208,
    int216: typeof Int216,
    int224: typeof Int224,
    int232: typeof Int232,
    int240: typeof Int240,
    int248: typeof Int248,
    int256: typeof Int256,
  }
  
  export const intByName: IntByName = {
    int8: Int8,
    int16: Int16,
    int24: Int24,
    int32: Int32,
    int40: Int40,
    int48: Int48,
    int56: Int56,
    int64: Int64,
    int72: Int72,
    int80: Int80,
    int88: Int88,
    int96: Int96,
    int104: Int104,
    int112: Int112,
    int120: Int120,
    int128: Int128,
    int136: Int136,
    int144: Int144,
    int152: Int152,
    int160: Int160,
    int168: Int168,
    int176: Int176,
    int184: Int184,
    int192: Int192,
    int200: Int200,
    int208: Int208,
    int216: Int216,
    int224: Int224,
    int232: Int232,
    int240: Int240,
    int248: Int248,
    int256: Int256,
  }