function $pre$() {
  return `import { Base16 } from "@hazae41/base16";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { BytesAsInteger, RawHexAsInteger } from "mods/types/helpers/generic.js";
import { RawHexString, ZeroHexString } from "mods/types/string/index.js";
import { Copiable } from "libs/copiable/index.js";`
}

$pre$()

function $createBytes$(bytes: number) {
  const bits = bytes * 8
  const nibbles = bytes * 2

  return `export { AbiBytes${bytes} as Bytes${bytes} }
  
export type AbiBytes${bytes} =
  | BytesAbiBytes${bytes}
  | RawHexAbiBytes${bytes}
  
export namespace AbiBytes${bytes} {
  export const dynamic = false
  export const size = 32

  export type Create =
    | BytesAbiBytes${bytes}.Create
    | RawHexAbiBytes${bytes}.Create
  
  export type From = 
    | BytesAbiBytes${bytes}.From
    | RawHexAbiBytes${bytes}.From
  
  export function create(value: AbiBytes${bytes}.Create) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes${bytes}.create(value)
    return RawHexAbiBytes${bytes}.create(value)
  }

  export function fromOrThrow(value: AbiBytes${bytes}.From) {
    if (value instanceof Uint8Array)
      return BytesAbiBytes${bytes}.fromOrThrow(value)
    return RawHexAbiBytes${bytes}.fromOrThrow(value)
  }
  
  export function codegen() {
    return \`Abi.Bytes${bytes}\`
  }

  export function decodeOrThrow(cursor: TextCursor) {
    return RawHexAbiBytes${bytes}.decodeOrThrow(cursor)
  }

  export function readOrThrow(cursor: Cursor) {
    return BytesAbiBytes${bytes}.readOrThrow(cursor)
  }

}

export namespace BytesAbiBytes${bytes} {

  export type Create = Uint8Array

  export type From = BytesAsInteger.From

}

export class BytesAbiBytes${bytes} {
  readonly #class = BytesAbiBytes${bytes}

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

  constructor(
    readonly value: Uint8Array
  ) { }

  static create(value: BytesAbiBytes${bytes}.Create) {
    return new BytesAbiBytes${bytes}(value)
  }

  static fromOrThrow(value: BytesAbiBytes${bytes}.From) {
    return new BytesAbiBytes${bytes}(BytesAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return this.value
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return \`0x\${Base16.get().getOrThrow().encodeOrThrow(this.value)}\` as ZeroHexString
  }

  static codegen() {
    return \`Abi.Bytes${bytes}\`
  }

  get class() {
    return this.#class
  }

  encodeOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value).padEnd(64, "0")
  }

  encodePackedOrThrow() {
    return Base16.get().getOrThrow().encodeOrThrow(this.value)
  }

  static decodeOrThrow(cursor: TextCursor) {
    const content = cursor.readOrThrow(BytesAbiBytes${bytes}.nibbles)
    using copiable = Base16.get().getOrThrow().padStartAndDecodeOrThrow(content)

    cursor.offset += 64 - BytesAbiBytes${bytes}.nibbles

    return new BytesAbiBytes${bytes}(copiable.bytes.slice())
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    cursor.writeOrThrow(this.value)
    cursor.fillOrThrow(0, 32 - BytesAbiBytes${bytes}.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readAndCopyOrThrow(BytesAbiBytes${bytes}.bytes)

    cursor.offset += 32 - BytesAbiBytes${bytes}.bytes
    
    return new BytesAbiBytes${bytes}(content)
  }

}

export namespace RawHexAbiBytes${bytes} {

  export type Create = RawHexString

  export type From = RawHexAsInteger.From

}

export class RawHexAbiBytes${bytes} {
  readonly #class = RawHexAbiBytes${bytes}

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

  constructor(
    readonly value: RawHexString
  ) { }

  static create(value: RawHexAbiBytes${bytes}.Create) {
    return new RawHexAbiBytes${bytes}(value)
  }

  static fromOrThrow(value: RawHexAbiBytes${bytes}.From) {
    return new RawHexAbiBytes${bytes}(RawHexAsInteger.fromOrThrow(value))
  }

  intoOrThrow(): Uint8Array {
    return Copiable.copyAndDispose(Base16.get().getOrThrow().padEndAndDecodeOrThrow(this.value))
  }

  /**
   * @deprecated
   */
  toJSON(): ZeroHexString {
    return \`0x\${this.value}\` as ZeroHexString
  }

  static codegen() {
    return \`Abi.Bytes${bytes}\`
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
    const value = cursor.readOrThrow(RawHexAbiBytes${bytes}.nibbles)

    cursor.offset += 64 - RawHexAbiBytes${bytes}.nibbles

    return new RawHexAbiBytes${bytes}(value)
  }

  sizeOrThrow() {
    return this.size
  }

  writeOrThrow(cursor: Cursor) {
    using slice = Base16.get().getOrThrow().padStartAndDecodeOrThrow(this.value)

    cursor.writeOrThrow(slice.bytes)
    cursor.fillOrThrow(0, 32 - RawHexAbiBytes${bytes}.bytes)
  }

  static readOrThrow(cursor: Cursor) {
    const content = cursor.readOrThrow(RawHexAbiBytes${bytes}.bytes)
    const value = Base16.get().getOrThrow().encodeOrThrow(content)

    cursor.offset += 32 - RawHexAbiBytes${bytes}.bytes
    
    return new RawHexAbiBytes${bytes}(value as RawHexString)
  }

}`
}

$createBytes$(1)

$createBytes$(2)

$createBytes$(3)

$createBytes$(4)

$createBytes$(5)

$createBytes$(6)

$createBytes$(7)

$createBytes$(8)

$createBytes$(9)

$createBytes$(10)

$createBytes$(11)

$createBytes$(12)

$createBytes$(13)

$createBytes$(14)

$createBytes$(15)

$createBytes$(16)

$createBytes$(17)

$createBytes$(18)

$createBytes$(19)

$createBytes$(20)

$createBytes$(21)

$createBytes$(22)

$createBytes$(23)

$createBytes$(24)

$createBytes$(25)

$createBytes$(26)

$createBytes$(27)

$createBytes$(28)

$createBytes$(29)

$createBytes$(30)

$createBytes$(31)

$createBytes$(32)

function $post$() {
  return `export type BytesByName = {
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
  } as const`
}

$post$()