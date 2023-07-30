import { Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory } from "mods/abi/abi.js";
import { DecodingError } from "mods/abi/errors/errors.js";
import { ReadOutputs } from "../tuple/tuple.js";
import { Uint256 } from "../uint/uint.js";

export interface StaticArray<T extends Factory, N extends number> extends Writable<never, Error> {
  readonly class: Factory<StaticArray<T, N>>
  readonly inner: ReadOutputs<T[]> & { length: N }
  readonly count: N
}

export const createStaticArray = <T extends Factory, N extends number>(factory: T, count: N) => class Class {
  readonly #class = Class

  static readonly count = count

  private constructor(
    readonly inner: ReadOutputs<T[]> & { length: N },
    readonly heads: Writable<never, Error>[],
    readonly tails: Writable<never, Error>[],
    readonly size: number,
  ) { }

  static new(...instances: ReadOutputs<T[]> & { length: N }): Class {
    let length = 0
    let offset = instances.length * 32

    const heads = new Array<Writable<never, Error>>()
    const tails = new Array<Writable<never, Error>>()

    for (const instance of instances) {
      const size = instance.trySize().get()

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

    return new Class(instances, heads, tails, length)
  }

  get class() {
    return this.#class
  }

  get count() {
    return this.#class.count
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

  static tryRead(cursor: Cursor): Result<StaticArray<T, N>, DecodingError> {
    return Result.unthrowSync(t => {
      const start = cursor.offset

      const subcursor = new Cursor(cursor.after)

      const inner = new Array<Writable<never, Error>>()

      const heads = new Array<Writable<never, Error>>()
      const tails = new Array<Writable<never, Error>>()

      for (let i = 0; i < this.count; i++) {
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

      const size = Math.max(cursor.offset - start, subcursor.offset)

      cursor.offset = start + size

      return new Ok(new Class(inner as ReadOutputs<T[]> & { length: N }, heads, tails, size))
    })
  }

}