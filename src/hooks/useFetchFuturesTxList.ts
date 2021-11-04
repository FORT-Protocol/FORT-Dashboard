import {useRecoilState} from "recoil"
import {futuresTxListAtom} from "../state/futures"
import {blockNumberAtom} from "../state/app"
import {useEffect} from "react"
import {futuresContractAddress} from "../constant/contract"
import fetcher from "../utils/fetcher";
import {etherscanEndpoint} from "../constant/etherscan";

const env = process.env.REACT_APP_ENV || "mainnet"
const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY || process.env.REACT_APP_ETHERSCAN_APIKEY

const useFetchFuturesTxList = () => {
  const address = ( env === "mainnet" ) ?  futuresContractAddress["mainnet"] : futuresContractAddress["rinkeby"]
  const api = ( env === "mainnet" ) ? etherscanEndpoint["mainnet"] : etherscanEndpoint["rinkeby"]

  const [futuresTxList, setFuturesTxList] = useRecoilState(futuresTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchAllTx()
  }, [blockNumber])

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
    let singleRes
    let blockHigh
    let res
    singleRes = await fetchTxList("0", "latest")
    blockHigh = Number(singleRes[singleRes.length - 1].blockNumber)
    res = singleRes

    while(singleRes.length === 10000 ){
      console.log("Futures 数据可能不完整")
      singleRes = await fetchTxList(String(blockHigh), "latest")
      blockHigh = singleRes[singleRes.length - 1].blockNumber
      res = res.concat(singleRes)
    }
    console.log("Futures 统计完成")
    setFuturesTxList(res)
  }

  return futuresTxList
}

export default useFetchFuturesTxList
