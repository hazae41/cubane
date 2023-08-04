import { Err, Ok } from "@hazae41/result"

export namespace Records {

  export function tryResolve<T>(record: Record<string, T>, name: string) {
    const factory = record[name]

    if (factory != null)
      return new Ok(factory)

    return new Err(new Error(`Could not resolve ${name}`))
  }

}