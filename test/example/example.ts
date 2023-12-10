import { Abi, Fixed, ZeroHexFixed, ZeroHexString } from "@hazae41/cubane"
import { RpcCounter, RpcRequestPreinit, RpcResponse } from "@hazae41/jsonrpc"
import { PairAbi } from "./abi/pair.abi"

interface Callable<I extends readonly Abi.Factory[], O extends Abi.Factory> {
  readonly input: Abi.FunctionSignatureFactory<I>
  readonly output: O
}

class FetchProvider {

  readonly counter = new RpcCounter()

  constructor(
    readonly info: RequestInfo,
    readonly init: RequestInit = {}
  ) { }

  async request<T>(data: RpcRequestPreinit) {
    const { method = "POST", ...rest } = this.init

    const body = JSON.stringify(this.counter.prepare(data))

    const request = new Request(this.info, { method, body, ...rest })
    request.headers.set("Content-Type", "application/json")

    const response = await fetch(request)

    if (!response.ok)
      throw new Error(response.statusText)

    return RpcResponse.from<T>(await response.json())
  }

  async call<I extends readonly Abi.Factory[], O extends Abi.Factory>(address: ZeroHexString, callable: Callable<I, O>, ...args: Abi.Factory.Froms<I>) {
    const { input, output } = callable

    const response = await this.request<ZeroHexString>({
      method: "eth_call",
      params: [{
        to: address,
        data: Abi.encodeOrThrow(input.from(...args))
      }, "pending"]
    }).then(r => r.unwrap())

    return Abi.decodeOrThrow(output, response).intoOrThrow() as Abi.Factory.Into<O>
  }

}

const mainnet = new FetchProvider("https://ethereum.publicnode.com", { cache: "no-cache" })

async function getBlockNumber() {
  return await mainnet.request<ZeroHexString>({
    method: "eth_blockNumber"
  }).then(r => r.mapSync(BigInt).unwrap())
}

async function getBalance(address: ZeroHexString) {
  const response = await mainnet.request<ZeroHexString>({
    method: "eth_getBalance",
    params: [address, "latest"]
  }).then(r => r.unwrap())
  console.log(response)

  return Fixed.fromJSON(new ZeroHexFixed(response, 18))
}

interface PairInfo {
  readonly address: ZeroHexString
  readonly decimals0: number
  readonly decimals1: number
}

async function getPairPrice(pair: PairInfo, reversed = false) {
  const [reserve0, reserve1] = await mainnet.call(pair.address, PairAbi.getReserves)

  const quantity0 = new Fixed(reserve0, pair.decimals0)
  const quantity1 = new Fixed(reserve1, pair.decimals1)

  if (reversed)
    return quantity0.div(quantity1)

  return quantity1.div(quantity0)
}

async function main() {
  const vitalik = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"

  const blockNumber = await getBlockNumber()

  console.log("Pending block", blockNumber.toString())

  const balance = await getBalance(vitalik)

  const price = await getPairPrice({
    address: "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
    decimals0: 18,
    decimals1: 6,
  })

  console.log(`Current price of ETH/USD is ${price}`)

  console.log(`Vitalik has ${balance} ETH which is worth ${balance.mul(price)}`)
}

await main()