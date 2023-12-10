import { Abi, ZeroHexString } from "@hazae41/cubane"
import { RpcCounter, RpcRequestPreinit, RpcResponse } from "@hazae41/jsonrpc"
import { PairAbi } from "./abi/pair.abi"

export class FetchProvider {

  readonly counter = new RpcCounter()

  constructor(
    readonly info: RequestInfo,
    readonly init: RequestInit = {}
  ) { }

  async request<T>(preinit: RpcRequestPreinit) {
    const { method = "POST", ...rest } = this.init

    const body = JSON.stringify(this.counter.prepare(preinit))

    const request = new Request(this.info, { method, body, ...rest })
    request.headers.set("Content-Type", "application/json")

    const response = await fetch(request)

    if (!response.ok)
      throw new Error(response.statusText)

    return RpcResponse.from<T>(await response.json())
  }

}



const mainnet = new FetchProvider("https://ethereum.publicnode.com")

async function getBlockNumber() {
  return await mainnet.request<ZeroHexString>({
    method: "eth_blockNumber"
  }).then(r => r.mapSync(BigInt).unwrap())
}

async function getPairPrice(address: ZeroHexString) {
  const request = Abi.encodeOrThrow(PairAbi.getReserves.from())

  const response = await mainnet.request<ZeroHexString>({
    method: "eth_call",
    params: [{
      to: address,
      data: request
    }, "pending"]
  }).then(r => r.unwrap())

  const types = Abi.createTuple(Abi.Uint112, Abi.Uint112, Abi.Uint32)
  const [a, b] = Abi.decodeOrThrow(types, response).intoOrThrow()


}