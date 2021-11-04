import {swapContractAddress} from "../constant/contract";
import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import {swapTxListAtom} from "../state/swap";
import fetcher from "../utils/fetcher";
import {etherscanEndpoint} from "../constant/etherscan";
import {IDLE, PROCESSING} from "../constant/status";

const env = process.env.REACT_APP_ENV || "mainnet"
const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY3 || process.env.REACT_APP_ETHERSCAN_APIKEY

export const statusAtom = atom({
  key: "fetch-swap::status",
  default: IDLE,
})

const useFetchSwapTxList = () => {
  const swapAddress = ( env === "mainnet" ) ?  swapContractAddress["mainnet"] : swapContractAddress["rinkeby"]
  const api = ( env === "mainnet" ) ? etherscanEndpoint["mainnet"] : etherscanEndpoint["rinkeby"]

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
      blockHigh = request[request.length - 1].blockNumber
      res = res.concat(request)
    }
    setSwapTxList(res)
    setStatus(IDLE)
  }
}

export default useFetchSwapTxList