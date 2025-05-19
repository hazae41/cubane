import { ZeroHexString } from "@hazae41/hexane"
import { BytesLike, ZeroHexAsInteger } from "mods/convert/index.js"
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
  | RlpAccessList
  | JsAccessList
  | ZeroHexAccessList

export namespace RlpAccessList {

  export function fromOrThrow(list: AccessList): RlpAccessList {
    if (list instanceof AbstractRlpList)
      return list
    return RlpList.fromOrThrow(list.map(([address, storages]) => RlpList.fromOrThrow([RlpStringAsSelfOrInteger.fromOrThrow(address), RlpList.fromOrThrow(storages.map(storage => RlpStringAsSelfOrInteger.fromOrThrow(storage)))])))
  }

}

export namespace ZeroHexAccessList {

  export function fromOrThrow(list: AccessList): ZeroHexAccessList {
    if (list instanceof AbstractRlpList)
      return fromOrThrow(list.intoOrThrow() as JsAccessList)
    return list.map(([address, storages]) => [ZeroHexAsInteger.Length.fromOrThrow(address, 20), storages.map(storage => ZeroHexAsInteger.Length.fromOrThrow(storage, 32))])
  }

}

export namespace JsAccessList {

  export function fromOrThrow(list: AccessList) {
    return ZeroHexAccessList.fromOrThrow(list)
  }

}