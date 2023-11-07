import { Cursor } from "@hazae41/cursor";
import { Factory, Instance } from "mods/abi/abi.js";
import { Uint32 } from "../uint/uint.js";

import type { Readable } from "@hazae41/binary";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";

type Unuseds = Readable

export const createDynamicVector = <T extends Factory<any, any>>(inner: T) => {
  return class DynamicVector {
    readonly #class = DynamicVector
    readonly name = this.#class.name

    static readonly inner = inner

    private constructor(
      readonly inner: Factory.Instances<T[]>,
      readonly heads: Instance<any>[],
      readonly tails: Instance<any>[],
      readonly size: number,
    ) { }

    static new(instances: Factory.Instances<T[]>) {
      let length = 32
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

      return new DynamicVector(instances, heads, tails, length)
    }

    static from(primitives: Factory.Primitives<T[]>) {
      const result: Instance<any>[] = new Array(primitives.length)

      for (let i = 0; i < primitives.length; i++)
        result[i] = DynamicVector.inner.from(primitives[i])

      return DynamicVector.new(result as any as Factory.Instances<T[]>)
    }

    into() {
      return this.inner.map(it => it.into()) as Factory.Primitives<T[]>
    }

    static codegen() {
      return `Cubane.Abi.createDynamicVector(${this.inner.codegen()})`
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

    encodeOrThrow() {
      let result = this.inner.length.toString(16).padStart(64, "0")

      for (const instance of this.heads)
        result += instance.encodeOrThrow()
      for (const instance of this.tails)
        result += instance.encodeOrThrow()

      return result
    }

    encodePackedOrThrow() {
      let result = this.inner.length.toString(16)

      for (const instance of this.heads)
        result += instance.encodePackedOrThrow()
      for (const instance of this.tails)
        result += instance.encodePackedOrThrow()

      return result
    }

    static decodeOrThrow(cursor: TextCursor) {
      const zero = cursor.offset

      const length = Uint32.decodeOrThrow(cursor)

      const start = cursor.offset

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      const subcursor = new TextCursor(cursor.text)

      for (let i = 0; i < length.value; i++) {
        if (DynamicVector.inner.dynamic) {
          const pointer = Uint32.decodeOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + (pointer.value * 2)
          const instance = DynamicVector.inner.decodeOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = DynamicVector.inner.decodeOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new DynamicVector(inner as any as Factory.Instances<T[]>, heads, tails, (cursor.offset - zero) / 2)
    }

    sizeOrThrow() {
      return 32 + this.size
    }

    writeOrThrow(cursor: Cursor) {
      const length = Uint32.new(this.inner.length)

      length.writeOrThrow(cursor)

      for (const instance of this.heads)
        instance.writeOrThrow(cursor)
      for (const instance of this.tails)
        instance.writeOrThrow(cursor)
    }

    static readOrThrow(cursor: Cursor) {
      const zero = cursor.offset

      const length = Uint32.readOrThrow(cursor)

      const start = cursor.offset

      const subcursor = new Cursor(cursor.bytes)

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      for (let i = 0; i < length.value; i++) {
        if (DynamicVector.inner.dynamic) {
          const pointer = Uint32.readOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + pointer.value
          const instance = DynamicVector.inner.readOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = DynamicVector.inner.readOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new DynamicVector(inner as any as Factory.Instances<T[]>, heads, tails, cursor.offset - zero)
    }

  }
}

export type DynamicVectorInstance<T extends Factory<any, any> = Factory<any, any>> =
  Readable.Output<DynamicVectorFactory<T>>

export type DynamicVectorFactory<T extends Factory<any, any> = Factory<any, any>> =
  ReturnType<typeof createDynamicVector<T>> & { readonly name: string }

export namespace DynamicVector {
  export const name = "DynamicVector"

  export const any = createDynamicVector(undefined as any)

  export function isInstance<T extends Factory<any, any> = Factory<any, any>>(x: Skeleton<DynamicVectorInstance<T>>): x is DynamicVectorInstance<T> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends Factory<any, any> = Factory<any, any>>(x: Skeleton<DynamicVectorFactory<T>>): x is DynamicVectorFactory<T> {
    return x.name === name && x.prototype != null
  }

}