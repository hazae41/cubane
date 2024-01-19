import { Cursor } from "@hazae41/cursor";
import { AbiFactory, AbiInstance } from "mods/abi/types.js";

import { TextCursor } from "libs/cursor/cursor.js";
import { Uint32 } from "../uint/uint.js";

export { AbiVector as Vector };

export class AbiVector {

  private constructor() { }

  static create<T extends AbiFactory>($type: T) {
    return class AbiVector {
      readonly #class = AbiVector
      readonly name = this.#class.name

      static readonly type = $type
      static readonly dynamic = true

      readonly type = this.#class.type
      readonly dynamic = this.#class.dynamic

      private constructor(
        readonly inner: AbiFactory.Instances<T[]>,
        readonly heads: AbiInstance[],
        readonly tails: AbiInstance[],
        readonly size: number,
      ) { }

      static create(instances: AbiFactory.Instances<T[]>) {
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

        return new AbiVector(instances, heads, tails, length)
      }

      static from(primitives: AbiFactory.Froms<T[]>) {
        const result: AbiInstance<any>[] = new Array(primitives.length)

        for (let i = 0; i < primitives.length; i++)
          result[i] = AbiVector.type.from(primitives[i])

        return AbiVector.create(result as any as AbiFactory.Instances<T[]>)
      }

      intoOrThrow() {
        return this.inner.map(it => it.intoOrThrow()) as AbiFactory.Intos<T[]>
      }

      toJSON() {
        return this.inner.map(it => it.toJSON()) as AbiFactory.Jsons<T[]>
      }

      static codegen() {
        return `Abi.Vector.create(${this.type.codegen()})`
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

        if (length > 256)
          throw new Error("Invalid length")

        const start = cursor.offset

        const inner = new Array<AbiInstance<any>>()

        const heads = new Array<AbiInstance<any>>()
        const tails = new Array<AbiInstance<any>>()

        let end = 0

        for (let i = 0; i < length; i++) {
          if (AbiVector.type.dynamic) {
            const pointer = Uint32.decodeOrThrow(cursor)
            heads.push(pointer)

            const offset = cursor.offset
            cursor.offset = start + (pointer.value * 2)

            if (cursor.offset < offset)
              throw new Error("Invalid offset")

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

        return new AbiVector(inner as any as AbiFactory.Instances<T[]>, heads, tails, (cursor.offset - start) / 2)
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

        if (length > 256)
          throw new Error("Invalid length")

        const start = cursor.offset

        const inner = new Array<AbiInstance<any>>()

        const heads = new Array<AbiInstance<any>>()
        const tails = new Array<AbiInstance<any>>()

        let end = 0

        for (let i = 0; i < length; i++) {
          if (AbiVector.type.dynamic) {
            const pointer = Uint32.readOrThrow(cursor)
            heads.push(pointer)

            const offset = cursor.offset
            cursor.offset = start + pointer.value

            if (cursor.offset < offset)
              throw new Error("Invalid offset")

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

        return new AbiVector(inner as any as AbiFactory.Instances<T[]>, heads, tails, cursor.offset - start)
      }

    }
  }

}

export namespace AbiVector {

  export type Factory<T extends AbiFactory> =
    ReturnType<typeof AbiVector.create<T>>

  export type Instance<T extends AbiFactory> =
    AbiFactory.Instance<Factory<T>>

}