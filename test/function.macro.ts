import "@hazae41/symbol-dispose-polyfill"
import { Abi } from "../dist/esm/src/index.mjs"
import "./algorithms.js"

export const f = Abi.FunctionSignature.$parse$("f(bool,uint256,string)")