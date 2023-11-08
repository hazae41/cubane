import { Cursor } from "@hazae41/cursor";
import { Factory, Instance } from "mods/abi/abi.js";
import { Uint32 } from "../uint/uint.js";

import type { Readable } from "@hazae41/binary";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";

type Unuseds = Readable

export const createDynamicArray = <T extends Factory<any, any>, N extends number>(inner: T, count: N) => {
  return class DynamicArray {
    readonly #class = DynamicArray
    readonly name = this.#class.name

    static readonly inner = inner
    static readonly count = count

    private constructor(
      readonly inner: Factory.Instances<T[]> & { readonly length: N },
      readonly heads: Instance<any>[],
      readonly tails: Instance<any>[],
      readonly size: number,
    ) { }

    static create(instances: Factory.Instances<T[]> & { readonly length: N }) {
      let length = 0
      let offset = instances.length * 32

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      for (const instance of instances) {
        if (instance.dynamic) {
          const pointer = Uint32.new(offset)

          heads.push(pointer)
          length += 32

          tails.push(instance)
          length += instance.size
          offset += instance.size
        } else {
          heads.push(instance)
          length += instance.size
        }
      }

      return new DynamicArray(instances, heads, tails, length)
    }

    static from(primitives: Factory.Primitives<T[]> & { readonly length: N }) {
      const result = new Array(DynamicArray.count)

      for (let i = 0; i < DynamicArray.count; i++)
        result[i] = DynamicArray.inner.from(primitives[i])

      return DynamicArray.create(result as any as Factory.Instances<T[]> & { readonly length: N })
    }

    intoOrThrow() {
      return this.inner.map(instance => instance.intoOrThrow()) as any as Factory.Primitives<T[]> & { readonly length: N }
    }

    static codegen() {
      return `Cubane.Abi.createDynamicArray(${this.inner.codegen()},${this.count})`
    }

    get class() {
      return this.#class
    }

    get count() {
      return this.#class.count
    }

    static get dynamic() {
      return true as const
    }

    get dynamic() {
      return this.#class.dynamic
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
        if (DynamicArray.inner.dynamic) {
          const pointer = Uint32.decodeOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + (pointer.value * 2)
          const instance = DynamicArray.inner.decodeOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = DynamicArray.inner.decodeOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new DynamicArray(inner as any as Factory.Instances<T[]> & { readonly length: N }, heads, tails, (cursor.offset - zero) / 2)
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
        if (DynamicArray.inner.dynamic) {
          const pointer = Uint32.readOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + pointer.value
          const instance = DynamicArray.inner.readOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = DynamicArray.inner.readOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new DynamicArray(inner as any as Factory.Instances<T[]> & { readonly length: N }, heads, tails, cursor.offset - zero)
    }

  }
}

export type DynamicArrayInstance<T extends Factory<any, any>, N extends number> =
  Readable.Output<DynamicArrayFactory<T, N>>

export type DynamicArrayFactory<T extends Factory<any, any>, N extends number> =
  ReturnType<typeof createDynamicArray<T, N>> & { readonly name: string }

export namespace DynamicArray {
  export const name = "DynamicArray"

  export const any = createDynamicArray(undefined as any, 0 as any)

  export function isInstance<T extends Factory<any, any>, N extends number>(x: Skeleton<DynamicArrayInstance<T, N>>): x is DynamicArrayInstance<T, N> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends Factory<any, any>, N extends number>(x: Skeleton<DynamicArrayFactory<T, N>>): x is DynamicArrayFactory<T, N> {
    return x.name === name && x.prototype != null
  }

}
