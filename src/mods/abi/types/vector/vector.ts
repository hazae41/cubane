import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { ReadOutputs } from "libs/readable/readable.js";
import { Factory, Instance } from "mods/abi/abi.js";
import { Uint256 } from "../uint/uint.js";

import type { Readable } from "@hazae41/binary";
import { Skeleton } from "libs/typescript/skeleton.js";

type Unuseds = Readable

export type DynamicVectorInstance<T extends Factory = Factory> =
  Readable.ReadOutput<DynamicVectorFactory<T>>

export type DynamicVectorFactory<T extends Factory = Factory> =
  ReturnType<typeof createDynamicVector<T>> & { readonly name: string }

export namespace DynamicVector {
  export const name = "DynamicVector"

  export function isInstance<T extends Factory = Factory>(x: Skeleton<DynamicVectorInstance<T>>): x is DynamicVectorInstance<T> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends Factory = Factory>(x: Skeleton<DynamicVectorFactory<T>>): x is DynamicVectorFactory<T> {
    return x.name === name && x.prototype != null
  }

}

export const createDynamicVector = <T extends Factory>(inner: T) => {
  return class DynamicVector {
    readonly #class = DynamicVector
    readonly name = this.#class.name

    static readonly inner = inner

    private constructor(
      readonly inner: ReadOutputs<T[]>,
      readonly heads: Instance[],
      readonly tails: Instance[],
      readonly size: number,
    ) { }

    static tryNew(...instances: ReadOutputs<T[]>): Result<DynamicVector, Error> {
      return Result.unthrowSync(t => {
        let length = 0
        let offset = instances.length * 32

        const heads = new Array<Instance>()
        const tails = new Array<Instance>()

        for (const instance of instances) {
          const size = instance.trySize().throw(t)

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

        return new Ok(new DynamicVector(instances, heads, tails, length))
      })
    }

    get class() {
      return this.#class
    }

    static get dynamic() {
      return true as const
    }

    get dynamic() {
      return this.#class.dynamic
    }

    trySize(): Result<number, never> {
      return new Ok(32 + this.size)
    }

    tryWrite(cursor: Cursor): Result<void, Error> {
      return Result.unthrowSync(t => {
        const length = Uint256.new(BigInt(this.inner.length))

        length.tryWrite(cursor).throw(t)

        for (const instance of this.heads)
          instance.tryWrite(cursor).throw(t)
        for (const instance of this.tails)
          instance.tryWrite(cursor).throw(t)
        return Ok.void()
      })
    }

    static tryRead(cursor: Cursor): Result<DynamicVector, Error> {
      return Result.unthrowSync(t => {
        const length = Uint256.tryRead(cursor).throw(t)

        const start = cursor.offset

        const subcursor = new Cursor(cursor.after)

        const inner = new Array<Instance>()

        const heads = new Array<Instance>()
        const tails = new Array<Instance>()

        for (let i = 0; i < length.value; i++) {
          if (DynamicVector.inner.dynamic) {
            const pointer = Uint256.tryRead(cursor).throw(t)
            heads.push(pointer)

            subcursor.offset = Number(pointer.value)
            const instance = DynamicVector.inner.tryRead(subcursor).throw(t)

            inner.push(instance)
            tails.push(instance)
          } else {
            const instance = DynamicVector.inner.tryRead(cursor).throw(t)
            inner.push(instance)
            heads.push(instance)
          }
        }

        const size = Math.max(cursor.offset - start, subcursor.offset)

        cursor.offset = start + size

        return new Ok(new DynamicVector(inner as ReadOutputs<T[]>, heads, tails, size))
      })
    }

  }
}