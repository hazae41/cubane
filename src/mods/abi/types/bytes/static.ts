import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { RawHexString, ZeroHexString } from "mods/types/string/index.js";

export { AbiBytes1 as Bytes1 }
  
export type AbiBytes1 =
  | BytesAbiBytes1
  | ZeroHexAbiBytes1
  
export namespace AbiBytes1 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes1.Create
    | ZeroHexAbiBytes1.Create
  
  export type From = 
    | BytesAbiBytes1.From
    | ZeroHexAbiBytes1.From
  
  export function create(value: AbiBytes1.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes1.create(value)
    return ZeroHexAbiBytes1.create(value)
  }

  export function fromOrThrow(value: AbiBytes1.From) {
    return AbiBytes1.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes1`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes1.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes1.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes1 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes1 {
  readonly #class = BytesAbiBytes1

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes1.Create) {
    return new BytesAbiBytes1(value)
  }

  static fromOrThrow(value: BytesAbiBytes1.From) {
    return BytesAbiBytes1.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes1`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes1.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes1.nibbles

    return new BytesAbiBytes1(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes1.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes1.bytes)

    cursor.offset += 32 - BytesAbiBytes1.bytes
    
    return new BytesAbiBytes1(content)
  }

}

export namespace RawHexAbiBytes1 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes1 {
  readonly #class = RawHexAbiBytes1

  static readonly bytes = 1
  static readonly nibbles = 2
  static readonly bits = 8
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes1.Create) {
    return new RawHexAbiBytes1(value)
  }

  static fromOrThrow(value: RawHexAbiBytes1.From) {
    return new RawHexAbiBytes1(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes1`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes1.nibbles)

    cursor.offset += 64 - RawHexAbiBytes1.nibbles

    return new RawHexAbiBytes1(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes1.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes1.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes1.bytes
    
    return new RawHexAbiBytes1(value as RawHexString)
  }

}

export { AbiBytes2 as Bytes2 }
  
export type AbiBytes2 =
  | BytesAbiBytes2
  | ZeroHexAbiBytes2
  
export namespace AbiBytes2 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes2.Create
    | ZeroHexAbiBytes2.Create
  
  export type From = 
    | BytesAbiBytes2.From
    | ZeroHexAbiBytes2.From
  
  export function create(value: AbiBytes2.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes2.create(value)
    return ZeroHexAbiBytes2.create(value)
  }

  export function fromOrThrow(value: AbiBytes2.From) {
    return AbiBytes2.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes2`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes2.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes2.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes2 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes2 {
  readonly #class = BytesAbiBytes2

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes2.Create) {
    return new BytesAbiBytes2(value)
  }

  static fromOrThrow(value: BytesAbiBytes2.From) {
    return BytesAbiBytes2.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes2`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes2.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes2.nibbles

    return new BytesAbiBytes2(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes2.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes2.bytes)

    cursor.offset += 32 - BytesAbiBytes2.bytes
    
    return new BytesAbiBytes2(content)
  }

}

export namespace RawHexAbiBytes2 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes2 {
  readonly #class = RawHexAbiBytes2

  static readonly bytes = 2
  static readonly nibbles = 4
  static readonly bits = 16
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes2.Create) {
    return new RawHexAbiBytes2(value)
  }

  static fromOrThrow(value: RawHexAbiBytes2.From) {
    return new RawHexAbiBytes2(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes2`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes2.nibbles)

    cursor.offset += 64 - RawHexAbiBytes2.nibbles

    return new RawHexAbiBytes2(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes2.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes2.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes2.bytes
    
    return new RawHexAbiBytes2(value as RawHexString)
  }

}

export { AbiBytes3 as Bytes3 }
  
export type AbiBytes3 =
  | BytesAbiBytes3
  | ZeroHexAbiBytes3
  
export namespace AbiBytes3 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes3.Create
    | ZeroHexAbiBytes3.Create
  
  export type From = 
    | BytesAbiBytes3.From
    | ZeroHexAbiBytes3.From
  
  export function create(value: AbiBytes3.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes3.create(value)
    return ZeroHexAbiBytes3.create(value)
  }

  export function fromOrThrow(value: AbiBytes3.From) {
    return AbiBytes3.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes3`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes3.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes3.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes3 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes3 {
  readonly #class = BytesAbiBytes3

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes3.Create) {
    return new BytesAbiBytes3(value)
  }

  static fromOrThrow(value: BytesAbiBytes3.From) {
    return BytesAbiBytes3.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes3`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes3.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes3.nibbles

    return new BytesAbiBytes3(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes3.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes3.bytes)

    cursor.offset += 32 - BytesAbiBytes3.bytes
    
    return new BytesAbiBytes3(content)
  }

}

export namespace RawHexAbiBytes3 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes3 {
  readonly #class = RawHexAbiBytes3

  static readonly bytes = 3
  static readonly nibbles = 6
  static readonly bits = 24
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes3.Create) {
    return new RawHexAbiBytes3(value)
  }

  static fromOrThrow(value: RawHexAbiBytes3.From) {
    return new RawHexAbiBytes3(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes3`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes3.nibbles)

    cursor.offset += 64 - RawHexAbiBytes3.nibbles

    return new RawHexAbiBytes3(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes3.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes3.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes3.bytes
    
    return new RawHexAbiBytes3(value as RawHexString)
  }

}

export { AbiBytes4 as Bytes4 }
  
export type AbiBytes4 =
  | BytesAbiBytes4
  | ZeroHexAbiBytes4
  
export namespace AbiBytes4 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes4.Create
    | ZeroHexAbiBytes4.Create
  
  export type From = 
    | BytesAbiBytes4.From
    | ZeroHexAbiBytes4.From
  
  export function create(value: AbiBytes4.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes4.create(value)
    return ZeroHexAbiBytes4.create(value)
  }

  export function fromOrThrow(value: AbiBytes4.From) {
    return AbiBytes4.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes4`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes4.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes4.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes4 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes4 {
  readonly #class = BytesAbiBytes4

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes4.Create) {
    return new BytesAbiBytes4(value)
  }

  static fromOrThrow(value: BytesAbiBytes4.From) {
    return BytesAbiBytes4.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes4`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes4.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes4.nibbles

    return new BytesAbiBytes4(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes4.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes4.bytes)

    cursor.offset += 32 - BytesAbiBytes4.bytes
    
    return new BytesAbiBytes4(content)
  }

}

export namespace RawHexAbiBytes4 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes4 {
  readonly #class = RawHexAbiBytes4

  static readonly bytes = 4
  static readonly nibbles = 8
  static readonly bits = 32
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes4.Create) {
    return new RawHexAbiBytes4(value)
  }

  static fromOrThrow(value: RawHexAbiBytes4.From) {
    return new RawHexAbiBytes4(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes4`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes4.nibbles)

    cursor.offset += 64 - RawHexAbiBytes4.nibbles

    return new RawHexAbiBytes4(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes4.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes4.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes4.bytes
    
    return new RawHexAbiBytes4(value as RawHexString)
  }

}

export { AbiBytes5 as Bytes5 }
  
export type AbiBytes5 =
  | BytesAbiBytes5
  | ZeroHexAbiBytes5
  
export namespace AbiBytes5 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes5.Create
    | ZeroHexAbiBytes5.Create
  
  export type From = 
    | BytesAbiBytes5.From
    | ZeroHexAbiBytes5.From
  
  export function create(value: AbiBytes5.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes5.create(value)
    return ZeroHexAbiBytes5.create(value)
  }

  export function fromOrThrow(value: AbiBytes5.From) {
    return AbiBytes5.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes5`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes5.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes5.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes5 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes5 {
  readonly #class = BytesAbiBytes5

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes5.Create) {
    return new BytesAbiBytes5(value)
  }

  static fromOrThrow(value: BytesAbiBytes5.From) {
    return BytesAbiBytes5.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes5`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes5.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes5.nibbles

    return new BytesAbiBytes5(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes5.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes5.bytes)

    cursor.offset += 32 - BytesAbiBytes5.bytes
    
    return new BytesAbiBytes5(content)
  }

}

