/**
 * @macro delete-next-lines
 */
import { Abi } from "@hazae41/cubane";
import { $parse$ } from "./macros/parse";

function $pre$() {
  return `import { Abi } from "@hazae41/cubane"`
}

$pre$()

export namespace TokenAbi {
  export const balanceOf = {
    input: $parse$("balanceOf(address)"),
    output: Abi.Uint256
  }
}
