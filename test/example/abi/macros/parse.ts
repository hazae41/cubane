import "@hazae41/symbol-dispose-polyfill"

import { Abi } from "@hazae41/cubane"
import { Keccak256 } from "@hazae41/keccak256"

export function $parse$(signature: string): Abi.FunctionSignatureFactory {
  return (async () => {
    Keccak256.set(await Keccak256.fromMorax())
    return Abi.FunctionSignature.$parse$(signature)
  })() as any
}