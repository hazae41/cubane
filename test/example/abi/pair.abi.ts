import { Abi } from "@hazae41/cubane"

export namespace PairAbi {
  export const getReserves = Abi.createFunctionSignature("getReserves",Abi.createFunctionSelectorAndArguments(Abi.FunctionSelector.from([9,2,241,172]),Abi.createTuple()))
}