export namespace RawHexAbiBytes5 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes5 {
  readonly #class = RawHexAbiBytes5

  static readonly bytes = 5
  static readonly nibbles = 10
  static readonly bits = 40
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes5.Create) {
    return new RawHexAbiBytes5(value)
  }

  static fromOrThrow(value: RawHexAbiBytes5.From) {
    return new RawHexAbiBytes5(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes5`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes5.nibbles)

    cursor.offset += 64 - RawHexAbiBytes5.nibbles

    return new RawHexAbiBytes5(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes5.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes5.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes5.bytes
    
    return new RawHexAbiBytes5(value as RawHexString)
  }

}

export { AbiBytes6 as Bytes6 }
  
export type AbiBytes6 =
  | BytesAbiBytes6
  | ZeroHexAbiBytes6
  
export namespace AbiBytes6 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes6.Create
    | ZeroHexAbiBytes6.Create
  
  export type From = 
    | BytesAbiBytes6.From
    | ZeroHexAbiBytes6.From
  
  export function create(value: AbiBytes6.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes6.create(value)
    return ZeroHexAbiBytes6.create(value)
  }

  export function fromOrThrow(value: AbiBytes6.From) {
    return AbiBytes6.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes6`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes6.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes6.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes6 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes6 {
  readonly #class = BytesAbiBytes6

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes6.Create) {
    return new BytesAbiBytes6(value)
  }

  static fromOrThrow(value: BytesAbiBytes6.From) {
    return BytesAbiBytes6.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes6`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes6.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes6.nibbles

    return new BytesAbiBytes6(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes6.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes6.bytes)

    cursor.offset += 32 - BytesAbiBytes6.bytes
    
    return new BytesAbiBytes6(content)
  }

}

export namespace RawHexAbiBytes6 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes6 {
  readonly #class = RawHexAbiBytes6

  static readonly bytes = 6
  static readonly nibbles = 12
  static readonly bits = 48
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes6.Create) {
    return new RawHexAbiBytes6(value)
  }

  static fromOrThrow(value: RawHexAbiBytes6.From) {
    return new RawHexAbiBytes6(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes6`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes6.nibbles)

    cursor.offset += 64 - RawHexAbiBytes6.nibbles

    return new RawHexAbiBytes6(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes6.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes6.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes6.bytes
    
    return new RawHexAbiBytes6(value as RawHexString)
  }

}

export { AbiBytes7 as Bytes7 }
  
export type AbiBytes7 =
  | BytesAbiBytes7
  | ZeroHexAbiBytes7
  
export namespace AbiBytes7 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes7.Create
    | ZeroHexAbiBytes7.Create
  
  export type From = 
    | BytesAbiBytes7.From
    | ZeroHexAbiBytes7.From
  
  export function create(value: AbiBytes7.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes7.create(value)
    return ZeroHexAbiBytes7.create(value)
  }

  export function fromOrThrow(value: AbiBytes7.From) {
    return AbiBytes7.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes7`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes7.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes7.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes7 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes7 {
  readonly #class = BytesAbiBytes7

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes7.Create) {
    return new BytesAbiBytes7(value)
  }

  static fromOrThrow(value: BytesAbiBytes7.From) {
    return BytesAbiBytes7.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes7`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes7.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes7.nibbles

    return new BytesAbiBytes7(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes7.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes7.bytes)

    cursor.offset += 32 - BytesAbiBytes7.bytes
    
    return new BytesAbiBytes7(content)
  }

}

export namespace RawHexAbiBytes7 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes7 {
  readonly #class = RawHexAbiBytes7

