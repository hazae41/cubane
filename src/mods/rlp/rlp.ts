import { BinaryWriteError, Readable, Writable } from "@hazae41/binary"
import { Bytes } from "@hazae41/bytes"
import { Cursor } from "@hazae41/cursor"
import { Err, Result } from "@hazae41/result"
import { RlpList, RlpList55, RlpListUint16, RlpListUint24, RlpListUint32, RlpListUint8 } from "./types/list.js"
import { RlpString, RlpString1, RlpString55, RlpStringUint16, RlpStringUint24, RlpStringUint32, RlpStringUint8 } from "./types/string.js"

export type RlpType =
  | RlpString
  | RlpList

export type BytesOrBytesArray =
  | Uint8Array
  | BytesOrBytesArray[]

export function fromPrimitive(value: BytesOrBytesArray): RlpType {
  if (Array.isArray(value))
    return RlpList.from(value.map(fromPrimitive))
  return RlpString.from(value)
}

export function toPrimitive(value: RlpType): BytesOrBytesArray {
  if (value.isString())
    return value.value
  return value.value.map(toPrimitive)
}

export function tryWriteToBytes(value: BytesOrBytesArray): Result<Bytes, BinaryWriteError> {
  return Writable.tryWriteToBytes(fromPrimitive(value))
}

export function tryReadFromBytes(bytes: Uint8Array): Result<BytesOrBytesArray, Error> {
  return Readable.tryReadFromBytes({ tryRead }, bytes).mapSync(toPrimitive)
}

export function tryRead(cursor: Cursor): Result<RlpType, Error> {
  return Result.unthrowSync(t => {
    const first = cursor.tryGetUint8().throw(t)

    if (first < 0x80)
      return RlpString1.tryRead(cursor)
    if (first < 184)
      return RlpString55.tryRead(cursor)
    if (first === 184)
      return RlpStringUint8.tryRead(cursor)
    if (first === 185)
      return RlpStringUint16.tryRead(cursor)
    if (first === 186)
      return RlpStringUint24.tryRead(cursor)
    if (first === 187)
      return RlpStringUint32.tryRead(cursor)
    if (first < 192)
      return new Err(new Error(`String too long`))
    if (first < 248)
      return RlpList55.tryRead(cursor)
    if (first === 248)
      return RlpListUint8.tryRead(cursor)
    if (first === 249)
      return RlpListUint16.tryRead(cursor)
    if (first === 250)
      return RlpListUint24.tryRead(cursor)
    if (first === 251)
      return RlpListUint32.tryRead(cursor)
    if (first < 256)
      return new Err(new Error(`List too long`))
    return new Err(new Error(`Unknown RLP type`))
  })
}