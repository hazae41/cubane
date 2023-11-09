import { Cursor } from "@hazae41/cursor";
import { Factory, Instance } from "mods/abi/abi.js";

import type { Readable } from "@hazae41/binary";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";
import { Uint32 } from "../uint/uint.js";

export { AbiArray as Array };

export const createArray = <T extends Factory, N extends number>($type: T, $count: N) => {
  return class AbiArray {
    readonly #class = AbiArray
    readonly name = this.#class.name

    static readonly type = $type
    static readonly count = $count
    static readonly dynamic = $type.dynamic

    readonly type = this.#class.type
    readonly count = this.#class.count
    readonly dynamic = this.#class.dynamic

    private constructor(
      readonly inner: Factory.Instances<T[]> & { readonly length: N },
      readonly heads: Instance<any>[],
      readonly tails: Instance<any>[],
      readonly size: number,
    ) { }

    static create(instances: Factory.Instances<T[]> & { readonly length: N }) {
      let length = 0
      let offset = 0

      for (const instance of instances) {
        if (instance.dynamic)
          /**
           * Pointer
           */
          offset += 32
        else
          /**
           * As-is
           */
          offset += instance.sizeOrThrow()
      }

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      for (const instance of instances) {
        const size = instance.sizeOrThrow()

        if (instance.dynamic) {
          const pointer = Uint32.fromNumber(offset)

          heads.push(pointer)
          length += 32

          tails.push(instance)
          length += size
          offset += size
        } else {
          heads.push(instance)
          length += size
        }
      }

      return new AbiArray(instances, heads, tails, length)
    }

    static from(primitives: Factory.Primitives<T[]> & { readonly length: N }) {
      const result = new Array(AbiArray.count)

      for (let i = 0; i < AbiArray.count; i++)
        result[i] = AbiArray.type.from(primitives[i])

      return AbiArray.create(result as any as Factory.Instances<T[]> & { readonly length: N })
    }

    intoOrThrow() {
      return this.inner.map(instance => instance.intoOrThrow()) as any as Factory.Primitives<T[]> & { readonly length: N }
    }

    static codegen() {
      return `Abi.createArray(${this.type.codegen()},${this.count})`
    }

    get class() {
      return this.#class
    }

    encodeOrThrow() {
      let result = ""

      for (const instance of this.heads)
        result += instance.encodeOrThrow()
      for (const instance of this.tails)
        result += instance.encodeOrThrow()

      return result
    }

    encodePackedOrThrow() {
      let result = ""

      for (const instance of this.heads)
        result += instance.encodePackedOrThrow()
      for (const instance of this.tails)
        result += instance.encodePackedOrThrow()

      return result
    }

    static decodeOrThrow(cursor: TextCursor) {
      const zero = cursor.offset
      const start = cursor.offset

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      const subcursor = new TextCursor(cursor.text)

      for (let i = 0; i < this.count; i++) {
        if (AbiArray.type.dynamic) {
          const pointer = Uint32.decodeOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + (pointer.toNumber() * 2)
          const instance = AbiArray.type.decodeOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = AbiArray.type.decodeOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new AbiArray(inner as any as Factory.Instances<T[]> & { readonly length: N }, heads, tails, (cursor.offset - zero) / 2)
    }

    sizeOrThrow() {
      return this.size
    }

    writeOrThrow(cursor: Cursor) {
      for (const instance of this.heads)
        instance.writeOrThrow(cursor)
      for (const instance of this.tails)
        instance.writeOrThrow(cursor)
    }

    static readOrThrow(cursor: Cursor) {
      const zero = cursor.offset
      const start = cursor.offset

      const subcursor = new Cursor(cursor.bytes)

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      for (let i = 0; i < this.count; i++) {
        if (AbiArray.type.dynamic) {
          const pointer = Uint32.readOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + pointer.toNumber()
          const instance = AbiArray.type.readOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = AbiArray.type.readOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new AbiArray(inner as any as Factory.Instances<T[]> & { readonly length: N }, heads, tails, cursor.offset - zero)
    }

  }
}

export type ArrayInstance<T extends Factory, N extends number> =
  Readable.Output<ArrayFactory<T, N>>

export type ArrayFactory<T extends Factory, N extends number> =
  ReturnType<typeof createArray<T, N>> & { readonly name: string }

export namespace AbiArray {
  export const name = "Array"

  export function isInstance<T extends Factory, N extends number>(x: Skeleton<ArrayInstance<T, N>>): x is ArrayInstance<T, N> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends Factory, N extends number>(x: Skeleton<ArrayFactory<T, N>>): x is ArrayFactory<T, N> {
    return x.name === name && x.prototype != null
  }

}

