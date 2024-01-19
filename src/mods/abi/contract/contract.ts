import { Abi, ZeroHexString } from "index.js";
import { AbiFunction, AbiInstance, Address, FunctionSelectorAndArguments } from "../index.js";

export class AbiContract<M extends Record<string, AbiFunction<any, any>>> {

  constructor(
    readonly funcs: M
  ) { }

}

export interface CallData {
  readonly to: Address
  readonly data: ZeroHexString
}

export interface Caller {
  call(data: CallData): Promise<ZeroHexString>
}

export class Contract<M extends Record<string, AbiFunction<any, any>>> {

  constructor(
    readonly address: Address,
    readonly caller: Caller,
    readonly abi: AbiContract<M>
  ) { }

  async call(key: keyof M, args: AbiFunction.Args<M[keyof M]>): Promise<AbiInstance<AbiFunction.Rets<M[keyof M]>>> {
    const func = this.abi.funcs[key]

    const input = Abi.encodeOrThrow(FunctionSelectorAndArguments.create(func.func, func.args).create(args))
    const output = await this.caller.call({ to: this.address, data: input })

    return Abi.decodeOrThrow(func.rets as AbiFunction.Rets<M[keyof M]>, output)
  }

}