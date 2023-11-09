import { Base16 } from "@hazae41/base16";
  import { Bytes } from "@hazae41/bytes";
  import { Cursor } from "@hazae41/cursor";
  import { TextCursor } from "libs/cursor/cursor.js";
  import { ZeroHexString } from "mods/types/zerohex/index.js";
  import { RawHexString } from "mods/types/rawhex/index.js";

export type StaticBytes1 =
  | BytesStaticBytes1
  | ZeroHexStaticBytes1
  
export namespace StaticBytes1 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes1.From
    | ZeroHexStaticBytes1.From
  
  export function create(value: StaticBytes1.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes1.create(value)
    return ZeroHexStaticBytes1.create(value)
  }

  export function from(value: StaticBytes1.From) {
    return StaticBytes1.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes1`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes1.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes1.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes1 {
  export type From = Uint8Array
}

export class BytesStaticBytes1 {
  readonly #class = BytesStaticBytes1
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes1.From) {
    return new BytesStaticBytes1(value)
  }

  static from(value: BytesStaticBytes1.From) {
    return BytesStaticBytes1.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes1.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes1.nibbles

    return new BytesStaticBytes1(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes1.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes1.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes1.bytes
    
    return new BytesStaticBytes1(bytes)
  }

}

export namespace ZeroHexStaticBytes1 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes1 {
  readonly #class = ZeroHexStaticBytes1
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes1.From) {
    return new ZeroHexStaticBytes1(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes1.From) {
    return ZeroHexStaticBytes1.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes1.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes1.nibbles

    return new ZeroHexStaticBytes1(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes1.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes1.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes1.bytes
    
    return new ZeroHexStaticBytes1(value)
  }

}

export type StaticBytes2 =
  | BytesStaticBytes2
  | ZeroHexStaticBytes2
  
export namespace StaticBytes2 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes2.From
    | ZeroHexStaticBytes2.From
  
  export function create(value: StaticBytes2.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes2.create(value)
    return ZeroHexStaticBytes2.create(value)
  }

  export function from(value: StaticBytes2.From) {
    return StaticBytes2.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes2`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes2.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes2.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes2 {
  export type From = Uint8Array
}

export class BytesStaticBytes2 {
  readonly #class = BytesStaticBytes2
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes2.From) {
    return new BytesStaticBytes2(value)
  }

  static from(value: BytesStaticBytes2.From) {
    return BytesStaticBytes2.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes2.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes2.nibbles

    return new BytesStaticBytes2(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes2.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes2.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes2.bytes
    
    return new BytesStaticBytes2(bytes)
  }

}

export namespace ZeroHexStaticBytes2 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes2 {
  readonly #class = ZeroHexStaticBytes2
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes2.From) {
    return new ZeroHexStaticBytes2(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes2.From) {
    return ZeroHexStaticBytes2.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes2.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes2.nibbles

    return new ZeroHexStaticBytes2(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes2.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes2.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes2.bytes
    
    return new ZeroHexStaticBytes2(value)
  }

}

export type StaticBytes3 =
  | BytesStaticBytes3
  | ZeroHexStaticBytes3
  
export namespace StaticBytes3 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes3.From
    | ZeroHexStaticBytes3.From
  
  export function create(value: StaticBytes3.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes3.create(value)
    return ZeroHexStaticBytes3.create(value)
  }

  export function from(value: StaticBytes3.From) {
    return StaticBytes3.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes3`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes3.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes3.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes3 {
  export type From = Uint8Array
}

export class BytesStaticBytes3 {
  readonly #class = BytesStaticBytes3
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes3.From) {
    return new BytesStaticBytes3(value)
  }

  static from(value: BytesStaticBytes3.From) {
    return BytesStaticBytes3.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes3.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes3.nibbles

    return new BytesStaticBytes3(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes3.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes3.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes3.bytes
    
    return new BytesStaticBytes3(bytes)
  }

}

export namespace ZeroHexStaticBytes3 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes3 {
  readonly #class = ZeroHexStaticBytes3
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes3.From) {
    return new ZeroHexStaticBytes3(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes3.From) {
    return ZeroHexStaticBytes3.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes3.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes3.nibbles

    return new ZeroHexStaticBytes3(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes3.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes3.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes3.bytes
    
    return new ZeroHexStaticBytes3(value)
  }

}

export type StaticBytes4 =
  | BytesStaticBytes4
  | ZeroHexStaticBytes4
  
export namespace StaticBytes4 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes4.From
    | ZeroHexStaticBytes4.From
  
  export function create(value: StaticBytes4.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes4.create(value)
    return ZeroHexStaticBytes4.create(value)
  }

  export function from(value: StaticBytes4.From) {
    return StaticBytes4.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes4`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes4.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes4.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes4 {
  export type From = Uint8Array
}

export class BytesStaticBytes4 {
  readonly #class = BytesStaticBytes4
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes4.From) {
    return new BytesStaticBytes4(value)
  }

  static from(value: BytesStaticBytes4.From) {
    return BytesStaticBytes4.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes4.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes4.nibbles

    return new BytesStaticBytes4(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes4.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes4.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes4.bytes
    
    return new BytesStaticBytes4(bytes)
  }

}

export namespace ZeroHexStaticBytes4 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes4 {
  readonly #class = ZeroHexStaticBytes4
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes4.From) {
    return new ZeroHexStaticBytes4(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes4.From) {
    return ZeroHexStaticBytes4.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes4.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes4.nibbles

    return new ZeroHexStaticBytes4(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes4.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes4.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes4.bytes
    
    return new ZeroHexStaticBytes4(value)
  }

}

export type StaticBytes5 =
  | BytesStaticBytes5
  | ZeroHexStaticBytes5
  
export namespace StaticBytes5 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes5.From
    | ZeroHexStaticBytes5.From
  
  export function create(value: StaticBytes5.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes5.create(value)
    return ZeroHexStaticBytes5.create(value)
  }

  export function from(value: StaticBytes5.From) {
    return StaticBytes5.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes5`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes5.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes5.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes5 {
  export type From = Uint8Array
}

export class BytesStaticBytes5 {
  readonly #class = BytesStaticBytes5
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes5.From) {
    return new BytesStaticBytes5(value)
  }

  static from(value: BytesStaticBytes5.From) {
    return BytesStaticBytes5.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes5.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes5.nibbles

    return new BytesStaticBytes5(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes5.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes5.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes5.bytes
    
    return new BytesStaticBytes5(bytes)
  }

}

export namespace ZeroHexStaticBytes5 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes5 {
  readonly #class = ZeroHexStaticBytes5
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes5.From) {
    return new ZeroHexStaticBytes5(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes5.From) {
    return ZeroHexStaticBytes5.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes5.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes5.nibbles

    return new ZeroHexStaticBytes5(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes5.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes5.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes5.bytes
    
    return new ZeroHexStaticBytes5(value)
  }

}

export type StaticBytes6 =
  | BytesStaticBytes6
  | ZeroHexStaticBytes6
  
export namespace StaticBytes6 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes6.From
    | ZeroHexStaticBytes6.From
  
  export function create(value: StaticBytes6.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes6.create(value)
    return ZeroHexStaticBytes6.create(value)
  }

  export function from(value: StaticBytes6.From) {
    return StaticBytes6.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes6`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes6.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes6.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes6 {
  export type From = Uint8Array
}

export class BytesStaticBytes6 {
  readonly #class = BytesStaticBytes6
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes6.From) {
    return new BytesStaticBytes6(value)
  }

  static from(value: BytesStaticBytes6.From) {
    return BytesStaticBytes6.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes6.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes6.nibbles

    return new BytesStaticBytes6(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes6.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes6.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes6.bytes
    
    return new BytesStaticBytes6(bytes)
  }

}

export namespace ZeroHexStaticBytes6 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes6 {
  readonly #class = ZeroHexStaticBytes6
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes6.From) {
    return new ZeroHexStaticBytes6(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes6.From) {
    return ZeroHexStaticBytes6.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes6.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes6.nibbles

    return new ZeroHexStaticBytes6(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes6.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes6.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes6.bytes
    
    return new ZeroHexStaticBytes6(value)
  }

}

export type StaticBytes7 =
  | BytesStaticBytes7
  | ZeroHexStaticBytes7
  
export namespace StaticBytes7 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes7.From
    | ZeroHexStaticBytes7.From
  
  export function create(value: StaticBytes7.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes7.create(value)
    return ZeroHexStaticBytes7.create(value)
  }

  export function from(value: StaticBytes7.From) {
    return StaticBytes7.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes7`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes7.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes7.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes7 {
  export type From = Uint8Array
}

export class BytesStaticBytes7 {
  readonly #class = BytesStaticBytes7
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes7.From) {
    return new BytesStaticBytes7(value)
  }

  static from(value: BytesStaticBytes7.From) {
    return BytesStaticBytes7.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes7.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes7.nibbles

    return new BytesStaticBytes7(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes7.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes7.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes7.bytes
    
    return new BytesStaticBytes7(bytes)
  }

}

export namespace ZeroHexStaticBytes7 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes7 {
  readonly #class = ZeroHexStaticBytes7
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes7.From) {
    return new ZeroHexStaticBytes7(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes7.From) {
    return ZeroHexStaticBytes7.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes7.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes7.nibbles

    return new ZeroHexStaticBytes7(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes7.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes7.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes7.bytes
    
    return new ZeroHexStaticBytes7(value)
  }

}

export type StaticBytes8 =
  | BytesStaticBytes8
  | ZeroHexStaticBytes8
  
export namespace StaticBytes8 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes8.From
    | ZeroHexStaticBytes8.From
  
  export function create(value: StaticBytes8.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes8.create(value)
    return ZeroHexStaticBytes8.create(value)
  }

  export function from(value: StaticBytes8.From) {
    return StaticBytes8.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes8`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes8.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes8.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes8 {
  export type From = Uint8Array
}

export class BytesStaticBytes8 {
  readonly #class = BytesStaticBytes8
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes8.From) {
    return new BytesStaticBytes8(value)
  }

  static from(value: BytesStaticBytes8.From) {
    return BytesStaticBytes8.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes8.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes8.nibbles

    return new BytesStaticBytes8(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes8.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes8.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes8.bytes
    
    return new BytesStaticBytes8(bytes)
  }

}

export namespace ZeroHexStaticBytes8 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes8 {
  readonly #class = ZeroHexStaticBytes8
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes8.From) {
    return new ZeroHexStaticBytes8(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes8.From) {
    return ZeroHexStaticBytes8.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes8.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes8.nibbles

    return new ZeroHexStaticBytes8(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes8.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes8.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes8.bytes
    
    return new ZeroHexStaticBytes8(value)
  }

}

export type StaticBytes9 =
  | BytesStaticBytes9
  | ZeroHexStaticBytes9
  
export namespace StaticBytes9 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes9.From
    | ZeroHexStaticBytes9.From
  
  export function create(value: StaticBytes9.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes9.create(value)
    return ZeroHexStaticBytes9.create(value)
  }

  export function from(value: StaticBytes9.From) {
    return StaticBytes9.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes9`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes9.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes9.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes9 {
  export type From = Uint8Array
}

export class BytesStaticBytes9 {
  readonly #class = BytesStaticBytes9
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes9.From) {
    return new BytesStaticBytes9(value)
  }

  static from(value: BytesStaticBytes9.From) {
    return BytesStaticBytes9.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes9.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes9.nibbles

    return new BytesStaticBytes9(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes9.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes9.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes9.bytes
    
    return new BytesStaticBytes9(bytes)
  }

}

export namespace ZeroHexStaticBytes9 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes9 {
  readonly #class = ZeroHexStaticBytes9
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes9.From) {
    return new ZeroHexStaticBytes9(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes9.From) {
    return ZeroHexStaticBytes9.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes9.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes9.nibbles

    return new ZeroHexStaticBytes9(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes9.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes9.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes9.bytes
    
    return new ZeroHexStaticBytes9(value)
  }

}

export type StaticBytes10 =
  | BytesStaticBytes10
  | ZeroHexStaticBytes10
  
export namespace StaticBytes10 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes10.From
    | ZeroHexStaticBytes10.From
  
  export function create(value: StaticBytes10.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes10.create(value)
    return ZeroHexStaticBytes10.create(value)
  }

  export function from(value: StaticBytes10.From) {
    return StaticBytes10.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes10`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes10.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes10.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes10 {
  export type From = Uint8Array
}

export class BytesStaticBytes10 {
  readonly #class = BytesStaticBytes10
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes10.From) {
    return new BytesStaticBytes10(value)
  }

  static from(value: BytesStaticBytes10.From) {
    return BytesStaticBytes10.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes10.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes10.nibbles

    return new BytesStaticBytes10(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes10.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes10.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes10.bytes
    
    return new BytesStaticBytes10(bytes)
  }

}

export namespace ZeroHexStaticBytes10 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes10 {
  readonly #class = ZeroHexStaticBytes10
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes10.From) {
    return new ZeroHexStaticBytes10(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes10.From) {
    return ZeroHexStaticBytes10.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes10.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes10.nibbles

    return new ZeroHexStaticBytes10(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes10.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes10.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes10.bytes
    
    return new ZeroHexStaticBytes10(value)
  }

}

export type StaticBytes11 =
  | BytesStaticBytes11
  | ZeroHexStaticBytes11
  
export namespace StaticBytes11 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes11.From
    | ZeroHexStaticBytes11.From
  
  export function create(value: StaticBytes11.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes11.create(value)
    return ZeroHexStaticBytes11.create(value)
  }

  export function from(value: StaticBytes11.From) {
    return StaticBytes11.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes11`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes11.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes11.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes11 {
  export type From = Uint8Array
}

export class BytesStaticBytes11 {
  readonly #class = BytesStaticBytes11
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes11.From) {
    return new BytesStaticBytes11(value)
  }

  static from(value: BytesStaticBytes11.From) {
    return BytesStaticBytes11.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes11.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes11.nibbles

    return new BytesStaticBytes11(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes11.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes11.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes11.bytes
    
    return new BytesStaticBytes11(bytes)
  }

}

export namespace ZeroHexStaticBytes11 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes11 {
  readonly #class = ZeroHexStaticBytes11
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes11.From) {
    return new ZeroHexStaticBytes11(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes11.From) {
    return ZeroHexStaticBytes11.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes11.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes11.nibbles

    return new ZeroHexStaticBytes11(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes11.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes11.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes11.bytes
    
    return new ZeroHexStaticBytes11(value)
  }

}

export type StaticBytes12 =
  | BytesStaticBytes12
  | ZeroHexStaticBytes12
  
export namespace StaticBytes12 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes12.From
    | ZeroHexStaticBytes12.From
  
  export function create(value: StaticBytes12.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes12.create(value)
    return ZeroHexStaticBytes12.create(value)
  }

  export function from(value: StaticBytes12.From) {
    return StaticBytes12.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes12`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes12.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes12.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes12 {
  export type From = Uint8Array
}

export class BytesStaticBytes12 {
  readonly #class = BytesStaticBytes12
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes12.From) {
    return new BytesStaticBytes12(value)
  }

  static from(value: BytesStaticBytes12.From) {
    return BytesStaticBytes12.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes12.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes12.nibbles

    return new BytesStaticBytes12(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes12.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes12.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes12.bytes
    
    return new BytesStaticBytes12(bytes)
  }

}

export namespace ZeroHexStaticBytes12 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes12 {
  readonly #class = ZeroHexStaticBytes12
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes12.From) {
    return new ZeroHexStaticBytes12(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes12.From) {
    return ZeroHexStaticBytes12.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes12.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes12.nibbles

    return new ZeroHexStaticBytes12(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes12.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes12.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes12.bytes
    
    return new ZeroHexStaticBytes12(value)
  }

}

export type StaticBytes13 =
  | BytesStaticBytes13
  | ZeroHexStaticBytes13
  
export namespace StaticBytes13 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes13.From
    | ZeroHexStaticBytes13.From
  
  export function create(value: StaticBytes13.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes13.create(value)
    return ZeroHexStaticBytes13.create(value)
  }

  export function from(value: StaticBytes13.From) {
    return StaticBytes13.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes13`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes13.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes13.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes13 {
  export type From = Uint8Array
}

export class BytesStaticBytes13 {
  readonly #class = BytesStaticBytes13
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes13.From) {
    return new BytesStaticBytes13(value)
  }

  static from(value: BytesStaticBytes13.From) {
    return BytesStaticBytes13.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes13.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes13.nibbles

    return new BytesStaticBytes13(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes13.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes13.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes13.bytes
    
    return new BytesStaticBytes13(bytes)
  }

}

export namespace ZeroHexStaticBytes13 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes13 {
  readonly #class = ZeroHexStaticBytes13
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes13.From) {
    return new ZeroHexStaticBytes13(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes13.From) {
    return ZeroHexStaticBytes13.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes13.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes13.nibbles

    return new ZeroHexStaticBytes13(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes13.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes13.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes13.bytes
    
    return new ZeroHexStaticBytes13(value)
  }

}

export type StaticBytes14 =
  | BytesStaticBytes14
  | ZeroHexStaticBytes14
  
export namespace StaticBytes14 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes14.From
    | ZeroHexStaticBytes14.From
  
  export function create(value: StaticBytes14.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes14.create(value)
    return ZeroHexStaticBytes14.create(value)
  }

  export function from(value: StaticBytes14.From) {
    return StaticBytes14.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes14`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes14.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes14.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes14 {
  export type From = Uint8Array
}

export class BytesStaticBytes14 {
  readonly #class = BytesStaticBytes14
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes14.From) {
    return new BytesStaticBytes14(value)
  }

  static from(value: BytesStaticBytes14.From) {
    return BytesStaticBytes14.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes14.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes14.nibbles

    return new BytesStaticBytes14(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes14.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes14.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes14.bytes
    
    return new BytesStaticBytes14(bytes)
  }

}

export namespace ZeroHexStaticBytes14 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes14 {
  readonly #class = ZeroHexStaticBytes14
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes14.From) {
    return new ZeroHexStaticBytes14(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes14.From) {
    return ZeroHexStaticBytes14.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes14.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes14.nibbles

    return new ZeroHexStaticBytes14(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes14.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes14.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes14.bytes
    
    return new ZeroHexStaticBytes14(value)
  }

}

export type StaticBytes15 =
  | BytesStaticBytes15
  | ZeroHexStaticBytes15
  
export namespace StaticBytes15 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes15.From
    | ZeroHexStaticBytes15.From
  
  export function create(value: StaticBytes15.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes15.create(value)
    return ZeroHexStaticBytes15.create(value)
  }

  export function from(value: StaticBytes15.From) {
    return StaticBytes15.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes15`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes15.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes15.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes15 {
  export type From = Uint8Array
}

export class BytesStaticBytes15 {
  readonly #class = BytesStaticBytes15
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes15.From) {
    return new BytesStaticBytes15(value)
  }

  static from(value: BytesStaticBytes15.From) {
    return BytesStaticBytes15.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes15.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes15.nibbles

    return new BytesStaticBytes15(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes15.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes15.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes15.bytes
    
    return new BytesStaticBytes15(bytes)
  }

}

export namespace ZeroHexStaticBytes15 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes15 {
  readonly #class = ZeroHexStaticBytes15
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes15.From) {
    return new ZeroHexStaticBytes15(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes15.From) {
    return ZeroHexStaticBytes15.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes15.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes15.nibbles

    return new ZeroHexStaticBytes15(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes15.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes15.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes15.bytes
    
    return new ZeroHexStaticBytes15(value)
  }

}

export type StaticBytes16 =
  | BytesStaticBytes16
  | ZeroHexStaticBytes16
  
export namespace StaticBytes16 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes16.From
    | ZeroHexStaticBytes16.From
  
  export function create(value: StaticBytes16.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes16.create(value)
    return ZeroHexStaticBytes16.create(value)
  }

  export function from(value: StaticBytes16.From) {
    return StaticBytes16.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes16`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes16.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes16.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes16 {
  export type From = Uint8Array
}

export class BytesStaticBytes16 {
  readonly #class = BytesStaticBytes16
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes16.From) {
    return new BytesStaticBytes16(value)
  }

  static from(value: BytesStaticBytes16.From) {
    return BytesStaticBytes16.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes16.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes16.nibbles

    return new BytesStaticBytes16(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes16.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes16.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes16.bytes
    
    return new BytesStaticBytes16(bytes)
  }

}

export namespace ZeroHexStaticBytes16 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes16 {
  readonly #class = ZeroHexStaticBytes16
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes16.From) {
    return new ZeroHexStaticBytes16(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes16.From) {
    return ZeroHexStaticBytes16.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes16.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes16.nibbles

    return new ZeroHexStaticBytes16(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes16.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes16.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes16.bytes
    
    return new ZeroHexStaticBytes16(value)
  }

}

export type StaticBytes17 =
  | BytesStaticBytes17
  | ZeroHexStaticBytes17
  
export namespace StaticBytes17 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes17.From
    | ZeroHexStaticBytes17.From
  
  export function create(value: StaticBytes17.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes17.create(value)
    return ZeroHexStaticBytes17.create(value)
  }

  export function from(value: StaticBytes17.From) {
    return StaticBytes17.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes17`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes17.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes17.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes17 {
  export type From = Uint8Array
}

export class BytesStaticBytes17 {
  readonly #class = BytesStaticBytes17
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes17.From) {
    return new BytesStaticBytes17(value)
  }

  static from(value: BytesStaticBytes17.From) {
    return BytesStaticBytes17.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes17.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes17.nibbles

    return new BytesStaticBytes17(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes17.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes17.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes17.bytes
    
    return new BytesStaticBytes17(bytes)
  }

}

export namespace ZeroHexStaticBytes17 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes17 {
  readonly #class = ZeroHexStaticBytes17
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes17.From) {
    return new ZeroHexStaticBytes17(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes17.From) {
    return ZeroHexStaticBytes17.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes17.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes17.nibbles

    return new ZeroHexStaticBytes17(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes17.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes17.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes17.bytes
    
    return new ZeroHexStaticBytes17(value)
  }

}

export type StaticBytes18 =
  | BytesStaticBytes18
  | ZeroHexStaticBytes18
  
export namespace StaticBytes18 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes18.From
    | ZeroHexStaticBytes18.From
  
  export function create(value: StaticBytes18.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes18.create(value)
    return ZeroHexStaticBytes18.create(value)
  }

  export function from(value: StaticBytes18.From) {
    return StaticBytes18.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes18`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes18.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes18.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes18 {
  export type From = Uint8Array
}

export class BytesStaticBytes18 {
  readonly #class = BytesStaticBytes18
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes18.From) {
    return new BytesStaticBytes18(value)
  }

  static from(value: BytesStaticBytes18.From) {
    return BytesStaticBytes18.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes18.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes18.nibbles

    return new BytesStaticBytes18(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes18.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes18.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes18.bytes
    
    return new BytesStaticBytes18(bytes)
  }

}

export namespace ZeroHexStaticBytes18 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes18 {
  readonly #class = ZeroHexStaticBytes18
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes18.From) {
    return new ZeroHexStaticBytes18(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes18.From) {
    return ZeroHexStaticBytes18.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes18.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes18.nibbles

    return new ZeroHexStaticBytes18(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes18.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes18.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes18.bytes
    
    return new ZeroHexStaticBytes18(value)
  }

}

export type StaticBytes19 =
  | BytesStaticBytes19
  | ZeroHexStaticBytes19
  
export namespace StaticBytes19 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes19.From
    | ZeroHexStaticBytes19.From
  
  export function create(value: StaticBytes19.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes19.create(value)
    return ZeroHexStaticBytes19.create(value)
  }

  export function from(value: StaticBytes19.From) {
    return StaticBytes19.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes19`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes19.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes19.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes19 {
  export type From = Uint8Array
}

export class BytesStaticBytes19 {
  readonly #class = BytesStaticBytes19
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes19.From) {
    return new BytesStaticBytes19(value)
  }

  static from(value: BytesStaticBytes19.From) {
    return BytesStaticBytes19.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes19.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes19.nibbles

    return new BytesStaticBytes19(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes19.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes19.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes19.bytes
    
    return new BytesStaticBytes19(bytes)
  }

}

export namespace ZeroHexStaticBytes19 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes19 {
  readonly #class = ZeroHexStaticBytes19
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes19.From) {
    return new ZeroHexStaticBytes19(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes19.From) {
    return ZeroHexStaticBytes19.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes19.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes19.nibbles

    return new ZeroHexStaticBytes19(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes19.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes19.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes19.bytes
    
    return new ZeroHexStaticBytes19(value)
  }

}

export type StaticBytes20 =
  | BytesStaticBytes20
  | ZeroHexStaticBytes20
  
export namespace StaticBytes20 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes20.From
    | ZeroHexStaticBytes20.From
  
  export function create(value: StaticBytes20.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes20.create(value)
    return ZeroHexStaticBytes20.create(value)
  }

  export function from(value: StaticBytes20.From) {
    return StaticBytes20.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes20`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes20.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes20.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes20 {
  export type From = Uint8Array
}

export class BytesStaticBytes20 {
  readonly #class = BytesStaticBytes20
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes20.From) {
    return new BytesStaticBytes20(value)
  }

  static from(value: BytesStaticBytes20.From) {
    return BytesStaticBytes20.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes20.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes20.nibbles

    return new BytesStaticBytes20(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes20.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes20.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes20.bytes
    
    return new BytesStaticBytes20(bytes)
  }

}

export namespace ZeroHexStaticBytes20 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes20 {
  readonly #class = ZeroHexStaticBytes20
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes20.From) {
    return new ZeroHexStaticBytes20(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes20.From) {
    return ZeroHexStaticBytes20.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes20.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes20.nibbles

    return new ZeroHexStaticBytes20(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes20.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes20.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes20.bytes
    
    return new ZeroHexStaticBytes20(value)
  }

}

export type StaticBytes21 =
  | BytesStaticBytes21
  | ZeroHexStaticBytes21
  
export namespace StaticBytes21 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes21.From
    | ZeroHexStaticBytes21.From
  
  export function create(value: StaticBytes21.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes21.create(value)
    return ZeroHexStaticBytes21.create(value)
  }

  export function from(value: StaticBytes21.From) {
    return StaticBytes21.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes21`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes21.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes21.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes21 {
  export type From = Uint8Array
}

export class BytesStaticBytes21 {
  readonly #class = BytesStaticBytes21
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes21.From) {
    return new BytesStaticBytes21(value)
  }

  static from(value: BytesStaticBytes21.From) {
    return BytesStaticBytes21.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes21.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes21.nibbles

    return new BytesStaticBytes21(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes21.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes21.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes21.bytes
    
    return new BytesStaticBytes21(bytes)
  }

}

export namespace ZeroHexStaticBytes21 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes21 {
  readonly #class = ZeroHexStaticBytes21
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes21.From) {
    return new ZeroHexStaticBytes21(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes21.From) {
    return ZeroHexStaticBytes21.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes21.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes21.nibbles

    return new ZeroHexStaticBytes21(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes21.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes21.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes21.bytes
    
    return new ZeroHexStaticBytes21(value)
  }

}

export type StaticBytes22 =
  | BytesStaticBytes22
  | ZeroHexStaticBytes22
  
export namespace StaticBytes22 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes22.From
    | ZeroHexStaticBytes22.From
  
  export function create(value: StaticBytes22.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes22.create(value)
    return ZeroHexStaticBytes22.create(value)
  }

  export function from(value: StaticBytes22.From) {
    return StaticBytes22.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes22`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes22.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes22.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes22 {
  export type From = Uint8Array
}

export class BytesStaticBytes22 {
  readonly #class = BytesStaticBytes22
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes22.From) {
    return new BytesStaticBytes22(value)
  }

  static from(value: BytesStaticBytes22.From) {
    return BytesStaticBytes22.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes22.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes22.nibbles

    return new BytesStaticBytes22(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes22.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes22.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes22.bytes
    
    return new BytesStaticBytes22(bytes)
  }

}

export namespace ZeroHexStaticBytes22 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes22 {
  readonly #class = ZeroHexStaticBytes22
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes22.From) {
    return new ZeroHexStaticBytes22(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes22.From) {
    return ZeroHexStaticBytes22.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes22.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes22.nibbles

    return new ZeroHexStaticBytes22(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes22.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes22.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes22.bytes
    
    return new ZeroHexStaticBytes22(value)
  }

}

export type StaticBytes23 =
  | BytesStaticBytes23
  | ZeroHexStaticBytes23
  
export namespace StaticBytes23 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes23.From
    | ZeroHexStaticBytes23.From
  
  export function create(value: StaticBytes23.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes23.create(value)
    return ZeroHexStaticBytes23.create(value)
  }

  export function from(value: StaticBytes23.From) {
    return StaticBytes23.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes23`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes23.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes23.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes23 {
  export type From = Uint8Array
}

export class BytesStaticBytes23 {
  readonly #class = BytesStaticBytes23
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes23.From) {
    return new BytesStaticBytes23(value)
  }

  static from(value: BytesStaticBytes23.From) {
    return BytesStaticBytes23.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes23.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes23.nibbles

    return new BytesStaticBytes23(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes23.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes23.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes23.bytes
    
    return new BytesStaticBytes23(bytes)
  }

}

export namespace ZeroHexStaticBytes23 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes23 {
  readonly #class = ZeroHexStaticBytes23
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes23.From) {
    return new ZeroHexStaticBytes23(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes23.From) {
    return ZeroHexStaticBytes23.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes23.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes23.nibbles

    return new ZeroHexStaticBytes23(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes23.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes23.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes23.bytes
    
    return new ZeroHexStaticBytes23(value)
  }

}

export type StaticBytes24 =
  | BytesStaticBytes24
  | ZeroHexStaticBytes24
  
export namespace StaticBytes24 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes24.From
    | ZeroHexStaticBytes24.From
  
  export function create(value: StaticBytes24.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes24.create(value)
    return ZeroHexStaticBytes24.create(value)
  }

  export function from(value: StaticBytes24.From) {
    return StaticBytes24.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes24`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes24.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes24.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes24 {
  export type From = Uint8Array
}

export class BytesStaticBytes24 {
  readonly #class = BytesStaticBytes24
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes24.From) {
    return new BytesStaticBytes24(value)
  }

  static from(value: BytesStaticBytes24.From) {
    return BytesStaticBytes24.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes24.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes24.nibbles

    return new BytesStaticBytes24(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes24.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes24.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes24.bytes
    
    return new BytesStaticBytes24(bytes)
  }

}

export namespace ZeroHexStaticBytes24 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes24 {
  readonly #class = ZeroHexStaticBytes24
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes24.From) {
    return new ZeroHexStaticBytes24(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes24.From) {
    return ZeroHexStaticBytes24.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes24.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes24.nibbles

    return new ZeroHexStaticBytes24(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes24.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes24.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes24.bytes
    
    return new ZeroHexStaticBytes24(value)
  }

}

export type StaticBytes25 =
  | BytesStaticBytes25
  | ZeroHexStaticBytes25
  
export namespace StaticBytes25 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes25.From
    | ZeroHexStaticBytes25.From
  
  export function create(value: StaticBytes25.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes25.create(value)
    return ZeroHexStaticBytes25.create(value)
  }

  export function from(value: StaticBytes25.From) {
    return StaticBytes25.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes25`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes25.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes25.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes25 {
  export type From = Uint8Array
}

export class BytesStaticBytes25 {
  readonly #class = BytesStaticBytes25
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes25.From) {
    return new BytesStaticBytes25(value)
  }

  static from(value: BytesStaticBytes25.From) {
    return BytesStaticBytes25.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes25.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes25.nibbles

    return new BytesStaticBytes25(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes25.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes25.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes25.bytes
    
    return new BytesStaticBytes25(bytes)
  }

}

export namespace ZeroHexStaticBytes25 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes25 {
  readonly #class = ZeroHexStaticBytes25
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes25.From) {
    return new ZeroHexStaticBytes25(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes25.From) {
    return ZeroHexStaticBytes25.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes25.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes25.nibbles

    return new ZeroHexStaticBytes25(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes25.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes25.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes25.bytes
    
    return new ZeroHexStaticBytes25(value)
  }

}

export type StaticBytes26 =
  | BytesStaticBytes26
  | ZeroHexStaticBytes26
  
export namespace StaticBytes26 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes26.From
    | ZeroHexStaticBytes26.From
  
  export function create(value: StaticBytes26.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes26.create(value)
    return ZeroHexStaticBytes26.create(value)
  }

  export function from(value: StaticBytes26.From) {
    return StaticBytes26.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes26`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes26.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes26.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes26 {
  export type From = Uint8Array
}

export class BytesStaticBytes26 {
  readonly #class = BytesStaticBytes26
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes26.From) {
    return new BytesStaticBytes26(value)
  }

  static from(value: BytesStaticBytes26.From) {
    return BytesStaticBytes26.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes26.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes26.nibbles

    return new BytesStaticBytes26(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes26.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes26.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes26.bytes
    
    return new BytesStaticBytes26(bytes)
  }

}

export namespace ZeroHexStaticBytes26 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes26 {
  readonly #class = ZeroHexStaticBytes26
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes26.From) {
    return new ZeroHexStaticBytes26(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes26.From) {
    return ZeroHexStaticBytes26.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes26.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes26.nibbles

    return new ZeroHexStaticBytes26(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes26.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes26.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes26.bytes
    
    return new ZeroHexStaticBytes26(value)
  }

}

export type StaticBytes27 =
  | BytesStaticBytes27
  | ZeroHexStaticBytes27
  
export namespace StaticBytes27 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes27.From
    | ZeroHexStaticBytes27.From
  
  export function create(value: StaticBytes27.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes27.create(value)
    return ZeroHexStaticBytes27.create(value)
  }

  export function from(value: StaticBytes27.From) {
    return StaticBytes27.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes27`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes27.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes27.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes27 {
  export type From = Uint8Array
}

export class BytesStaticBytes27 {
  readonly #class = BytesStaticBytes27
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes27.From) {
    return new BytesStaticBytes27(value)
  }

  static from(value: BytesStaticBytes27.From) {
    return BytesStaticBytes27.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes27.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes27.nibbles

    return new BytesStaticBytes27(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes27.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes27.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes27.bytes
    
    return new BytesStaticBytes27(bytes)
  }

}

export namespace ZeroHexStaticBytes27 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes27 {
  readonly #class = ZeroHexStaticBytes27
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes27.From) {
    return new ZeroHexStaticBytes27(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes27.From) {
    return ZeroHexStaticBytes27.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes27.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes27.nibbles

    return new ZeroHexStaticBytes27(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes27.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes27.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes27.bytes
    
    return new ZeroHexStaticBytes27(value)
  }

}

export type StaticBytes28 =
  | BytesStaticBytes28
  | ZeroHexStaticBytes28
  
export namespace StaticBytes28 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes28.From
    | ZeroHexStaticBytes28.From
  
  export function create(value: StaticBytes28.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes28.create(value)
    return ZeroHexStaticBytes28.create(value)
  }

  export function from(value: StaticBytes28.From) {
    return StaticBytes28.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes28`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes28.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes28.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes28 {
  export type From = Uint8Array
}

export class BytesStaticBytes28 {
  readonly #class = BytesStaticBytes28
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes28.From) {
    return new BytesStaticBytes28(value)
  }

  static from(value: BytesStaticBytes28.From) {
    return BytesStaticBytes28.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes28.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes28.nibbles

    return new BytesStaticBytes28(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes28.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes28.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes28.bytes
    
    return new BytesStaticBytes28(bytes)
  }

}

export namespace ZeroHexStaticBytes28 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes28 {
  readonly #class = ZeroHexStaticBytes28
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes28.From) {
    return new ZeroHexStaticBytes28(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes28.From) {
    return ZeroHexStaticBytes28.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes28.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes28.nibbles

    return new ZeroHexStaticBytes28(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes28.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes28.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes28.bytes
    
    return new ZeroHexStaticBytes28(value)
  }

}

export type StaticBytes29 =
  | BytesStaticBytes29
  | ZeroHexStaticBytes29
  
export namespace StaticBytes29 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes29.From
    | ZeroHexStaticBytes29.From
  
  export function create(value: StaticBytes29.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes29.create(value)
    return ZeroHexStaticBytes29.create(value)
  }

  export function from(value: StaticBytes29.From) {
    return StaticBytes29.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes29`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes29.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes29.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes29 {
  export type From = Uint8Array
}

export class BytesStaticBytes29 {
  readonly #class = BytesStaticBytes29
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes29.From) {
    return new BytesStaticBytes29(value)
  }

  static from(value: BytesStaticBytes29.From) {
    return BytesStaticBytes29.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes29.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes29.nibbles

    return new BytesStaticBytes29(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes29.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes29.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes29.bytes
    
    return new BytesStaticBytes29(bytes)
  }

}

export namespace ZeroHexStaticBytes29 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes29 {
  readonly #class = ZeroHexStaticBytes29
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes29.From) {
    return new ZeroHexStaticBytes29(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes29.From) {
    return ZeroHexStaticBytes29.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes29.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes29.nibbles

    return new ZeroHexStaticBytes29(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes29.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes29.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes29.bytes
    
    return new ZeroHexStaticBytes29(value)
  }

}

export type StaticBytes30 =
  | BytesStaticBytes30
  | ZeroHexStaticBytes30
  
export namespace StaticBytes30 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes30.From
    | ZeroHexStaticBytes30.From
  
  export function create(value: StaticBytes30.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes30.create(value)
    return ZeroHexStaticBytes30.create(value)
  }

  export function from(value: StaticBytes30.From) {
    return StaticBytes30.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes30`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes30.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes30.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes30 {
  export type From = Uint8Array
}

export class BytesStaticBytes30 {
  readonly #class = BytesStaticBytes30
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes30.From) {
    return new BytesStaticBytes30(value)
  }

  static from(value: BytesStaticBytes30.From) {
    return BytesStaticBytes30.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes30.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes30.nibbles

    return new BytesStaticBytes30(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes30.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes30.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes30.bytes
    
    return new BytesStaticBytes30(bytes)
  }

}

export namespace ZeroHexStaticBytes30 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes30 {
  readonly #class = ZeroHexStaticBytes30
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes30.From) {
    return new ZeroHexStaticBytes30(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes30.From) {
    return ZeroHexStaticBytes30.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes30.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes30.nibbles

    return new ZeroHexStaticBytes30(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes30.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes30.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes30.bytes
    
    return new ZeroHexStaticBytes30(value)
  }

}

export type StaticBytes31 =
  | BytesStaticBytes31
  | ZeroHexStaticBytes31
  
export namespace StaticBytes31 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes31.From
    | ZeroHexStaticBytes31.From
  
  export function create(value: StaticBytes31.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes31.create(value)
    return ZeroHexStaticBytes31.create(value)
  }

  export function from(value: StaticBytes31.From) {
    return StaticBytes31.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes31`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes31.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes31.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes31 {
  export type From = Uint8Array
}

export class BytesStaticBytes31 {
  readonly #class = BytesStaticBytes31
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes31.From) {
    return new BytesStaticBytes31(value)
  }

  static from(value: BytesStaticBytes31.From) {
    return BytesStaticBytes31.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes31.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes31.nibbles

    return new BytesStaticBytes31(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes31.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes31.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes31.bytes
    
    return new BytesStaticBytes31(bytes)
  }

}

export namespace ZeroHexStaticBytes31 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes31 {
  readonly #class = ZeroHexStaticBytes31
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes31.From) {
    return new ZeroHexStaticBytes31(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes31.From) {
    return ZeroHexStaticBytes31.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes31.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes31.nibbles

    return new ZeroHexStaticBytes31(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes31.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes31.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes31.bytes
    
    return new ZeroHexStaticBytes31(value)
  }

}

export type StaticBytes32 =
  | BytesStaticBytes32
  | ZeroHexStaticBytes32
  
export namespace StaticBytes32 {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes32.From
    | ZeroHexStaticBytes32.From
  
  export function create(value: StaticBytes32.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes32.create(value)
    return ZeroHexStaticBytes32.create(value)
  }

  export function from(value: StaticBytes32.From) {
    return StaticBytes32.create(value)
  }
  
  export function codegen() {
    return `Cubane.Abi.Bytes32`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes32.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes32.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes32 {
  export type From = Uint8Array
}

export class BytesStaticBytes32 {
  readonly #class = BytesStaticBytes32
  readonly name = this.#class.name

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

  static create(value: BytesStaticBytes32.From) {
    return new BytesStaticBytes32(value)
  }

  static from(value: BytesStaticBytes32.From) {
    return BytesStaticBytes32.create(value)
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

  encodeOrThrow() {
    return Base16.get().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesStaticBytes32.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes32.nibbles

    return new BytesStaticBytes32(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes32.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes32.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes32.bytes
    
    return new BytesStaticBytes32(bytes)
  }

}

export namespace ZeroHexStaticBytes32 {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes32 {
  readonly #class = ZeroHexStaticBytes32
  readonly name = this.#class.name

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

  static create(value: ZeroHexStaticBytes32.From) {
    return new ZeroHexStaticBytes32(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes32.From) {
    return ZeroHexStaticBytes32.create(value)
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

  encodeOrThrow() {
    return this.value.padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return this.value
  }

  static decodeOrThrow(cursor: TextCursor) {
    const value = cursor.readOrThrow(ZeroHexStaticBytes32.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes32.nibbles

    return new ZeroHexStaticBytes32(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes32.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes32.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes32.bytes
    
    return new ZeroHexStaticBytes32(value)
  }

}

export type BytesByName = {
    bytes1: typeof StaticBytes1,
    bytes2: typeof StaticBytes2,
    bytes3: typeof StaticBytes3,
    bytes4: typeof StaticBytes4,
    bytes5: typeof StaticBytes5,
    bytes6: typeof StaticBytes6,
    bytes7: typeof StaticBytes7,
    bytes8: typeof StaticBytes8,
    bytes9: typeof StaticBytes9,
    bytes10: typeof StaticBytes10,
    bytes11: typeof StaticBytes11,
    bytes12: typeof StaticBytes12,
    bytes13: typeof StaticBytes13,
    bytes14: typeof StaticBytes14,
    bytes15: typeof StaticBytes15,
    bytes16: typeof StaticBytes16,
    bytes17: typeof StaticBytes17,
    bytes18: typeof StaticBytes18,
    bytes19: typeof StaticBytes19,
    bytes20: typeof StaticBytes20,
    bytes21: typeof StaticBytes21,
    bytes22: typeof StaticBytes22,
    bytes23: typeof StaticBytes23,
    bytes24: typeof StaticBytes24,
    bytes25: typeof StaticBytes25,
    bytes26: typeof StaticBytes26,
    bytes27: typeof StaticBytes27,
    bytes28: typeof StaticBytes28,
    bytes29: typeof StaticBytes29,
    bytes30: typeof StaticBytes30,
    bytes31: typeof StaticBytes31,
    bytes32: typeof StaticBytes32,
  }
  
  export const bytesByName: BytesByName = {
    bytes1: StaticBytes1,
    bytes2: StaticBytes2,
    bytes3: StaticBytes3,
    bytes4: StaticBytes4,
    bytes5: StaticBytes5,
    bytes6: StaticBytes6,
    bytes7: StaticBytes7,
    bytes8: StaticBytes8,
    bytes9: StaticBytes9,
    bytes10: StaticBytes10,
    bytes11: StaticBytes11,
    bytes12: StaticBytes12,
    bytes13: StaticBytes13,
    bytes14: StaticBytes14,
    bytes15: StaticBytes15,
    bytes16: StaticBytes16,
    bytes17: StaticBytes17,
    bytes18: StaticBytes18,
    bytes19: StaticBytes19,
    bytes20: StaticBytes20,
    bytes21: StaticBytes21,
    bytes22: StaticBytes22,
    bytes23: StaticBytes23,
    bytes24: StaticBytes24,
    bytes25: StaticBytes25,
    bytes26: StaticBytes26,
    bytes27: StaticBytes27,
    bytes28: StaticBytes28,
    bytes29: StaticBytes29,
    bytes30: StaticBytes30,
    bytes31: StaticBytes31,
    bytes32: StaticBytes32,
  } as const