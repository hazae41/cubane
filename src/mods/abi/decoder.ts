import { Readable } from "@hazae41/binary"
import { Cursor } from "@hazae41/cursor"
import { Ok, Result } from "@hazae41/result"
import { Factory, Instance } from "./abi.js"
import { Uint256 } from "./uint/uint.js"

export class Decoder {

  private constructor(
    readonly types: Factory[]
  ) { }

  static tryNew(types: Factory[]) {
    return new Ok(new Decoder(types))
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

  /**
   * Shorthand for creating a new Decoder and reading some bytes
   * @param bytes 
   * @param types 
   * @returns 
   */
  static tryDecode(bytes: Uint8Array, ...types: Factory[]): Result<Instance[], Error> {
    return Result.unthrowSync(t => {
      const decoder = Decoder.tryNew(types).throw(t)
      const instances = Readable.tryReadFromBytes(decoder, bytes).throw(t)

      return new Ok(instances)
    })
  }

}