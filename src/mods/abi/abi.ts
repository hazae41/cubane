import { Readable, Writable } from "@hazae41/binary";
import { Cursor } from "@hazae41/cursor";
import { Ok, Result } from "@hazae41/result";
import { Uint256 } from "./uint/uint.js";

export interface Instance extends Writable<Error, Error> {
  dynamic?: boolean
}

export function tryEncode(...instances: Instance[]): Result<Uint8Array, Error> {
  return Result.unthrowSync(t => {
    let length = 0
    let offset = instances.length * 32

    const head = new Array<Writable<Error, Error>>()
    const body = new Array<Writable<Error, Error>>()

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

    const cursor = Cursor.tryAllocUnsafe(length).throw(t)

    for (const instance of head)
      instance.tryWrite(cursor).throw(t)
    for (const instance of body)
      instance.tryWrite(cursor).throw(t)

    return new Ok(cursor.bytes)
  })
}

export interface Type extends Readable<Instance, Error> {
  dynamic?: boolean
}

export function tryDecode(bytes: Uint8Array, ...types: Type[]): Result<Instance[], Error> {
  return Result.unthrowSync(t => {
    const cursor = new Cursor(bytes)
    const result = new Array<Instance>()

    for (const type of types) {
      if (type.dynamic) {
        const pointer = Number(Uint256.tryRead(cursor).throw(t).value)
        result.push(type.tryRead(new Cursor(bytes.slice(pointer))).throw(t))
      } else {
        result.push(type.tryRead(cursor).throw(t))
      }
    }

    return new Ok(result)
  })
}