  static readonly bytes = 7
  static readonly nibbles = 14
  static readonly bits = 56
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes7.Create) {
    return new RawHexAbiBytes7(value)
  }

  static fromOrThrow(value: RawHexAbiBytes7.From) {
    return new RawHexAbiBytes7(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes7`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes7.nibbles)

    cursor.offset += 64 - RawHexAbiBytes7.nibbles

    return new RawHexAbiBytes7(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes7.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes7.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes7.bytes
    
    return new RawHexAbiBytes7(value as RawHexString)
  }

}

export { AbiBytes8 as Bytes8 }
  
export type AbiBytes8 =
  | BytesAbiBytes8
  | ZeroHexAbiBytes8
  
export namespace AbiBytes8 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes8.Create
    | ZeroHexAbiBytes8.Create
  
  export type From = 
    | BytesAbiBytes8.From
    | ZeroHexAbiBytes8.From
  
  export function create(value: AbiBytes8.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes8.create(value)
    return ZeroHexAbiBytes8.create(value)
  }

  export function fromOrThrow(value: AbiBytes8.From) {
    return AbiBytes8.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes8`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes8.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes8.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes8 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes8 {
  readonly #class = BytesAbiBytes8

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes8.Create) {
    return new BytesAbiBytes8(value)
  }

  static fromOrThrow(value: BytesAbiBytes8.From) {
    return BytesAbiBytes8.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes8.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes8.nibbles

    return new BytesAbiBytes8(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes8.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes8.bytes)

    cursor.offset += 32 - BytesAbiBytes8.bytes
    
    return new BytesAbiBytes8(content)
  }

}

export namespace RawHexAbiBytes8 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes8 {
  readonly #class = RawHexAbiBytes8

  static readonly bytes = 8
  static readonly nibbles = 16
  static readonly bits = 64
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes8.Create) {
    return new RawHexAbiBytes8(value)
  }

  static fromOrThrow(value: RawHexAbiBytes8.From) {
    return new RawHexAbiBytes8(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes8`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes8.nibbles)

    cursor.offset += 64 - RawHexAbiBytes8.nibbles

    return new RawHexAbiBytes8(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes8.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes8.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes8.bytes
    
    return new RawHexAbiBytes8(value as RawHexString)
  }

}

export { AbiBytes9 as Bytes9 }
  
export type AbiBytes9 =
  | BytesAbiBytes9
  | ZeroHexAbiBytes9
  
export namespace AbiBytes9 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes9.Create
    | ZeroHexAbiBytes9.Create
  
  export type From = 
    | BytesAbiBytes9.From
    | ZeroHexAbiBytes9.From
  
  export function create(value: AbiBytes9.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes9.create(value)
    return ZeroHexAbiBytes9.create(value)
  }

  export function fromOrThrow(value: AbiBytes9.From) {
    return AbiBytes9.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes9`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes9.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes9.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes9 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes9 {
  readonly #class = BytesAbiBytes9

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes9.Create) {
    return new BytesAbiBytes9(value)
  }

  static fromOrThrow(value: BytesAbiBytes9.From) {
    return BytesAbiBytes9.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes9`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes9.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes9.nibbles

    return new BytesAbiBytes9(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes9.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes9.bytes)

    cursor.offset += 32 - BytesAbiBytes9.bytes
    
    return new BytesAbiBytes9(content)
  }

}

export namespace RawHexAbiBytes9 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes9 {
  readonly #class = RawHexAbiBytes9

  static readonly bytes = 9
  static readonly nibbles = 18
  static readonly bits = 72
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes9.Create) {
    return new RawHexAbiBytes9(value)
  }

  static fromOrThrow(value: RawHexAbiBytes9.From) {
    return new RawHexAbiBytes9(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes9`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes9.nibbles)

    cursor.offset += 64 - RawHexAbiBytes9.nibbles

    return new RawHexAbiBytes9(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes9.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes9.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes9.bytes
    
    return new RawHexAbiBytes9(value as RawHexString)
  }

}

export { AbiBytes10 as Bytes10 }
  
export type AbiBytes10 =
  | BytesAbiBytes10
  | ZeroHexAbiBytes10
  
export namespace AbiBytes10 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes10.Create
    | ZeroHexAbiBytes10.Create
  
  export type From = 
    | BytesAbiBytes10.From
    | ZeroHexAbiBytes10.From
  
  export function create(value: AbiBytes10.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes10.create(value)
    return ZeroHexAbiBytes10.create(value)
  }

  export function fromOrThrow(value: AbiBytes10.From) {
    return AbiBytes10.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes10`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes10.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes10.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes10 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes10 {
  readonly #class = BytesAbiBytes10

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes10.Create) {
    return new BytesAbiBytes10(value)
  }

  static fromOrThrow(value: BytesAbiBytes10.From) {
    return BytesAbiBytes10.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes10`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes10.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes10.nibbles

    return new BytesAbiBytes10(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes10.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes10.bytes)

    cursor.offset += 32 - BytesAbiBytes10.bytes
    
    return new BytesAbiBytes10(content)
  }

}

export namespace RawHexAbiBytes10 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes10 {
  readonly #class = RawHexAbiBytes10

  static readonly bytes = 10
  static readonly nibbles = 20
  static readonly bits = 80
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes10.Create) {
    return new RawHexAbiBytes10(value)
  }

  static fromOrThrow(value: RawHexAbiBytes10.From) {
    return new RawHexAbiBytes10(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes10`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes10.nibbles)

    cursor.offset += 64 - RawHexAbiBytes10.nibbles

    return new RawHexAbiBytes10(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes10.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes10.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes10.bytes
    
    return new RawHexAbiBytes10(value as RawHexString)
  }

}

export { AbiBytes11 as Bytes11 }
  
export type AbiBytes11 =
  | BytesAbiBytes11
  | ZeroHexAbiBytes11
  
export namespace AbiBytes11 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes11.Create
    | ZeroHexAbiBytes11.Create
  
  export type From = 
    | BytesAbiBytes11.From
    | ZeroHexAbiBytes11.From
  
  export function create(value: AbiBytes11.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes11.create(value)
    return ZeroHexAbiBytes11.create(value)
  }

  export function fromOrThrow(value: AbiBytes11.From) {
    return AbiBytes11.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes11`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes11.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes11.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes11 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes11 {
  readonly #class = BytesAbiBytes11

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes11.Create) {
    return new BytesAbiBytes11(value)
  }

  static fromOrThrow(value: BytesAbiBytes11.From) {
    return BytesAbiBytes11.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes11`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes11.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes11.nibbles

    return new BytesAbiBytes11(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes11.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes11.bytes)

    cursor.offset += 32 - BytesAbiBytes11.bytes
    
    return new BytesAbiBytes11(content)
  }

}

export namespace RawHexAbiBytes11 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes11 {
  readonly #class = RawHexAbiBytes11

  static readonly bytes = 11
  static readonly nibbles = 22
  static readonly bits = 88
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes11.Create) {
    return new RawHexAbiBytes11(value)
  }

  static fromOrThrow(value: RawHexAbiBytes11.From) {
    return new RawHexAbiBytes11(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes11`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes11.nibbles)

    cursor.offset += 64 - RawHexAbiBytes11.nibbles

    return new RawHexAbiBytes11(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes11.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes11.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes11.bytes
    
    return new RawHexAbiBytes11(value as RawHexString)
  }

}

export { AbiBytes12 as Bytes12 }
  
export type AbiBytes12 =
  | BytesAbiBytes12
  | ZeroHexAbiBytes12
  
export namespace AbiBytes12 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes12.Create
    | ZeroHexAbiBytes12.Create
  
  export type From = 
    | BytesAbiBytes12.From
    | ZeroHexAbiBytes12.From
  
  export function create(value: AbiBytes12.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes12.create(value)
    return ZeroHexAbiBytes12.create(value)
  }

  export function fromOrThrow(value: AbiBytes12.From) {
    return AbiBytes12.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes12`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes12.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes12.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes12 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes12 {
  readonly #class = BytesAbiBytes12

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes12.Create) {
    return new BytesAbiBytes12(value)
  }

  static fromOrThrow(value: BytesAbiBytes12.From) {
    return BytesAbiBytes12.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes12`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes12.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes12.nibbles

    return new BytesAbiBytes12(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes12.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes12.bytes)

    cursor.offset += 32 - BytesAbiBytes12.bytes
    
    return new BytesAbiBytes12(content)
  }

}

export namespace RawHexAbiBytes12 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes12 {
  readonly #class = RawHexAbiBytes12

  static readonly bytes = 12
  static readonly nibbles = 24
  static readonly bits = 96
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes12.Create) {
    return new RawHexAbiBytes12(value)
  }

  static fromOrThrow(value: RawHexAbiBytes12.From) {
    return new RawHexAbiBytes12(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes12`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes12.nibbles)

    cursor.offset += 64 - RawHexAbiBytes12.nibbles

    return new RawHexAbiBytes12(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes12.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes12.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes12.bytes
    
    return new RawHexAbiBytes12(value as RawHexString)
  }

}

export { AbiBytes13 as Bytes13 }
  
export type AbiBytes13 =
  | BytesAbiBytes13
  | ZeroHexAbiBytes13
  
export namespace AbiBytes13 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes13.Create
    | ZeroHexAbiBytes13.Create
  
  export type From = 
    | BytesAbiBytes13.From
    | ZeroHexAbiBytes13.From
  
  export function create(value: AbiBytes13.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes13.create(value)
    return ZeroHexAbiBytes13.create(value)
  }

  export function fromOrThrow(value: AbiBytes13.From) {
    return AbiBytes13.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes13`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes13.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes13.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes13 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes13 {
  readonly #class = BytesAbiBytes13

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes13.Create) {
    return new BytesAbiBytes13(value)
  }

  static fromOrThrow(value: BytesAbiBytes13.From) {
    return BytesAbiBytes13.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes13`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes13.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes13.nibbles

    return new BytesAbiBytes13(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes13.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes13.bytes)

    cursor.offset += 32 - BytesAbiBytes13.bytes
    
    return new BytesAbiBytes13(content)
  }

}

export namespace RawHexAbiBytes13 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes13 {
  readonly #class = RawHexAbiBytes13

  static readonly bytes = 13
  static readonly nibbles = 26
  static readonly bits = 104
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes13.Create) {
    return new RawHexAbiBytes13(value)
  }

  static fromOrThrow(value: RawHexAbiBytes13.From) {
    return new RawHexAbiBytes13(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes13`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes13.nibbles)

    cursor.offset += 64 - RawHexAbiBytes13.nibbles

    return new RawHexAbiBytes13(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes13.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes13.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes13.bytes
    
    return new RawHexAbiBytes13(value as RawHexString)
  }

}

export { AbiBytes14 as Bytes14 }
  
export type AbiBytes14 =
  | BytesAbiBytes14
  | ZeroHexAbiBytes14
  
export namespace AbiBytes14 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes14.Create
    | ZeroHexAbiBytes14.Create
  
  export type From = 
    | BytesAbiBytes14.From
    | ZeroHexAbiBytes14.From
  
  export function create(value: AbiBytes14.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes14.create(value)
    return ZeroHexAbiBytes14.create(value)
  }

  export function fromOrThrow(value: AbiBytes14.From) {
    return AbiBytes14.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes14`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes14.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes14.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes14 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes14 {
  readonly #class = BytesAbiBytes14

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes14.Create) {
    return new BytesAbiBytes14(value)
  }

  static fromOrThrow(value: BytesAbiBytes14.From) {
    return BytesAbiBytes14.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes14`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes14.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes14.nibbles

    return new BytesAbiBytes14(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes14.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes14.bytes)

    cursor.offset += 32 - BytesAbiBytes14.bytes
    
    return new BytesAbiBytes14(content)
  }

}

export namespace RawHexAbiBytes14 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes14 {
  readonly #class = RawHexAbiBytes14

  static readonly bytes = 14
  static readonly nibbles = 28
  static readonly bits = 112
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes14.Create) {
    return new RawHexAbiBytes14(value)
  }

  static fromOrThrow(value: RawHexAbiBytes14.From) {
    return new RawHexAbiBytes14(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes14`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes14.nibbles)

    cursor.offset += 64 - RawHexAbiBytes14.nibbles

    return new RawHexAbiBytes14(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes14.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes14.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes14.bytes
    
    return new RawHexAbiBytes14(value as RawHexString)
  }

}

export { AbiBytes15 as Bytes15 }
  
export type AbiBytes15 =
  | BytesAbiBytes15
  | ZeroHexAbiBytes15
  
export namespace AbiBytes15 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes15.Create
    | ZeroHexAbiBytes15.Create
  
  export type From = 
    | BytesAbiBytes15.From
    | ZeroHexAbiBytes15.From
  
  export function create(value: AbiBytes15.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes15.create(value)
    return ZeroHexAbiBytes15.create(value)
  }

  export function fromOrThrow(value: AbiBytes15.From) {
    return AbiBytes15.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes15`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes15.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes15.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes15 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes15 {
  readonly #class = BytesAbiBytes15

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes15.Create) {
    return new BytesAbiBytes15(value)
  }

  static fromOrThrow(value: BytesAbiBytes15.From) {
    return BytesAbiBytes15.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes15`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes15.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes15.nibbles

    return new BytesAbiBytes15(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes15.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes15.bytes)

    cursor.offset += 32 - BytesAbiBytes15.bytes
    
    return new BytesAbiBytes15(content)
  }

}

export namespace RawHexAbiBytes15 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes15 {
  readonly #class = RawHexAbiBytes15

  static readonly bytes = 15
  static readonly nibbles = 30
  static readonly bits = 120
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes15.Create) {
    return new RawHexAbiBytes15(value)
  }

  static fromOrThrow(value: RawHexAbiBytes15.From) {
    return new RawHexAbiBytes15(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes15`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes15.nibbles)

    cursor.offset += 64 - RawHexAbiBytes15.nibbles

    return new RawHexAbiBytes15(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes15.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes15.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes15.bytes
    
    return new RawHexAbiBytes15(value as RawHexString)
  }

}

export { AbiBytes16 as Bytes16 }
  
export type AbiBytes16 =
  | BytesAbiBytes16
  | ZeroHexAbiBytes16
  
export namespace AbiBytes16 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes16.Create
    | ZeroHexAbiBytes16.Create
  
  export type From = 
    | BytesAbiBytes16.From
    | ZeroHexAbiBytes16.From
  
  export function create(value: AbiBytes16.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes16.create(value)
    return ZeroHexAbiBytes16.create(value)
  }

  export function fromOrThrow(value: AbiBytes16.From) {
    return AbiBytes16.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes16`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes16.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes16.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes16 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes16 {
  readonly #class = BytesAbiBytes16

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes16.Create) {
    return new BytesAbiBytes16(value)
  }

  static fromOrThrow(value: BytesAbiBytes16.From) {
    return BytesAbiBytes16.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes16.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes16.nibbles

    return new BytesAbiBytes16(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes16.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes16.bytes)

    cursor.offset += 32 - BytesAbiBytes16.bytes
    
    return new BytesAbiBytes16(content)
  }

}

export namespace RawHexAbiBytes16 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes16 {
  readonly #class = RawHexAbiBytes16

  static readonly bytes = 16
  static readonly nibbles = 32
  static readonly bits = 128
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes16.Create) {
    return new RawHexAbiBytes16(value)
  }

  static fromOrThrow(value: RawHexAbiBytes16.From) {
    return new RawHexAbiBytes16(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes16`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes16.nibbles)

    cursor.offset += 64 - RawHexAbiBytes16.nibbles

    return new RawHexAbiBytes16(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes16.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes16.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes16.bytes
    
    return new RawHexAbiBytes16(value as RawHexString)
  }

}

export { AbiBytes17 as Bytes17 }
  
export type AbiBytes17 =
  | BytesAbiBytes17
  | ZeroHexAbiBytes17
  
export namespace AbiBytes17 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes17.Create
    | ZeroHexAbiBytes17.Create
  
  export type From = 
    | BytesAbiBytes17.From
    | ZeroHexAbiBytes17.From
  
  export function create(value: AbiBytes17.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes17.create(value)
    return ZeroHexAbiBytes17.create(value)
  }

  export function fromOrThrow(value: AbiBytes17.From) {
    return AbiBytes17.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes17`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes17.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes17.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes17 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes17 {
  readonly #class = BytesAbiBytes17

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes17.Create) {
    return new BytesAbiBytes17(value)
  }

  static fromOrThrow(value: BytesAbiBytes17.From) {
    return BytesAbiBytes17.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes17`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes17.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes17.nibbles

    return new BytesAbiBytes17(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes17.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes17.bytes)

    cursor.offset += 32 - BytesAbiBytes17.bytes
    
    return new BytesAbiBytes17(content)
  }

}

