import "@hazae41/symbol-dispose-polyfill"
import { Abi } from "../dist/esm/src/index.mjs"
import "./algorithms.js"

export const f = Abi.createFunctionSignature("f",Abi.createFunctionSelectorAndArguments(Abi.FunctionSelector.from([196,183,30,19]),Abi.createTuple(Abi.Bool,Abi.Int256,Abi.String)))