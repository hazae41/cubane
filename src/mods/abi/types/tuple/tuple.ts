import { Cursor } from "@hazae41/cursor";
import { TextCursor } from "libs/cursor/cursor.js";
import { AbiFactory, AbiInstance } from "mods/abi/types.js";
import { Uint32 } from "../uint/uint.js";

export { AbiTuple as Tuple };

export class AbiTuple {

  private constructor() { }

  static create<T extends readonly AbiFactory[]>(...$types: T) {
    return class AbiTuple {
      readonly #class = AbiTuple

      static readonly types = $types
      static readonly dynamic = $types.some(it => it.dynamic)

      readonly types = this.#class.types
      readonly dynamic = this.#class.dynamic

      private constructor(
        readonly inner: AbiFactory.Instances<T>,
        readonly heads: AbiInstance[],
        readonly tails: AbiInstance[],
        readonly size: number,
      ) { }

      static create(instances: AbiTuple.Create<T>) {
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

        const heads = new Array<AbiInstance<any>>()
        const tails = new Array<AbiInstance<any>>()

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

      static from(primitives: AbiTuple.From<T>) {
        const result = new Array(AbiTuple.types.length)

        for (let i = 0; i < AbiTuple.types.length; i++)
          result[i] = AbiTuple.types[i].from(primitives[i])

        return AbiTuple.create(result as AbiFactory.Instances<T>)
      }

      intoOrThrow() {
        return this.inner.map(it => it.intoOrThrow()) as AbiFactory.Intos<T>
      }

      toJSON() {
        return this.inner.map(it => it.toJSON()) as AbiFactory.Jsons<T>
      }

      static codegen() {
        return `Abi.Tuple.create(${this.types.map(it => it.codegen()).join(",")})`
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

        const inner = new Array<AbiInstance<any>>()

        const heads = new Array<AbiInstance<any>>()
        const tails = new Array<AbiInstance<any>>()

        let end = 0

        for (const factory of AbiTuple.types) {
          if (factory.dynamic) {
            const pointer = Uint32.decodeOrThrow(cursor)
            heads.push(pointer)

            const offset = cursor.offset
            cursor.offset = start + (pointer.value * 2)

            if (cursor.offset < offset)
              throw new Error("Invalid offset")

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

        return new AbiTuple(inner as AbiFactory.Instances<T>, heads, tails, (cursor.offset - start) / 2)
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

        const inner = new Array<AbiInstance<any>>()

        const heads = new Array<AbiInstance<any>>()
        const tails = new Array<AbiInstance<any>>()

        let end = 0

        for (const factory of AbiTuple.types) {
          if (factory.dynamic) {
            const pointer = Uint32.readOrThrow(cursor)
            heads.push(pointer)

            const offset = cursor.offset
            cursor.offset = start + pointer.value

            if (cursor.offset < offset)
              throw new Error("Invalid offset")

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

        return new AbiTuple(inner as AbiFactory.Instances<T>, heads, tails, cursor.offset - start)
      }

    }
  }

}

export namespace AbiTuple {

  export type Create<T extends readonly AbiFactory[]> =
    AbiFactory.Instances<T>

  export type From<T extends readonly AbiFactory[]> =
    AbiFactory.Froms<T>

  export type Factory<T extends readonly AbiFactory[]> =
    ReturnType<typeof AbiTuple.create<T>>

  export type Instance<T extends readonly AbiFactory[]> =
    AbiFactory.Instance<Factory<T>>

}