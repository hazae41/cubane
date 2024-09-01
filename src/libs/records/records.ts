export namespace Records {

  export function resolveOrThrow<K extends PropertyKey, T>(record: Record<K, T>, key: K) {
    const value = record[key]

    if (value != null)
      return value

    throw new Error(`Could not resolve ${String(key)}`)
  }

}