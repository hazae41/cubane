import { Cursor } from "@hazae41/cursor"
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

export function readOrThrow(cursor: Cursor) {
  const first = cursor.readUint8OrThrow()

  if (first < 0x80)
    return RlpString1.readOrThrow(cursor)
  if (first < 184)
    return RlpString55.readOrThrow(cursor)
  if (first === 184)
    return RlpStringUint8.readOrThrow(cursor)
  if (first === 185)
    return RlpStringUint16.readOrThrow(cursor)
  if (first === 186)
    return RlpStringUint24.readOrThrow(cursor)
  if (first === 187)
    return RlpStringUint32.readOrThrow(cursor)
  if (first < 192)
    throw new Error(`String too long`)
  if (first < 248)
    return RlpList55.readOrThrow(cursor)
  if (first === 248)
    return RlpListUint8.readOrThrow(cursor)
  if (first === 249)
    return RlpListUint16.readOrThrow(cursor)
  if (first === 250)
    return RlpListUint24.readOrThrow(cursor)
  if (first === 251)
    return RlpListUint32.readOrThrow(cursor)
  if (first < 256)
    throw new Error(`List too long`)
  throw new Error(`Unknown RLP type ${first}`)
}