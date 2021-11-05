import {swapContractAddress} from "../constant/contract";
import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import {swapTxListAtom} from "../state/swap";
import fetcher from "../utils/fetcher";
import {api, env} from "../constant/etherscan";
import {IDLE, PROCESSING} from "../constant/status";

const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY3 || process.env.REACT_APP_ETHERSCAN_APIKEY

export const statusAtom = atom({
  key: "fetch-swap::status",
  default: IDLE,
})

const useFetchSwapTxList = () => {
  const swapAddress = ( env === "mainnet" ) ?  swapContractAddress["mainnet"] : swapContractAddress["rinkeby"]

  const [swapTxList, setSwapTxList] = useRecoilState(swapTxListAtom)
  const [status, setStatus] = useRecoilState(statusAtom)


  useEffect(() => {
    fetchAllTx()
  }, [])

  async function fetchTxList(startblock = "0",
                             endblock = "latest",
                             sort = "asc") {
    const res = await fetcher(api + "api?module=account&action=tokentx&startblock=" + startblock
      + "&endblock=" + endblock
      + "&page=1&offset=10000&sort=" + sort
      + "&address=" + swapAddress
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
    setSwapTxList(res)
    setStatus(IDLE)
  }

  return { swapTxList, status }
}

export default useFetchSwapTxList