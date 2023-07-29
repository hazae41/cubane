import { Readable, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory, Instance } from "../abi.js";
import { Uint256 } from "../uint/uint.js";

export type Instanced<Tuple extends readonly Factory[]> = {
  [Index in keyof Tuple]: Readable.ReadOutput<Tuple[Index]>
}

export interface Tuple<T extends readonly Factory[]> extends Writable<never, Error> {
  readonly class: Factory<Tuple<T>>
  readonly inner: Instanced<T>
}

export const createTuple = <T extends readonly Factory[]>(...factories: T) => class Class {
  readonly #class = Class

  private constructor(
    readonly inner: Instanced<T>,
    readonly heads: Instance[],
    readonly tails: Instance[],
    readonly size: number,
  ) { }

  static tryNew(...instances: Instanced<T>): Result<Class, Error> {
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

      return new Ok(new Class(instances, heads, tails, length))
    })
  }

  get class() {
    return this.#class
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

  static tryRead(cursor: Cursor): Result<Tuple<T>, Error> {
    return Result.unthrowSync(t => {
      const start = cursor.offset

      const subcursor = new Cursor(cursor.after)

      const inner = new Array<Instance>()
      const heads = new Array<Instance>()
      const tails = new Array<Instance>()

      for (const factory of factories) {
        if (factory.dynamic) {
          const pointer = Uint256.tryRead(cursor).throw(t)
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

      cursor.offset = Math.max(cursor.offset, subcursor.offset)
      const size = cursor.offset - start

      return new Ok(new Class(inner as Instanced<T>, heads, tails, size))
    })
  }

}