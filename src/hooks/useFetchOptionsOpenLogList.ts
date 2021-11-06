import {atom, useRecoilState} from "recoil";
import {api, env} from "../constant/etherscan";
import {optionsContractAddress} from "../constant/contract";
import {useEffect} from "react";
import fetcher from "../utils/fetcher";

const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY5

export const optionsOpenLogListAtom = atom({
  key: "fetch-optionsOpenLogList::status",
  default: [],
})

const useFetchOptionsOpenLogList = () => {
  const [logsList, setLogsList] = useRecoilState(optionsOpenLogListAtom)
  const address = ( env === "mainnet" ) ?  optionsContractAddress["mainnet"] : optionsContractAddress["rinkeby"]
  const topic = "0x39b02417d6826eadf5421ac690db0dd00065bb988a2f8cd32341c68d74d36beb"

  useEffect(() => {
    fetchAllTx()
  },[])

  async function fetchTxList(startblock = "0",
                             endblock = "latest") {
    const res = await fetcher(api + "api?module=logs&action=getLogs&fromBlock=" + startblock
      + "&toBlock=" + endblock
      + "&address=" + address
      + "&topic0=" + topic
      + "&apiKey=" + apiKey)
    return res.result
  }

  async function fetchAllTx() {
    let blockHigh = 0
    let res: never[] = []

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms))
    }

    while(res.length % 1000 === 0 ){
      let request
      request = await fetchTxList(String(blockHigh), "latest")
      blockHigh = Number(request[request.length - 1].blockNumber) + 1
      res = res.concat(request)
      await sleep(500);
    }
    setLogsList(res)
  }
  return { logsList }
}

export default useFetchOptionsOpenLogList