import { Cursor } from "@hazae41/cursor";
import { Ok, Panic, Result, Unimplemented } from "@hazae41/result";
import { ReadOutputs } from "libs/readable/readable.js";
import { Factory, Instance, MaybeDynamic } from "mods/abi/abi.js";
import { Uint256, Uint32 } from "../uint/uint.js";

import type { Readable } from "@hazae41/binary";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";

type Unuseds = Readable

export type DynamicArrayInstance<T extends Factory, N extends number> =
  Readable.ReadOutput<DynamicArrayFactory<T, N>>

export type DynamicArrayFactory<T extends Factory, N extends number> =
  ReturnType<typeof createDynamicArray<T, N>> & { readonly name: string }

export namespace DynamicArray {
  export const name = "DynamicArray"

  export function isInstance<T extends Factory, N extends number>(x: Skeleton<DynamicArrayInstance<T, N>>): x is DynamicArrayInstance<T, N> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends Factory, N extends number>(x: Skeleton<DynamicArrayFactory<T, N>>): x is DynamicArrayFactory<T, N> {
    return x.name === name && x.prototype != null
  }

}

export const createDynamicArray = <T extends MaybeDynamic<Factory>, N extends number>(inner: T, count: N) => {
  return class DynamicArray {
    readonly #class = DynamicArray
    readonly name = this.#class.name

    static readonly inner = inner
    static readonly count = count

    private constructor(
      readonly inner: ReadOutputs<T[]> & { readonly length: N },
      readonly heads: Instance[],
      readonly tails: Instance[],
      readonly size: number,
    ) { }

    static new(...instances: MaybeDynamic<ReadOutputs<T[]>> & { readonly length: N }) {
      let length = 0
      let offset = instances.length * 32

      const heads = new Array<Instance>()
      const tails = new Array<Instance>()

      for (const instance of instances) {
        if (instance.dynamic) {
          const pointer = Uint256.new(BigInt(offset))

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

    encode() {
      let result = ""

      for (const instance of this.heads)
        result += instance.encode()
      for (const instance of this.tails)
        result += instance.encode()

      return result
    }

    encodePacked() {
      let result = ""

      for (const instance of this.heads)
        result += instance.encodePacked()
      for (const instance of this.tails)
        result += instance.encodePacked()

      return result
    }

    static decode(cursor: TextCursor) {
      const start = cursor.offset

      const inner = new Array<Instance>()

      const heads = new Array<Instance>()
      const tails = new Array<Instance>()

      const subcursor = new TextCursor(cursor.text)

      for (let i = 0; i < this.count; i++) {
        if (DynamicArray.inner.dynamic) {
          const pointer = Uint32.decode(cursor)
          heads.push(pointer)

          subcursor.offset = start + (pointer.value * 2)
          const instance = DynamicArray.inner.decode(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = DynamicArray.inner.decode(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      const nibbles = Math.max(cursor.offset - start, subcursor.offset)

      cursor.offset = start + nibbles

      return new DynamicArray(inner as ReadOutputs<T[]> & { readonly length: N }, heads, tails, nibbles / 2)
    }

    static decodePacked(cursor: TextCursor) {
      throw Panic.from(new Unimplemented())
    }

    trySize(): Result<number, never> {
      return new Ok(this.size)
    }

    tryWrite(cursor: Cursor): Result<void, Error> {
      return Result.unthrowSync(t => {
        for (const instance of this.heads)
          instance.tryWrite(cursor).throw(t)
        for (const instance of this.tails)
          instance.tryWrite(cursor).throw(t)
        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<DynamicArray, Error> {
      return Result.unthrowSync(t => {
        const start = cursor.offset

        const subcursor = new Cursor(cursor.after)

        const inner = new Array<Instance>()

        const heads = new Array<Instance>()
        const tails = new Array<Instance>()

        for (let i = 0; i < this.count; i++) {
          if (DynamicArray.inner.dynamic) {
            const pointer = Uint256.tryRead(cursor).throw(t)
            heads.push(pointer)

            subcursor.offset = Number(pointer.value)
            const instance = DynamicArray.inner.tryRead(subcursor).throw(t)

            inner.push(instance)
            tails.push(instance)
          } else {
            const instance = DynamicArray.inner.tryRead(cursor).throw(t)
            inner.push(instance)
            heads.push(instance)
          }
        }

        const size = Math.max(cursor.offset - start, subcursor.offset)

        cursor.offset = start + size

        return new Ok(new DynamicArray(inner as ReadOutputs<T[]> & { readonly length: N }, heads, tails, size))
      })
    }

  }
}