export namespace RawHexAbiBytes17 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes17 {
  readonly #class = RawHexAbiBytes17

  static readonly bytes = 17
  static readonly nibbles = 34
  static readonly bits = 136
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes17.Create) {
    return new RawHexAbiBytes17(value)
  }

  static fromOrThrow(value: RawHexAbiBytes17.From) {
    return new RawHexAbiBytes17(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes17`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes17.nibbles)

    cursor.offset += 64 - RawHexAbiBytes17.nibbles

    return new RawHexAbiBytes17(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes17.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes17.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes17.bytes
    
    return new RawHexAbiBytes17(value as RawHexString)
  }

}

export { AbiBytes18 as Bytes18 }
  
export type AbiBytes18 =
  | BytesAbiBytes18
  | ZeroHexAbiBytes18
  
export namespace AbiBytes18 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes18.Create
    | ZeroHexAbiBytes18.Create
  
  export type From = 
    | BytesAbiBytes18.From
    | ZeroHexAbiBytes18.From
  
  export function create(value: AbiBytes18.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes18.create(value)
    return ZeroHexAbiBytes18.create(value)
  }

  export function fromOrThrow(value: AbiBytes18.From) {
    return AbiBytes18.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes18`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes18.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes18.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes18 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes18 {
  readonly #class = BytesAbiBytes18

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes18.Create) {
    return new BytesAbiBytes18(value)
  }

  static fromOrThrow(value: BytesAbiBytes18.From) {
    return BytesAbiBytes18.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes18`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes18.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes18.nibbles

    return new BytesAbiBytes18(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes18.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes18.bytes)

    cursor.offset += 32 - BytesAbiBytes18.bytes
    
    return new BytesAbiBytes18(content)
  }

}

export namespace RawHexAbiBytes18 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes18 {
  readonly #class = RawHexAbiBytes18

  static readonly bytes = 18
  static readonly nibbles = 36
  static readonly bits = 144
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes18.Create) {
    return new RawHexAbiBytes18(value)
  }

  static fromOrThrow(value: RawHexAbiBytes18.From) {
    return new RawHexAbiBytes18(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes18`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes18.nibbles)

    cursor.offset += 64 - RawHexAbiBytes18.nibbles

    return new RawHexAbiBytes18(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes18.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes18.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes18.bytes
    
    return new RawHexAbiBytes18(value as RawHexString)
  }

}

export { AbiBytes19 as Bytes19 }
  
export type AbiBytes19 =
  | BytesAbiBytes19
  | ZeroHexAbiBytes19
  
export namespace AbiBytes19 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes19.Create
    | ZeroHexAbiBytes19.Create
  
  export type From = 
    | BytesAbiBytes19.From
    | ZeroHexAbiBytes19.From
  
  export function create(value: AbiBytes19.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes19.create(value)
    return ZeroHexAbiBytes19.create(value)
  }

  export function fromOrThrow(value: AbiBytes19.From) {
    return AbiBytes19.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes19`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes19.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes19.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes19 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes19 {
  readonly #class = BytesAbiBytes19

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes19.Create) {
    return new BytesAbiBytes19(value)
  }

  static fromOrThrow(value: BytesAbiBytes19.From) {
    return BytesAbiBytes19.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes19`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes19.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes19.nibbles

    return new BytesAbiBytes19(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes19.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes19.bytes)

    cursor.offset += 32 - BytesAbiBytes19.bytes
    
    return new BytesAbiBytes19(content)
  }

}

