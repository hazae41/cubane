import { Readable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { TextCursor } from "libs/cursor/cursor.js";
import { ReadOutputs } from "libs/readable/readable.js";
import { Skeleton } from "libs/typescript/skeleton.js";
import { Factory, Instance, MaybeDynamic } from "mods/abi/index.js";
import { Uint32 } from "../uint/uint.js";

export type DynamicTupleInstance<T extends readonly Factory[] = Factory[]> =
  Readable.ReadOutput<DynamicTupleFactory<T>>

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

export const createDynamicTuple = <T extends readonly MaybeDynamic<Factory>[]>(...inner: T) => {
  return class DynamicTuple {
    readonly #class = DynamicTuple
    readonly name = this.#class.name

    static readonly inner = inner

    private constructor(
      readonly inner: ReadOutputs<T>,
      readonly heads: Instance[],
      readonly tails: Instance[],
      readonly size: number,
    ) { }

    static new(...instances: ReadOutputs<T>) {
      let length = 0
      let offset = instances.length * 32

      const heads = new Array<Instance>()
      const tails = new Array<Instance>()

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

    get class() {
      return this.#class
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

      for (const factory of DynamicTuple.inner) {
        if (factory.dynamic) {
          const pointer = Uint32.decode(cursor)
          heads.push(pointer)

          subcursor.offset = start + (pointer.value * 2)
          const instance = factory.decode(subcursor)

          inner.push(instance)
          tails.push(instance)
        } else {
          const instance = factory.decode(cursor)
          inner.push(instance)
          heads.push(instance)
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      const nibbles = (cursor.offset - start)

      return new DynamicTuple(inner as ReadOutputs<T>, heads, tails, nibbles / 2)
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
        const start = cursor.offset

        const inner = new Array<Instance>()

        const heads = new Array<Instance>()
        const tails = new Array<Instance>()

        const subcursor = new Cursor(cursor.after)

        for (const factory of DynamicTuple.inner) {
          if (factory.dynamic) {
            const pointer = Uint32.tryRead(cursor).throw(t)
            heads.push(pointer)

            subcursor.offset = Number(pointer.value)
            const instance = factory.tryRead(subcursor).throw(t)

            inner.push(instance)
            tails.push(instance)
          } else {
            const instance = factory.tryRead(cursor).throw(t)
            inner.push(instance)
            heads.push(instance)
          }
        }

        const size = Math.max(cursor.offset - start, subcursor.offset)

        cursor.offset = start + size

        return new Ok(new DynamicTuple(inner as ReadOutputs<T>, heads, tails, size))
      })
    }

  }
}