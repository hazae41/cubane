import { ZeroHexString } from "@hazae41/hexane"
import { BytesLike, ZeroHexAsBytes } from "mods/convert/index.js"
import { AbstractRlpList, RlpList, RlpString, RlpStringAsSelfOrInteger } from "mods/rlp/index.js"

export type JsAccessAddress = BytesLike<20>

export type JsAccessStorageItem = BytesLike<32>
export type JsAccessStorageList = JsAccessStorageItem[]

export type JsAccessItem = [JsAccessAddress, JsAccessStorageList]
export type JsAccessList = JsAccessItem[]

export type ZeroHexAccessAddress = ZeroHexString<20>

export type ZeroHexAccessStorageItem = ZeroHexString<32>
export type ZeroHexAccessStorageList = ZeroHexAccessStorageItem[]

export type ZeroHexAccessItem = [ZeroHexAccessAddress, ZeroHexAccessStorageList]
export type ZeroHexAccessList = ZeroHexAccessItem[]

export type RlpAccessAddress = RlpString

export type RlpAccessStorageItem = RlpString
export type RlpAccessStorageList = RlpList<RlpAccessStorageItem[]>

export type RlpAccessItem = RlpList<[RlpAccessAddress, RlpAccessStorageList]>
export type RlpAccessList = RlpList<RlpAccessItem[]>

export type AccessList =
  | JsAccessList
  | RlpAccessList
  | ZeroHexAccessList

export namespace RlpAccessList {

  export function fromOrThrow(list: AccessList): RlpAccessList {
    if (list instanceof AbstractRlpList)
      return list
    return RlpList.fromOrThrow(list.map(item => RlpList.fromOrThrow([RlpStringAsSelfOrInteger.fromOrThrow(item[0]), RlpList.fromOrThrow(item[1].map(subitem => RlpStringAsSelfOrInteger.fromOrThrow(subitem)))])))
  }

}

export namespace ZeroHexAccessList {

  export function fromOrThrow(list: AccessList): ZeroHexAccessList {
    if (list instanceof AbstractRlpList)
      return list.value.map(item => [ZeroHexAsBytes.Length.fromOrThrow(item.value[0].value, 20), item.value[1].value.map(subitem => ZeroHexAsBytes.Length.fromOrThrow(subitem.value, 32))])
    return list.map((item) => [ZeroHexAsBytes.Length.fromOrThrow(item[0], 20), item[1].map(subitem => ZeroHexAsBytes.Length.fromOrThrow(subitem, 32))])
  }

}

export namespace JsAccessList {

  export function fromOrThrow(list: AccessList) {
    return ZeroHexAccessList.fromOrThrow(list)
  }

}