export namespace RawHexAbiBytes19 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes19 {
  readonly #class = RawHexAbiBytes19

  static readonly bytes = 19
  static readonly nibbles = 38
  static readonly bits = 152
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes19.Create) {
    return new RawHexAbiBytes19(value)
  }

  static fromOrThrow(value: RawHexAbiBytes19.From) {
    return new RawHexAbiBytes19(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes19`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes19.nibbles)

    cursor.offset += 64 - RawHexAbiBytes19.nibbles

    return new RawHexAbiBytes19(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes19.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes19.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes19.bytes
    
    return new RawHexAbiBytes19(value as RawHexString)
  }

}

export { AbiBytes20 as Bytes20 }
  
export type AbiBytes20 =
  | BytesAbiBytes20
  | ZeroHexAbiBytes20
  
export namespace AbiBytes20 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes20.Create
    | ZeroHexAbiBytes20.Create
  
  export type From = 
    | BytesAbiBytes20.From
    | ZeroHexAbiBytes20.From
  
  export function create(value: AbiBytes20.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes20.create(value)
    return ZeroHexAbiBytes20.create(value)
  }

  export function fromOrThrow(value: AbiBytes20.From) {
    return AbiBytes20.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes20`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes20.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes20.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes20 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes20 {
  readonly #class = BytesAbiBytes20

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes20.Create) {
    return new BytesAbiBytes20(value)
  }

  static fromOrThrow(value: BytesAbiBytes20.From) {
    return BytesAbiBytes20.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes20`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes20.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes20.nibbles

    return new BytesAbiBytes20(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes20.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes20.bytes)

    cursor.offset += 32 - BytesAbiBytes20.bytes
    
    return new BytesAbiBytes20(content)
  }

}

export namespace RawHexAbiBytes20 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes20 {
  readonly #class = RawHexAbiBytes20

  static readonly bytes = 20
  static readonly nibbles = 40
  static readonly bits = 160
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes20.Create) {
    return new RawHexAbiBytes20(value)
  }

  static fromOrThrow(value: RawHexAbiBytes20.From) {
    return new RawHexAbiBytes20(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes20`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes20.nibbles)

    cursor.offset += 64 - RawHexAbiBytes20.nibbles

    return new RawHexAbiBytes20(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes20.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes20.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes20.bytes
    
    return new RawHexAbiBytes20(value as RawHexString)
  }

}

export { AbiBytes21 as Bytes21 }
  
export type AbiBytes21 =
  | BytesAbiBytes21
  | ZeroHexAbiBytes21
  
export namespace AbiBytes21 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes21.Create
    | ZeroHexAbiBytes21.Create
  
  export type From = 
    | BytesAbiBytes21.From
    | ZeroHexAbiBytes21.From
  
  export function create(value: AbiBytes21.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes21.create(value)
    return ZeroHexAbiBytes21.create(value)
  }

  export function fromOrThrow(value: AbiBytes21.From) {
    return AbiBytes21.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes21`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes21.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes21.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes21 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes21 {
  readonly #class = BytesAbiBytes21

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes21.Create) {
    return new BytesAbiBytes21(value)
  }

  static fromOrThrow(value: BytesAbiBytes21.From) {
    return BytesAbiBytes21.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes21`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes21.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes21.nibbles

    return new BytesAbiBytes21(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes21.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes21.bytes)

    cursor.offset += 32 - BytesAbiBytes21.bytes
    
    return new BytesAbiBytes21(content)
  }

}

export namespace RawHexAbiBytes21 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes21 {
  readonly #class = RawHexAbiBytes21

