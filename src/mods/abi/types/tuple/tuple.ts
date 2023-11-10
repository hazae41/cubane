import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";
import { Factory, Instance } from "mods/abi/abi.js";
import { Uint32 } from "../uint/uint.js";

export { AbiTuple as Tuple };

export const createTuple = <T extends readonly Factory[]>(...$types: T) => {
  return class AbiTuple {
    readonly #class = AbiTuple
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

      return new AbiTuple(instances, heads, tails, length)
    }

    static from(primitives: Factory.Primitives<T>) {
      const result = new Array(AbiTuple.types.length)

      for (let i = 0; i < AbiTuple.types.length; i++)
        result[i] = AbiTuple.types[i].from(primitives[i])

      return AbiTuple.new(result as Factory.Instances<T>)
    }

    intoOrThrow() {
      return this.inner.map(it => it.intoOrThrow()) as Factory.Primitives<T>
    }

    static codegen() {
      return `Abi.createTuple(${this.types.map(it => it.codegen()).join(",")})`
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
      const start = cursor.offset

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      let end = 0

      for (const factory of AbiTuple.types) {
        if (factory.dynamic) {
          const pointer = Uint32.decodeOrThrow(cursor)
          heads.push(pointer)

          const offset = cursor.offset

          cursor.offset = start + (pointer.toNumber() * 2)
          const instance = factory.decodeOrThrow(cursor)

          end = cursor.offset
          cursor.offset = offset

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = factory.decodeOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, end)

      return new AbiTuple(inner as Factory.Instances<T>, heads, tails, (cursor.offset - start) / 2)
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
      const start = cursor.offset

      const inner = new Array<Instance<any>>()

      const heads = new Array<Instance<any>>()
      const tails = new Array<Instance<any>>()

      let end = 0

      for (const factory of AbiTuple.types) {
        if (factory.dynamic) {
          const pointer = Uint32.readOrThrow(cursor)
          heads.push(pointer)

          const offset = cursor.offset

          cursor.offset = start + pointer.toNumber()
          const instance = factory.readOrThrow(cursor)

          end = cursor.offset
          cursor.offset = offset

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = factory.readOrThrow(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, end)

      return new AbiTuple(inner as Factory.Instances<T>, heads, tails, cursor.offset - start)
    }

  }
}

export type TupleInstance<T extends readonly Factory[] = Factory[]> =
  Factory.Instance<TupleFactory<T>>

export type TupleFactory<T extends readonly Factory[] = Factory[]> =
  ReturnType<typeof createTuple<T>> & { readonly name: string }

export namespace AbiTuple {
  export const name = "AbiTuple"

  export function isInstance<T extends readonly Factory[]>(x: Skeleton<TupleInstance<T>>): x is TupleInstance<T> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends readonly Factory[]>(x: Skeleton<TupleFactory<T>>): x is TupleFactory<T> {
    return x.name === name && x.new != null
  }

}