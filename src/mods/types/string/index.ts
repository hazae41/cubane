declare global {
  interface SymbolConstructor {
    readonly isZeroHex: symbol
    readonly isRawHex: symbol
  }
}

export type ZeroHexString<N extends number = number> = number extends N
  ? `0x${string}` & { readonly [Symbol.isZeroHex]: true }
  : `0x${string}` & { readonly [Symbol.isZeroHex]: true } & { readonly length: N }

export namespace ZeroHexString {

  export type Unsafe<N extends number = number> = number extends N
    ? `0x${string}`
    : `0x${string}` & { readonly length: N }

  export namespace Unsafe {

    export function as(value: Unsafe) {
      return value as ZeroHexString
    }

    export function is(value: Unsafe): value is ZeroHexString {
      return /^0x[0-9a-fA-F]*$/.test(value)
    }

  }

  export namespace String {

    export function as(value: string) {
      return value as ZeroHexString
    }

    export function is(value: string): value is ZeroHexString {
      return /^0x[0-9a-fA-F]*$/.test(value)
    }

  }

  export namespace Unknown {

    export function as(value: unknown) {
      return value as ZeroHexString
    }

    export function is(value: unknown): value is ZeroHexString {
      return typeof value === "string" && /^0x[0-9a-fA-F]*$/.test(value)
    }
  }

  export function fromRawHex(value: RawHexString): ZeroHexString {
    return `0x${value}` as ZeroHexString
  }

}

export type RawHexString<N extends number = number> = number extends N
  ? string & { readonly [Symbol.isRawHex]: true }
  : string & { readonly [Symbol.isRawHex]: true } & { readonly length: N }

export namespace RawHexString {

  export namespace String {

    export function as(value: string) {
      return value as RawHexString
    }

    export function is(value: string): value is RawHexString {
      return /^[0-9a-fA-F]*$/.test(value)
    }

  }

  export namespace Unknown {

    export function as(value: unknown) {
      return value as RawHexString
    }

    export function is(value: unknown): value is RawHexString {
      return typeof value === "string" && /^[0-9a-fA-F]*$/.test(value)
    }

  }

  export function fromZeroHex(value: ZeroHexString): RawHexString {
    return value.slice(2) as RawHexString
  }

  export function padStart(text: RawHexString) {
    return text.padStart(text.length + (text.length % 2), "0") as RawHexString
  }

  export function padEnd(text: RawHexString) {
    return text.padEnd(text.length + (text.length % 2), "0") as RawHexString
  }

}

