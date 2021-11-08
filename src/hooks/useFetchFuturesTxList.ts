import {atom, useRecoilState} from "recoil"
import {futuresTxListAtom} from "../state/futures"
import {useEffect} from "react"
import fetcher from "../utils/fetcher";
import {api, env} from "../constant/etherscan";
import {IDLE, PROCESSING} from "../constant/status";
import {futuresContractAddress} from "../constant/contract";
import {Block} from "../state/app";

const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY

export const statusAtom = atom({
  key: "fetch-futures::status",
  default: IDLE,
})

const useFetchFuturesTxList = () => {
  const address = ( env === "mainnet" ) ?  futuresContractAddress["mainnet"] : futuresContractAddress["rinkeby"]
  const [futuresTxList, setFuturesTxList] = useRecoilState(futuresTxListAtom)
  const [status, setStatus] = useRecoilState(statusAtom)

  useEffect(() => {
    fetchAllTx()
  },[])

  async function fetchTxList(startblock = "0",
                             endblock = "latest",
                             sort = "asc") {
    const res = await fetcher(api + "api?module=account&action=txlist&startblock=" + startblock
      + "&endblock=" + endblock
      + "&page=1&offset=10000&sort=" + sort
      + "&address=" + address
      + "&apiKey=" + apiKey)
    return res.result
  }

  async function fetchAllTx() {
    let blockHigh = 0
    let res: never[] = []

    setStatus(PROCESSING)
    while(res.length % 10000 === 0 ){
      let request
      request = await fetchTxList(String(blockHigh), "latest")
      blockHigh = Number(request[request.length - 1].blockNumber) + 1
      res = res.concat(request)
    }
    setFuturesTxList(res.filter((block: Block)=>{
      return block.isError === "0"
    }))
    setStatus(IDLE)
  }

  return { futuresTxList, status }
}

export default useFetchFuturesTxList
