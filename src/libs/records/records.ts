import { Err, Ok } from "@hazae41/result"

export namespace Records {

  export function tryResolve<K extends PropertyKey, T>(record: Record<K, T>, key: K) {
    const value = record[key]

    if (value != null)
      return new Ok(value)

    return new Err(new Error(`Could not resolve ${String(key)}`))
  }

}