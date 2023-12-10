import { Abi } from "@hazae41/cubane"

export namespace EnsAbi {
  export const resolver = Abi.createFunctionSignature("resolver",Abi.createFunctionSelectorAndArguments(Abi.FunctionSelector.from([1,120,184,191]),Abi.createTuple(Abi.Bytes32)))
  export const addr = Abi.createFunctionSignature("addr",Abi.createFunctionSelectorAndArguments(Abi.FunctionSelector.from([59,59,87,222]),Abi.createTuple(Abi.Bytes32)))
  export const name = Abi.createFunctionSignature("name",Abi.createFunctionSelectorAndArguments(Abi.FunctionSelector.from([105,31,52,49]),Abi.createTuple(Abi.Bytes32)))
}