  static readonly bytes = 21
  static readonly nibbles = 42
  static readonly bits = 168
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes21.Create) {
    return new RawHexAbiBytes21(value)
  }

  static fromOrThrow(value: RawHexAbiBytes21.From) {
    return new RawHexAbiBytes21(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes21`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes21.nibbles)

    cursor.offset += 64 - RawHexAbiBytes21.nibbles

    return new RawHexAbiBytes21(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes21.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes21.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes21.bytes
    
    return new RawHexAbiBytes21(value as RawHexString)
  }

}

export { AbiBytes22 as Bytes22 }
  
export type AbiBytes22 =
  | BytesAbiBytes22
  | ZeroHexAbiBytes22
  
export namespace AbiBytes22 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes22.Create
    | ZeroHexAbiBytes22.Create
  
  export type From = 
    | BytesAbiBytes22.From
    | ZeroHexAbiBytes22.From
  
  export function create(value: AbiBytes22.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes22.create(value)
    return ZeroHexAbiBytes22.create(value)
  }

  export function fromOrThrow(value: AbiBytes22.From) {
    return AbiBytes22.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes22`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes22.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes22.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes22 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes22 {
  readonly #class = BytesAbiBytes22

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes22.Create) {
    return new BytesAbiBytes22(value)
  }

  static fromOrThrow(value: BytesAbiBytes22.From) {
    return BytesAbiBytes22.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes22`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes22.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes22.nibbles

    return new BytesAbiBytes22(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes22.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes22.bytes)

    cursor.offset += 32 - BytesAbiBytes22.bytes
    
    return new BytesAbiBytes22(content)
  }

}

export namespace RawHexAbiBytes22 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes22 {
  readonly #class = RawHexAbiBytes22

  static readonly bytes = 22
  static readonly nibbles = 44
  static readonly bits = 176
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes22.Create) {
    return new RawHexAbiBytes22(value)
  }

  static fromOrThrow(value: RawHexAbiBytes22.From) {
    return new RawHexAbiBytes22(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes22`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes22.nibbles)

    cursor.offset += 64 - RawHexAbiBytes22.nibbles

    return new RawHexAbiBytes22(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes22.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes22.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes22.bytes
    
    return new RawHexAbiBytes22(value as RawHexString)
  }

}

export { AbiBytes23 as Bytes23 }
  
export type AbiBytes23 =
  | BytesAbiBytes23
  | ZeroHexAbiBytes23
  
export namespace AbiBytes23 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes23.Create
    | ZeroHexAbiBytes23.Create
  
  export type From = 
    | BytesAbiBytes23.From
    | ZeroHexAbiBytes23.From
  
  export function create(value: AbiBytes23.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes23.create(value)
    return ZeroHexAbiBytes23.create(value)
  }

  export function fromOrThrow(value: AbiBytes23.From) {
    return AbiBytes23.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes23`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes23.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes23.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes23 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes23 {
  readonly #class = BytesAbiBytes23

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes23.Create) {
    return new BytesAbiBytes23(value)
  }

  static fromOrThrow(value: BytesAbiBytes23.From) {
    return BytesAbiBytes23.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes23`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes23.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes23.nibbles

    return new BytesAbiBytes23(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes23.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes23.bytes)

    cursor.offset += 32 - BytesAbiBytes23.bytes
    
    return new BytesAbiBytes23(content)
  }

}

export namespace RawHexAbiBytes23 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes23 {
  readonly #class = RawHexAbiBytes23

