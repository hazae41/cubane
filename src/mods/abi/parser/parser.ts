import { Err, Ok } from "@hazae41/result";
import { StaticAddress } from "../types/address/address.js";
import { StaticBool } from "../types/bool/bool.js";
import { DynamicBytes, bytesByName } from "../types/bytes/bytes.js";
import { intByName } from "../types/int/int.js";
import { DynamicString } from "../types/string/string.js";
import { uintByName } from "../types/uint/uint.js";

import type { Readable, Writable } from "@hazae41/binary";
import type { Cursor } from "@hazae41/cursor";

type Unuseds = Readable | Writable | Cursor

export function tryGetFactory(name: string) {
  const factory = (factoryByName as any)[name]

  if (factory != null)
    return new Ok(factory)

  return new Err(new Error(`Unknown type ${name}`))
}

export const factoryByName = {
  ...uintByName,
  ...intByName,
  ...bytesByName,
  bool: StaticBool,
  address: StaticAddress,
  bytes: DynamicBytes,
  string: DynamicString,
} as const
