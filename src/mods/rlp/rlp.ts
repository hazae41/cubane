import { RlpList } from "./types/list.js"
import { RlpString } from "./types/string.js"

export type RlpType =
  | RlpString
  | RlpList

export type BytesOrList =
  | Uint8Array
  | BytesOrList[]

export function from(value: BytesOrList): RlpType {
  if (Array.isArray(value))
    return RlpList.from(value.map(from))
  return RlpString.from(value)
}