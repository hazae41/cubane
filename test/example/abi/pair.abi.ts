import { Abi } from "@hazae41/cubane"

export namespace PairAbi {
  export const getReserves = {
    input: Abi.createFunctionSignature("getReserves",Abi.createFunctionSelectorAndArguments(Abi.FunctionSelector.from([9,2,241,172]),Abi.createTuple())),
    output: Abi.createTuple(Abi.Uint112, Abi.Uint112, Abi.Uint32)
  } as const
}