  static readonly bytes = 23
  static readonly nibbles = 46
  static readonly bits = 184
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes23.Create) {
    return new RawHexAbiBytes23(value)
  }

  static fromOrThrow(value: RawHexAbiBytes23.From) {
    return new RawHexAbiBytes23(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes23`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes23.nibbles)

    cursor.offset += 64 - RawHexAbiBytes23.nibbles

    return new RawHexAbiBytes23(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes23.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes23.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes23.bytes
    
    return new RawHexAbiBytes23(value as RawHexString)
  }

}

export { AbiBytes24 as Bytes24 }
  
export type AbiBytes24 =
  | BytesAbiBytes24
  | ZeroHexAbiBytes24
  
export namespace AbiBytes24 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes24.Create
    | ZeroHexAbiBytes24.Create
  
  export type From = 
    | BytesAbiBytes24.From
    | ZeroHexAbiBytes24.From
  
  export function create(value: AbiBytes24.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes24.create(value)
    return ZeroHexAbiBytes24.create(value)
  }

  export function fromOrThrow(value: AbiBytes24.From) {
    return AbiBytes24.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes24`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes24.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes24.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes24 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes24 {
  readonly #class = BytesAbiBytes24

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes24.Create) {
    return new BytesAbiBytes24(value)
  }

  static fromOrThrow(value: BytesAbiBytes24.From) {
    return BytesAbiBytes24.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes24.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes24.nibbles

    return new BytesAbiBytes24(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes24.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes24.bytes)

    cursor.offset += 32 - BytesAbiBytes24.bytes
    
    return new BytesAbiBytes24(content)
  }

}

export namespace RawHexAbiBytes24 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes24 {
  readonly #class = RawHexAbiBytes24

  static readonly bytes = 24
  static readonly nibbles = 48
  static readonly bits = 192
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes24.Create) {
    return new RawHexAbiBytes24(value)
  }

  static fromOrThrow(value: RawHexAbiBytes24.From) {
    return new RawHexAbiBytes24(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes24`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes24.nibbles)

    cursor.offset += 64 - RawHexAbiBytes24.nibbles

    return new RawHexAbiBytes24(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes24.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes24.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes24.bytes
    
    return new RawHexAbiBytes24(value as RawHexString)
  }

}

export { AbiBytes25 as Bytes25 }
  
export type AbiBytes25 =
  | BytesAbiBytes25
  | ZeroHexAbiBytes25
  
export namespace AbiBytes25 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes25.Create
    | ZeroHexAbiBytes25.Create
  
  export type From = 
    | BytesAbiBytes25.From
    | ZeroHexAbiBytes25.From
  
  export function create(value: AbiBytes25.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes25.create(value)
    return ZeroHexAbiBytes25.create(value)
  }

  export function fromOrThrow(value: AbiBytes25.From) {
    return AbiBytes25.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes25`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes25.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes25.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes25 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes25 {
  readonly #class = BytesAbiBytes25

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes25.Create) {
    return new BytesAbiBytes25(value)
  }

  static fromOrThrow(value: BytesAbiBytes25.From) {
    return BytesAbiBytes25.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes25`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes25.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes25.nibbles

    return new BytesAbiBytes25(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes25.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes25.bytes)

    cursor.offset += 32 - BytesAbiBytes25.bytes
    
    return new BytesAbiBytes25(content)
  }

}

export namespace RawHexAbiBytes25 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes25 {
  readonly #class = RawHexAbiBytes25

  static readonly bytes = 25
  static readonly nibbles = 50
  static readonly bits = 200
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes25.Create) {
    return new RawHexAbiBytes25(value)
  }

  static fromOrThrow(value: RawHexAbiBytes25.From) {
    return new RawHexAbiBytes25(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes25`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes25.nibbles)

    cursor.offset += 64 - RawHexAbiBytes25.nibbles

    return new RawHexAbiBytes25(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes25.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes25.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes25.bytes
    
    return new RawHexAbiBytes25(value as RawHexString)
  }

}

export { AbiBytes26 as Bytes26 }
  
export type AbiBytes26 =
  | BytesAbiBytes26
  | ZeroHexAbiBytes26
  
export namespace AbiBytes26 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes26.Create
    | ZeroHexAbiBytes26.Create
  
  export type From = 
    | BytesAbiBytes26.From
    | ZeroHexAbiBytes26.From
  
  export function create(value: AbiBytes26.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes26.create(value)
    return ZeroHexAbiBytes26.create(value)
  }

  export function fromOrThrow(value: AbiBytes26.From) {
    return AbiBytes26.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes26`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes26.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes26.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes26 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes26 {
  readonly #class = BytesAbiBytes26

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes26.Create) {
    return new BytesAbiBytes26(value)
  }

  static fromOrThrow(value: BytesAbiBytes26.From) {
    return BytesAbiBytes26.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes26`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes26.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes26.nibbles

    return new BytesAbiBytes26(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes26.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes26.bytes)

    cursor.offset += 32 - BytesAbiBytes26.bytes
    
    return new BytesAbiBytes26(content)
  }

}

export namespace RawHexAbiBytes26 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes26 {
  readonly #class = RawHexAbiBytes26

  static readonly bytes = 26
  static readonly nibbles = 52
  static readonly bits = 208
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes26.Create) {
    return new RawHexAbiBytes26(value)
  }

  static fromOrThrow(value: RawHexAbiBytes26.From) {
    return new RawHexAbiBytes26(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes26`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes26.nibbles)

    cursor.offset += 64 - RawHexAbiBytes26.nibbles

    return new RawHexAbiBytes26(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes26.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes26.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes26.bytes
    
    return new RawHexAbiBytes26(value as RawHexString)
  }

}

export { AbiBytes27 as Bytes27 }
  
export type AbiBytes27 =
  | BytesAbiBytes27
  | ZeroHexAbiBytes27
  
export namespace AbiBytes27 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes27.Create
    | ZeroHexAbiBytes27.Create
  
  export type From = 
    | BytesAbiBytes27.From
    | ZeroHexAbiBytes27.From
  
  export function create(value: AbiBytes27.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes27.create(value)
    return ZeroHexAbiBytes27.create(value)
  }

  export function fromOrThrow(value: AbiBytes27.From) {
    return AbiBytes27.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes27`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes27.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes27.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes27 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes27 {
  readonly #class = BytesAbiBytes27

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes27.Create) {
    return new BytesAbiBytes27(value)
  }

  static fromOrThrow(value: BytesAbiBytes27.From) {
    return BytesAbiBytes27.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes27`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes27.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes27.nibbles

    return new BytesAbiBytes27(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes27.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes27.bytes)

    cursor.offset += 32 - BytesAbiBytes27.bytes
    
    return new BytesAbiBytes27(content)
  }

}

export namespace RawHexAbiBytes27 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes27 {
  readonly #class = RawHexAbiBytes27

  static readonly bytes = 27
  static readonly nibbles = 54
  static readonly bits = 216
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes27.Create) {
    return new RawHexAbiBytes27(value)
  }

  static fromOrThrow(value: RawHexAbiBytes27.From) {
    return new RawHexAbiBytes27(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes27`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes27.nibbles)

    cursor.offset += 64 - RawHexAbiBytes27.nibbles

    return new RawHexAbiBytes27(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes27.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes27.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes27.bytes
    
    return new RawHexAbiBytes27(value as RawHexString)
  }

}

export { AbiBytes28 as Bytes28 }
  
export type AbiBytes28 =
  | BytesAbiBytes28
  | ZeroHexAbiBytes28
  
export namespace AbiBytes28 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes28.Create
    | ZeroHexAbiBytes28.Create
  
  export type From = 
    | BytesAbiBytes28.From
    | ZeroHexAbiBytes28.From
  
  export function create(value: AbiBytes28.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes28.create(value)
    return ZeroHexAbiBytes28.create(value)
  }

  export function fromOrThrow(value: AbiBytes28.From) {
    return AbiBytes28.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes28`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes28.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes28.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes28 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes28 {
  readonly #class = BytesAbiBytes28

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes28.Create) {
    return new BytesAbiBytes28(value)
  }

  static fromOrThrow(value: BytesAbiBytes28.From) {
    return BytesAbiBytes28.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes28`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes28.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes28.nibbles

    return new BytesAbiBytes28(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes28.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes28.bytes)

    cursor.offset += 32 - BytesAbiBytes28.bytes
    
    return new BytesAbiBytes28(content)
  }

}

export namespace RawHexAbiBytes28 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes28 {
  readonly #class = RawHexAbiBytes28

  static readonly bytes = 28
  static readonly nibbles = 56
  static readonly bits = 224
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes28.Create) {
    return new RawHexAbiBytes28(value)
  }

  static fromOrThrow(value: RawHexAbiBytes28.From) {
    return new RawHexAbiBytes28(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes28`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes28.nibbles)

    cursor.offset += 64 - RawHexAbiBytes28.nibbles

    return new RawHexAbiBytes28(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes28.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes28.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes28.bytes
    
    return new RawHexAbiBytes28(value as RawHexString)
  }

}

export { AbiBytes29 as Bytes29 }
  
export type AbiBytes29 =
  | BytesAbiBytes29
  | ZeroHexAbiBytes29
  
export namespace AbiBytes29 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes29.Create
    | ZeroHexAbiBytes29.Create
  
  export type From = 
    | BytesAbiBytes29.From
    | ZeroHexAbiBytes29.From
  
  export function create(value: AbiBytes29.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes29.create(value)
    return ZeroHexAbiBytes29.create(value)
  }

  export function fromOrThrow(value: AbiBytes29.From) {
    return AbiBytes29.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes29`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes29.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes29.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes29 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes29 {
  readonly #class = BytesAbiBytes29

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes29.Create) {
    return new BytesAbiBytes29(value)
  }

  static fromOrThrow(value: BytesAbiBytes29.From) {
    return BytesAbiBytes29.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes29`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes29.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes29.nibbles

    return new BytesAbiBytes29(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes29.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes29.bytes)

    cursor.offset += 32 - BytesAbiBytes29.bytes
    
    return new BytesAbiBytes29(content)
  }

}

export namespace RawHexAbiBytes29 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes29 {
  readonly #class = RawHexAbiBytes29

  static readonly bytes = 29
  static readonly nibbles = 58
  static readonly bits = 232
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes29.Create) {
    return new RawHexAbiBytes29(value)
  }

  static fromOrThrow(value: RawHexAbiBytes29.From) {
    return new RawHexAbiBytes29(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes29`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes29.nibbles)

    cursor.offset += 64 - RawHexAbiBytes29.nibbles

    return new RawHexAbiBytes29(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes29.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes29.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes29.bytes
    
    return new RawHexAbiBytes29(value as RawHexString)
  }

}

export { AbiBytes30 as Bytes30 }
  
export type AbiBytes30 =
  | BytesAbiBytes30
  | ZeroHexAbiBytes30
  
export namespace AbiBytes30 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes30.Create
    | ZeroHexAbiBytes30.Create
  
  export type From = 
    | BytesAbiBytes30.From
    | ZeroHexAbiBytes30.From
  
  export function create(value: AbiBytes30.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes30.create(value)
    return ZeroHexAbiBytes30.create(value)
  }

  export function fromOrThrow(value: AbiBytes30.From) {
    return AbiBytes30.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes30`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes30.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes30.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes30 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes30 {
  readonly #class = BytesAbiBytes30

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes30.Create) {
    return new BytesAbiBytes30(value)
  }

  static fromOrThrow(value: BytesAbiBytes30.From) {
    return BytesAbiBytes30.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes30`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes30.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes30.nibbles

    return new BytesAbiBytes30(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes30.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes30.bytes)

    cursor.offset += 32 - BytesAbiBytes30.bytes
    
    return new BytesAbiBytes30(content)
  }

}

export namespace RawHexAbiBytes30 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes30 {
  readonly #class = RawHexAbiBytes30

  static readonly bytes = 30
  static readonly nibbles = 60
  static readonly bits = 240
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes30.Create) {
    return new RawHexAbiBytes30(value)
  }

  static fromOrThrow(value: RawHexAbiBytes30.From) {
    return new RawHexAbiBytes30(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes30`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes30.nibbles)

    cursor.offset += 64 - RawHexAbiBytes30.nibbles

    return new RawHexAbiBytes30(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes30.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes30.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes30.bytes
    
    return new RawHexAbiBytes30(value as RawHexString)
  }

}

export { AbiBytes31 as Bytes31 }
  
export type AbiBytes31 =
  | BytesAbiBytes31
  | ZeroHexAbiBytes31
  
export namespace AbiBytes31 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes31.Create
    | ZeroHexAbiBytes31.Create
  
  export type From = 
    | BytesAbiBytes31.From
    | ZeroHexAbiBytes31.From
  
  export function create(value: AbiBytes31.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes31.create(value)
    return ZeroHexAbiBytes31.create(value)
  }

  export function fromOrThrow(value: AbiBytes31.From) {
    return AbiBytes31.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes31`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes31.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes31.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes31 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes31 {
  readonly #class = BytesAbiBytes31

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes31.Create) {
    return new BytesAbiBytes31(value)
  }

  static fromOrThrow(value: BytesAbiBytes31.From) {
    return BytesAbiBytes31.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes31`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes31.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes31.nibbles

    return new BytesAbiBytes31(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes31.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes31.bytes)

    cursor.offset += 32 - BytesAbiBytes31.bytes
    
    return new BytesAbiBytes31(content)
  }

}

export namespace RawHexAbiBytes31 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes31 {
  readonly #class = RawHexAbiBytes31

  static readonly bytes = 31
  static readonly nibbles = 62
  static readonly bits = 248
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes31.Create) {
    return new RawHexAbiBytes31(value)
  }

  static fromOrThrow(value: RawHexAbiBytes31.From) {
    return new RawHexAbiBytes31(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes31`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes31.nibbles)

    cursor.offset += 64 - RawHexAbiBytes31.nibbles

    return new RawHexAbiBytes31(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes31.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes31.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes31.bytes
    
    return new RawHexAbiBytes31(value as RawHexString)
  }

}

export { AbiBytes32 as Bytes32 }
  
export type AbiBytes32 =
  | BytesAbiBytes32
  | ZeroHexAbiBytes32
  
export namespace AbiBytes32 {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes32.Create
    | ZeroHexAbiBytes32.Create
  
  export type From = 
    | BytesAbiBytes32.From
    | ZeroHexAbiBytes32.From
  
  export function create(value: AbiBytes32.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes32.create(value)
    return ZeroHexAbiBytes32.create(value)
  }

  export function fromOrThrow(value: AbiBytes32.From) {
    return AbiBytes32.create(value)
  }
  
  export function codegen() {
    return `Abi.Bytes32`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexAbiBytes32.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes32.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes32 {
  export type Create = Uint8Array
  export type From = Uint8Array
}

export class BytesAbiBytes32 {
  readonly #class = BytesAbiBytes32

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes32.Create) {
    return new BytesAbiBytes32(value)
  }

  static fromOrThrow(value: BytesAbiBytes32.From) {
    return BytesAbiBytes32.create(value)
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  toJSON(): ZeroHexString {
    return `0x${Base16.get().encodeOrThrow(this.value)}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes32.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesAbiBytes32.nibbles

    return new BytesAbiBytes32(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes32.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes32.bytes)

    cursor.offset += 32 - BytesAbiBytes32.bytes
    
    return new BytesAbiBytes32(content)
  }

}

export namespace RawHexAbiBytes32 {

  export type Create = RawHexString

  export type From =
    | string 
    | number
    | bigint 
    | Uint8Array
    | ZeroHexString

}

export class RawHexAbiBytes32 {
  readonly #class = RawHexAbiBytes32

  static readonly bytes = 32
  static readonly nibbles = 64
  static readonly bits = 256
  static readonly dynamic = false
  static readonly size = 32

  readonly bits = this.#class.bits
  readonly nibbles = this.#class.nibbles
  readonly bytes = this.#class.bytes
  readonly dynamic = this.#class.dynamic
  readonly size = this.#class.size

  private constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes32.Create) {
    return new RawHexAbiBytes32(value)
  }

  static fromOrThrow(value: RawHexAbiBytes32.From) {
    return new RawHexAbiBytes32(RawHexUtf8.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Base16.get().padEndAndDecodeOrThrow(this.value).copyAndDispose()
  }

  toJSON(): ZeroHexString {
    return `0x${this.value}` as ZeroHexString
  }

  static codegen() {
    return `Abi.Bytes32`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(RawHexAbiBytes32.nibbles)

    cursor.offset += 64 - RawHexAbiBytes32.nibbles

    return new RawHexAbiBytes32(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes32.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes32.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes32.bytes
    
    return new RawHexAbiBytes32(value as RawHexString)
  }

}

export type BytesByName = {
    bytes1: typeof AbiBytes1,
    bytes2: typeof AbiBytes2,
    bytes3: typeof AbiBytes3,
    bytes4: typeof AbiBytes4,
    bytes5: typeof AbiBytes5,
    bytes6: typeof AbiBytes6,
    bytes7: typeof AbiBytes7,
    bytes8: typeof AbiBytes8,
    bytes9: typeof AbiBytes9,
    bytes10: typeof AbiBytes10,
    bytes11: typeof AbiBytes11,
    bytes12: typeof AbiBytes12,
    bytes13: typeof AbiBytes13,
    bytes14: typeof AbiBytes14,
    bytes15: typeof AbiBytes15,
    bytes16: typeof AbiBytes16,
    bytes17: typeof AbiBytes17,
    bytes18: typeof AbiBytes18,
    bytes19: typeof AbiBytes19,
    bytes20: typeof AbiBytes20,
    bytes21: typeof AbiBytes21,
    bytes22: typeof AbiBytes22,
    bytes23: typeof AbiBytes23,
    bytes24: typeof AbiBytes24,
    bytes25: typeof AbiBytes25,
    bytes26: typeof AbiBytes26,
    bytes27: typeof AbiBytes27,
    bytes28: typeof AbiBytes28,
    bytes29: typeof AbiBytes29,
    bytes30: typeof AbiBytes30,
    bytes31: typeof AbiBytes31,
    bytes32: typeof AbiBytes32,
  }
  
  export const bytesByName: BytesByName = {
    bytes1: AbiBytes1,
    bytes2: AbiBytes2,
    bytes3: AbiBytes3,
    bytes4: AbiBytes4,
    bytes5: AbiBytes5,
    bytes6: AbiBytes6,
    bytes7: AbiBytes7,
    bytes8: AbiBytes8,
    bytes9: AbiBytes9,
    bytes10: AbiBytes10,
    bytes11: AbiBytes11,
    bytes12: AbiBytes12,
    bytes13: AbiBytes13,
    bytes14: AbiBytes14,
    bytes15: AbiBytes15,
    bytes16: AbiBytes16,
    bytes17: AbiBytes17,
    bytes18: AbiBytes18,
    bytes19: AbiBytes19,
    bytes20: AbiBytes20,
    bytes21: AbiBytes21,
    bytes22: AbiBytes22,
    bytes23: AbiBytes23,
    bytes24: AbiBytes24,
    bytes25: AbiBytes25,
    bytes26: AbiBytes26,
    bytes27: AbiBytes27,
    bytes28: AbiBytes28,
    bytes29: AbiBytes29,
    bytes30: AbiBytes30,
    bytes31: AbiBytes31,
    bytes32: AbiBytes32,
  } as const