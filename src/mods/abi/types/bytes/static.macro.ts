function $pre$() {
  return `import { Base16 } from "@hazae41/base16";
  import { Bytes } from "@hazae41/bytes";
  import { Cursor } from "@hazae41/cursor";
  import { TextCursor } from "libs/cursor/cursor.js";
  import { ZeroHexString } from "mods/types/zerohex/index.js";
  import { RawHexString } from "mods/types/rawhex/index.js";`
}

$pre$()

function $createStaticBytes$(bytes: number) {
  const bits = bytes * 8
  const nibbles = bytes * 2

  return `export type StaticBytes${bytes} =
  | BytesStaticBytes${bytes}
  | ZeroHexStaticBytes${bytes}
  
export namespace StaticBytes${bytes} {
  export const dynamic = false
  export const size = 32
  
  export type From = 
    | BytesStaticBytes${bytes}.From
    | ZeroHexStaticBytes${bytes}.From
  
  export function create(value: StaticBytes${bytes}.From) {
    if (value instanceof Uint8Array)
      return BytesStaticBytes${bytes}.create(value)
    return ZeroHexStaticBytes${bytes}.create(value)
  }

  export function from(value: StaticBytes${bytes}.From) {
    return StaticBytes${bytes}.create(value)
  }
  
  export function codegen() {
    return \`Cubane.Abi.Bytes${bytes}\`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return ZeroHexStaticBytes${bytes}.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesStaticBytes${bytes}.readOrThrow(cursor)
  }

}

export namespace BytesStaticBytes${bytes} {
  export type From = Uint8Array
}

export class BytesStaticBytes${bytes} {
  readonly #class = BytesStaticBytes${bytes}
  readonly name = this.#class.name

  static readonly bytes = ${bytes}
  static readonly nibbles = ${nibbles}
  static readonly bits = ${bits}
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

  static create(value: BytesStaticBytes${bytes}.From) {
    return new BytesStaticBytes${bytes}(value)
  }

  static from(value: BytesStaticBytes${bytes}.From) {
    return BytesStaticBytes${bytes}.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return \`Cubane.Abi.Bytes${bytes}\`
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
    const content = cursor.readOrThrow(BytesStaticBytes${bytes}.nibbles)
    const value = Base16.get().padStartAndDecodeOrThrow(content).copyAndDispose()

    cursor.offset += 64 - BytesStaticBytes${bytes}.nibbles

    return new BytesStaticBytes${bytes}(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesStaticBytes${bytes}.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(BytesStaticBytes${bytes}.bytes)
    const bytes = Bytes.from(content)

    cursor.offset += 32 - BytesStaticBytes${bytes}.bytes
    
    return new BytesStaticBytes${bytes}(bytes)
  }

}

export namespace ZeroHexStaticBytes${bytes} {
  export type From = ZeroHexString
}

export class ZeroHexStaticBytes${bytes} {
  readonly #class = ZeroHexStaticBytes${bytes}
  readonly name = this.#class.name

  static readonly bytes = ${bytes}
  static readonly nibbles = ${nibbles}
  static readonly bits = ${bits}
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

  static create(value: ZeroHexStaticBytes${bytes}.From) {
    return new ZeroHexStaticBytes${bytes}(value.slice(2))
  }

  static from(value: ZeroHexStaticBytes${bytes}.From) {
    return ZeroHexStaticBytes${bytes}.create(value)
  }

  intoOrThrow() {
    return this.value
  }

  static codegen() {
    return \`Cubane.Abi.Bytes${bytes}\`
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
    const value = cursor.readOrThrow(ZeroHexStaticBytes${bytes}.nibbles)

    cursor.offset += 64 - ZeroHexStaticBytes${bytes}.nibbles

    return new ZeroHexStaticBytes${bytes}(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - ZeroHexStaticBytes${bytes}.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(ZeroHexStaticBytes${bytes}.bytes)
    const value = Base16.get().encodeOrThrow(content)

    cursor.offset += 32 - ZeroHexStaticBytes${bytes}.bytes
    
    return new ZeroHexStaticBytes${bytes}(value)
  }

}`
}

$createStaticBytes$(1)

$createStaticBytes$(2)

$createStaticBytes$(3)

$createStaticBytes$(4)

$createStaticBytes$(5)

$createStaticBytes$(6)

$createStaticBytes$(7)

$createStaticBytes$(8)

$createStaticBytes$(9)

$createStaticBytes$(10)

$createStaticBytes$(11)

$createStaticBytes$(12)

$createStaticBytes$(13)

$createStaticBytes$(14)

$createStaticBytes$(15)

$createStaticBytes$(16)

$createStaticBytes$(17)

$createStaticBytes$(18)

$createStaticBytes$(19)

$createStaticBytes$(20)

$createStaticBytes$(21)

$createStaticBytes$(22)

$createStaticBytes$(23)

$createStaticBytes$(24)

$createStaticBytes$(25)

$createStaticBytes$(26)

$createStaticBytes$(27)

$createStaticBytes$(28)

$createStaticBytes$(29)

$createStaticBytes$(30)

$createStaticBytes$(31)

$createStaticBytes$(32)

function $post$() {
  return `export type BytesByName = {
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
  } as const`
}

$post$()