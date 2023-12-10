/**
 * @macro delete-next-lines
 */
import { Abi } from "@hazae41/cubane";
import { $parse$ } from "./macros/parse";

function $pre$() {
  return `import { Abi } from "@hazae41/cubane"`
}

$pre$()

export namespace PairAbi {
  export const getReserves = {
    input: $parse$("getReserves()"),
    output: Abi.createTuple(Abi.Uint112, Abi.Uint112, Abi.Uint32)
  } as const
}
