import { Cursor } from "@hazae41/cursor";
import { Factory, Instance } from "mods/abi/abi.js";

import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";
import { Uint32 } from "../uint/uint.js";

export { AbiVector as Vector };

export const createVector = <T extends Factory>($type: T) => {
  return class AbiVector {
    readonly #class = AbiVector
    readonly name = this.#class.name

    static readonly type = $type
    static readonly dynamic = true

    readonly type = this.#class.type
    readonly dynamic = this.#class.dynamic

    private constructor(
      readonly inner: Factory.Instances<T[]>,
      readonly heads: Instance[],
      readonly tails: Instance[],
      readonly size: number,
    ) { }

    static create(instances: Factory.Instances<T[]>) {
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

      return new AbiVector(instances, heads, tails, length)
    }

    static from(primitives: Factory.Froms<T[]>) {
      const result: Instance<any>[] = new Array(primitives.length)

      for (let i = 0; i < primitives.length; i++)
        result[i] = AbiVector.type.from(primitives[i])

      return AbiVector.create(result as any as Factory.Instances<T[]>)
    }

    intoOrThrow() {
      return this.inner.map(it => it.intoOrThrow()) as Factory.Intos<T[]>
    }

    toJSON() {
      return this.inner.map(it => it.toJSON()) as Factory.Jsons<T[]>
    }

    static codegen() {
      return `Abi.createVector(${this.type.codegen()})`
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
      const length = Uint32.decodeOrThrow(cursor).value

      const start = cursor.offset

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      let end = 0

      for (let i = 0; i < length; i++) {
        if (AbiVector.type.dynamic) {
          const pointer = Uint32.decodeOrThrow(cursor)
          heads.push(pointer)

          const offset = cursor.offset

          cursor.offset = start + (pointer.value * 2)
          const instance = AbiVector.type.decodeOrThrow(cursor)

          end = cursor.offset
          cursor.offset = offset

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = AbiVector.type.decodeOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, end)

      return new AbiVector(inner as any as Factory.Instances<T[]>, heads, tails, (cursor.offset - start) / 2)
    }

    sizeOrThrow() {
      return 32 + this.size
    }

    writeOrThrow(cursor: Cursor) {
      const length = Uint32.fromNumber(this.inner.length)

      length.writeOrThrow(cursor)

      for (const instance of this.heads)
        instance.writeOrThrow(cursor)
      for (const instance of this.tails)
        instance.writeOrThrow(cursor)
    }

    static readOrThrow(cursor: Cursor) {
      const length = Uint32.readOrThrow(cursor).value

      const start = cursor.offset

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      let end = 0

      for (let i = 0; i < length; i++) {
        if (AbiVector.type.dynamic) {
          const pointer = Uint32.readOrThrow(cursor)
          heads.push(pointer)

          const offset = cursor.offset

          cursor.offset = start + pointer.value
          const instance = AbiVector.type.readOrThrow(cursor)

          end = cursor.offset
          cursor.offset = offset

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = AbiVector.type.readOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, end)

      return new AbiVector(inner as any as Factory.Instances<T[]>, heads, tails, cursor.offset - start)
    }

  }
}

export type VectorInstance<T extends Factory = Factory> =
  Factory.Instance<VectorFactory<T>>

export type VectorFactory<T extends Factory = Factory> =
  ReturnType<typeof createVector<T>> & { readonly name: string }

export namespace AbiVector {
  export const name = "AbiVector"

  export function isInstance<T extends Factory = Factory>(x: Skeleton<VectorInstance<T>>): x is VectorInstance<T> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends Factory = Factory>(x: Skeleton<VectorFactory<T>>): x is VectorFactory<T> {
    return x.name === name && x.prototype != null
  }

}