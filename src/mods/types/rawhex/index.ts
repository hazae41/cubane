/**
 * Does not check if the string is a valid hex string
 */
export type RawHexString<N extends number = number> = number extends N
  ? string
  : string & { readonly length: N }