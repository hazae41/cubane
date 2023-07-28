import { Writable } from "@hazae41/binary"
import { Cursor } from "@hazae41/cursor"
import { Ok, Result } from "@hazae41/result"
import { Instance } from "./abi.js"
import { Uint256 } from "./uint/uint.js"


export class Encoder {

  private constructor(
    readonly head: Instance[],
    readonly body: Instance[],
    readonly size: number,
  ) { }

  static tryNew(instances: Instance[]): Result<Encoder, Error> {
    return Result.unthrowSync(t => {
      let length = 0
      let offset = instances.length * 32

      const head = new Array<Instance>()
      const body = new Array<Instance>()

      for (const instance of instances) {
        const size = instance.trySize().throw(t)

        if (instance.dynamic) {
          const pointer = Uint256.new(BigInt(offset))

          head.push(pointer)
          length += 32

          body.push(instance)
          length += size
          offset += size
        } else {
          head.push(instance)
          length += size
        }
      }

      return new Ok(new Encoder(head, body, length))
    })
  }

  trySize(): Result<number, never> {
    return new Ok(this.size)
  }

  tryWrite(cursor: Cursor): Result<void, Error> {
    return Result.unthrowSync(t => {
      for (const instance of this.head)
        instance.tryWrite(cursor).throw(t)
      for (const instance of this.body)
        instance.tryWrite(cursor).throw(t)
      return Ok.void()
    })
  }

  static tryEncode(...instances: Instance[]): Result<Uint8Array, Error> {
    return Result.unthrowSync(t => {
      const encoder = Encoder.tryNew(instances).throw(t)
      const bytes = Writable.tryWriteToBytes(encoder).throw(t)

      return new Ok(bytes)
    })
  }

}