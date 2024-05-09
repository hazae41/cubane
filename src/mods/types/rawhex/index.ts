/**
 * Does not check if the string is a valid hex string
 */
export type RawHexString<N extends number = number> = number extends N
  ? string
  : string & { readonly length: N }

export namespace RawHexString {

  export function padStart(text: RawHexString) {
    return text.padStart(text.length + (text.length % 2), "0")
  }

  export function padEnd(text: RawHexString) {
    return text.padEnd(text.length + (text.length % 2), "0")
  }

}