import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Factory, Instance } from "../abi.js";
import { Uint256 } from "../uint/uint.js";

export class WritableTuple {

  private constructor(
    readonly heads: Instance[],
    readonly tails: Instance[],
    readonly size: number,
  ) { }

  static tryNew(instances: Instance[]): Result<WritableTuple, Error> {
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

      return new Ok(new WritableTuple(heads, tails, length))
    })
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

}

export class ReadableTuple {

  private constructor(
    readonly types: Factory[]
  ) { }

  static tryNew(types: Factory[]) {
    return new Ok(new ReadableTuple(types))
  }

  tryRead(cursor: Cursor): Result<Instance[], Error> {
    return Result.unthrowSync(t => {
      const subcursor = new Cursor(cursor.after)
      const result = new Array<Instance>()

      for (const type of this.types) {
        if (type.dynamic) {
          const pointer = Uint256.tryRead(cursor).throw(t)
          subcursor.offset = Number(pointer.value)
          result.push(type.tryRead(subcursor).throw(t))
        } else {
          result.push(type.tryRead(cursor).throw(t))
        }
      }

      cursor.offset = Math.max(cursor.offset, subcursor.offset)

      return new Ok(result)
    })
  }

}