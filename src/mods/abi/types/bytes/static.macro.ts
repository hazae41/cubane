function $pre$() {
  return `import { Base16 } from "@hazae41/base16";
  import { Bytes } from "@hazae41/bytes";
  import { Cursor } from "@hazae41/cursor";
  import { TextCursor } from "libs/cursor/cursor.js";`
}

$pre$()

function $createStaticBytes$(bytes: number) {
  const bits = bytes * 8
  const nibbles = bytes * 2

  return `export class Bytes${bytes} {
    readonly #class = Bytes${bytes}
    readonly name = this.#class.name

    static readonly bytes = ${bytes}
    static readonly nibbles = ${nibbles}
    static readonly bits = ${bits}

    readonly size = 32

    private constructor(
      readonly value: Bytes<${bytes}>
    ) { }

    static create(value: Bytes<${bytes}>) {
      return new Bytes${bytes}(value)
    }

    static from(value: Bytes<${bytes}>) {
      return Bytes${bytes}.create(value)
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
      const text = cursor.readOrThrow(Bytes${bytes}.nibbles)

      const unsized = Base16.get().padStartAndDecodeOrThrow(text).copyAndDispose()
      const sized = Bytes.tryCast(unsized, Bytes${bytes}.bytes).unwrap()

      cursor.offset += 64 - Bytes${bytes}.nibbles

      return new Bytes${bytes}(sized)
    }

    sizeOrThrow() {
      return this.size
    }

    writeOrThrow(cursor: Cursor) {
      cursor.writeOrThrow(this.value)
      cursor.fillOrThrow(0, 32 - this.value.length)
    }

    static readOrThrow(cursor: Cursor) {
      const content = cursor.readOrThrow(Bytes${bytes}.bytes)
      const bytes = Bytes.from(content)

      cursor.offset += 32 - Bytes${bytes}.bytes
      
      return new Bytes${bytes}(bytes)
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
  } as const`
}

$post$()