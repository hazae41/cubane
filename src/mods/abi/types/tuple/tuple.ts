import { Readable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";
import { Factory, Instance } from "mods/abi/abi.js";
import { Uint32 } from "../uint/uint.js";

export const createDynamicTuple = <T extends readonly Factory[]>(...$types: T) => {
  return class DynamicTuple {
    readonly #class = DynamicTuple
    readonly name = this.#class.name

    static readonly types = $types
    static readonly dynamic = $types.some(it => it.dynamic)

    readonly types = this.#class.types
    readonly dynamic = this.#class.dynamic

    private constructor(
      readonly inner: Factory.Instances<T>,
      readonly heads: Instance<any>[],
      readonly tails: Instance<any>[],
      readonly size: number,
    ) { }

    static new(instances: Factory.Instances<T>) {
      let length = 0
      let offset = instances.length * 32

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      for (const instance of instances) {
        const size = instance.sizeOrThrow()

        if (instance.dynamic) {
          const pointer = Uint32.new(offset)

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

      return new DynamicTuple(instances, heads, tails, length)
    }

    static from(primitives: Factory.Primitives<T>) {
      const result = new Array(DynamicTuple.types.length)

      for (let i = 0; i < DynamicTuple.types.length; i++)
        result[i] = DynamicTuple.types[i].from(primitives[i])

      return DynamicTuple.new(result as Factory.Instances<T>)
    }

    intoOrThrow() {
      return this.inner.map(it => it.intoOrThrow()) as Factory.Primitives<T>
    }

    static codegen() {
      return `Cubane.Abi.createDynamicTuple(${this.types.map(it => it.codegen()).join(",")})`
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

      for (const factory of DynamicTuple.types) {
        if (factory.dynamic) {
          const pointer = Uint32.decodeOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + (pointer.value * 2)
          const instance = factory.decodeOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = factory.decodeOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new DynamicTuple(inner as Factory.Instances<T>, heads, tails, (cursor.offset - zero) / 2)
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

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      const subcursor = new Cursor(cursor.bytes)

      for (const factory of DynamicTuple.types) {
        if (factory.dynamic) {
          const pointer = Uint32.readOrThrow(cursor)
          heads.push(pointer)

          subcursor.offset = start + pointer.value
          const instance = factory.readOrThrow(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = factory.readOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new DynamicTuple(inner as Factory.Instances<T>, heads, tails, cursor.offset - zero)
    }

  }
}

export type DynamicTupleInstance<T extends readonly Factory[] = Factory[]> =
  Readable.Output<DynamicTupleFactory<T>>

export type DynamicTupleFactory<T extends readonly Factory[] = Factory[]> =
  ReturnType<typeof createDynamicTuple<T>> & { readonly name: string }

export namespace DynamicTuple {
  export const name = "DynamicTuple"

  export function isInstance<T extends readonly Factory[]>(x: Skeleton<DynamicTupleInstance<T>>): x is DynamicTupleInstance<T> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends readonly Factory[]>(x: Skeleton<DynamicTupleFactory<T>>): x is DynamicTupleFactory<T> {
    return x.name === name && x.new != null
  }

}