import {optionsContractAddress} from "../constant/contract";
import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import {optionsTxListAtom} from "../state/options";
import fetcher from "../utils/fetcher";
import {api, env} from "../constant/etherscan";
import {IDLE, PROCESSING} from "../constant/status";

const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY2 || process.env.REACT_APP_ETHERSCAN_APIKEY

export const statusAtom = atom({
  key: "fetch-options::status",
  default: IDLE,
})

const useFetchOptionsTxList = () => {
  const [optionsTxList, setOptionsTxList] = useRecoilState(optionsTxListAtom)
  const address = (env === "mainnet") ? optionsContractAddress["mainnet"] : optionsContractAddress["rinkeby"]
  const [status, setStatus] = useRecoilState(statusAtom)

  useEffect(() => {
    fetchAllTx()
  }, [])

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
    setOptionsTxList(res)
    setStatus(IDLE)
  }

  return { optionsTxList, status }
}

export default useFetchOptionsTxList
