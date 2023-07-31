import { Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { ReadOutputs } from "libs/readable/readable.js";
import { Factory } from "mods/abi/abi.js";
import { DecodingError } from "mods/abi/errors/errors.js";
import { Uint256 } from "../uint/uint.js";

import type { Readable } from "@hazae41/binary";
import { Skeleton } from "libs/typescript/skeleton.js";

type Unuseds = Readable

export type DynamicArrayInstance<T extends Factory, N extends number> =
  Readable.ReadOutput<DynamicArrayFactory<T, N>>

export type DynamicArrayFactory<T extends Factory, N extends number> =
  ReturnType<typeof createDynamicArray<T, N>> & { name: string }

export namespace DynamicArray {
  export const name = "DynamicArray"

  export function isInstance<T extends Factory, N extends number>(x: Skeleton<DynamicArrayInstance<T, N>>): x is DynamicArrayInstance<T, N> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends Factory, N extends number>(x: Skeleton<DynamicArrayFactory<T, N>>): x is DynamicArrayFactory<T, N> {
    return x.name === name && x.new != null
  }

}

export const createDynamicArray = <T extends Factory, N extends number>(inner: T, count: N) => {
  return class DynamicArray {
    readonly #class = DynamicArray
    readonly name = this.#class.name

    static readonly inner = inner
    static readonly count = count

    private constructor(
      readonly inner: ReadOutputs<T[]> & { length: N },
      readonly heads: Writable<never, Error>[],
      readonly tails: Writable<never, Error>[],
      readonly size: number,
    ) { }

    static new(...instances: ReadOutputs<T[]> & { length: N }): DynamicArray {
      let length = 0
      let offset = instances.length * 32

      const heads = new Array<Writable<never, Error>>()
      const tails = new Array<Writable<never, Error>>()

      for (const instance of instances) {
        const size = instance.trySize().get()

        if (instance.dynamic) {
          const pointer = Uint256.new(BigInt(offset))

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

    static tryRead(cursor: Cursor): Result<DynamicArray, DecodingError> {
      return Result.unthrowSync(t => {
        const start = cursor.offset

        const subcursor = new Cursor(cursor.after)

        const inner = new Array<Writable<never, Error>>()

        const heads = new Array<Writable<never, Error>>()
        const tails = new Array<Writable<never, Error>>()

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

        return new Ok(new DynamicArray(inner as ReadOutputs<T[]> & { length: N }, heads, tails, size))
      })
    }

  }
}