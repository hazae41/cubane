import { Abi } from "@hazae41/cubane"

export namespace TokenAbi {
  export const balanceOf = {
    input: Abi.createFunctionSignature("balanceOf",Abi.createFunctionSelectorAndArguments(Abi.FunctionSelector.from([112,160,130,49]),Abi.createTuple(Abi.Address))),
    output: Abi.Uint256
  }
}
