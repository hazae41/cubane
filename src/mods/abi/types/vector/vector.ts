import { Cursor } from "@hazae41/cursor";
import { Factory, Instance } from "mods/abi/abi.js";

import type { Readable } from "@hazae41/binary";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";
import { StaticUint32 } from "../uint/uint.js";

type Unuseds = Readable

export const createDynamicVector = <T extends Factory>($type: T) => {
  return class DynamicVector {
    readonly #class = DynamicVector
    readonly name = this.#class.name

    static readonly type = $type
    static readonly dynamic = true

    readonly type = this.#class.type
    readonly dynamic = this.#class.dynamic

    private constructor(
      readonly inner: Factory.Instances<T[]>,
      readonly heads: Instance<any>[],
      readonly tails: Instance<any>[],
      readonly size: number,
    ) { }

    static new(instances: Factory.Instances<T[]>) {
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
          const pointer = StaticUint32.create(offset)

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

      return new DynamicVector(instances, heads, tails, 32 + length)
    }

    static from(primitives: Factory.Primitives<T[]>) {
      const result: Instance<any>[] = new Array(primitives.length)

      for (let i = 0; i < primitives.length; i++)
        result[i] = DynamicVector.type.from(primitives[i])

      return DynamicVector.new(result as any as Factory.Instances<T[]>)
    }

    intoOrThrow() {
      return this.inner.map(it => it.intoOrThrow()) as Factory.Primitives<T[]>
    }

    static codegen() {
      return `Cubane.Abi.createDynamicVector(${this.type.codegen()})`
    }

    get class() {
      return this.#class
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

      const length = StaticUint32.decodeOrThrow(cursor).toNumber()

      const start = cursor.offset

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      const subcursor = new TextCursor(cursor.text)

      for (let i = 0; i < length; i++) {
        if (DynamicVector.type.dynamic) {
          const pointer = StaticUint32.decodeOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + (pointer.toNumber() * 2)
          const instance = DynamicVector.type.decodeOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = DynamicVector.type.decodeOrThrow(cursor)
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
      const length = StaticUint32.create(this.inner.length)

      length.writeOrThrow(cursor)

      for (const instance of this.heads)
        instance.writeOrThrow(cursor)
      for (const instance of this.tails)
        instance.writeOrThrow(cursor)
    }

    static readOrThrow(cursor: Cursor) {
      const zero = cursor.offset

      const length = StaticUint32.readOrThrow(cursor).toNumber()

      const start = cursor.offset

      const subcursor = new Cursor(cursor.bytes)

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      for (let i = 0; i < length; i++) {
        if (DynamicVector.type.dynamic) {
          const pointer = StaticUint32.readOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + pointer.toNumber()
          const instance = DynamicVector.type.readOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = DynamicVector.type.readOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new DynamicVector(inner as any as Factory.Instances<T[]>, heads, tails, cursor.offset - zero)
    }

  }
}

export type DynamicVectorInstance<T extends Factory = Factory> =
  Readable.Output<DynamicVectorFactory<T>>

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