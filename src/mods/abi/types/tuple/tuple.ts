import { Readable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { Skeleton } from "libs/typescript/skeleton.js";
import { Factory, Instance } from "mods/abi/abi.js";
import { Uint32 } from "../uint/uint.js";

export const createDynamicTuple = <T extends readonly Factory<any, any>[]>(...inner: T) => {
  return class DynamicTuple {
    readonly #class = DynamicTuple
    readonly name = this.#class.name

    static readonly inner = inner

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

      return new DynamicTuple(instances, heads, tails, length)
    }

    static from(primitives: Factory.Primitives<T>) {
      const result = new Array(DynamicTuple.inner.length)

      for (let i = 0; i < DynamicTuple.inner.length; i++)
        result[i] = DynamicTuple.inner[i].from(primitives[i])

      return DynamicTuple.new(result as Factory.Instances<T>)
    }

    into() {
      return this.inner.map(it => it.into()) as Factory.Primitives<T>
    }

    static codegen() {
      return `Cubane.Abi.createDynamicTuple(${this.inner.map(it => it.codegen()).join(",")})`
    }

    get class() {
      return this.#class
    }

    static get dynamic() {
      return DynamicTuple.inner.some(it => it.dynamic)
    }

    get dynamic() {
      return this.inner.some(it => it.dynamic)
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

      for (const factory of DynamicTuple.inner) {
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

    static tryRead(cursor: Cursor): Result<DynamicTuple, Error> {
      return Result.unthrowSync(t => {
        const zero = cursor.offset
        const start = cursor.offset

        const inner = new Array<Instance<any>>()

        const heads = new Array<Instance<any>>()
        const tails = new Array<Instance<any>>()

        const subcursor = new Cursor(cursor.bytes)

        for (const factory of DynamicTuple.inner) {
          if (factory.dynamic) {
            const pointer = Uint32.tryRead(cursor).throw(t)
            heads.push(pointer)

            subcursor.offset = start + pointer.value
            const instance = factory.tryRead(subcursor).throw(t)

            inner.push(instance)
            tails.push(instance)
          } else {
            const instance = factory.tryRead(cursor).throw(t)
            inner.push(instance)
            heads.push(instance)
          }
        }

        cursor.offset = Math.max(cursor.offset, subcursor.offset)

        return new Ok(new DynamicTuple(inner as Factory.Instances<T>, heads, tails, cursor.offset - zero))
      })
    }

  }
}

export type DynamicTupleInstance<T extends readonly Factory<any, any>[] = Factory<any, any>[]> =
  Readable.ReadOutput<DynamicTupleFactory<T>>

export type DynamicTupleFactory<T extends readonly Factory<any, any>[] = Factory<any, any>[]> =
  ReturnType<typeof createDynamicTuple<T>> & { readonly name: string }

export namespace DynamicTuple {
  export const name = "DynamicTuple"

  export const any = createDynamicTuple<any>()

  export function isInstance<T extends readonly Factory<any, any>[]>(x: Skeleton<DynamicTupleInstance<T>>): x is DynamicTupleInstance<T> {
    return x.name === name && x.class != null
  }

  export function isFactory<T extends readonly Factory<any, any>[]>(x: Skeleton<DynamicTupleFactory<T>>): x is DynamicTupleFactory<T> {
    return x.name === name && x.new != null
  }

}