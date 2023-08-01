import { RlpList, RlpString } from "./index.js"

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