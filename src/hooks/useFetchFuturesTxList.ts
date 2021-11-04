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
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList(startblock = "0",
                             endblock = "latest",
                             offset = "10000",
                             page = "1",
                             sort = "asc") {
    const list = await fetcher(api + "api?module=account&action=txlist&startblock=" + startblock
      + "&endblock=" + endblock
      + "&page=" + page
      + "&offset=" + offset
      + "&sort=" + sort
      + "&address=" + address
      + "&apiKey=" + apiKey)
    setFuturesTxList(list.result)
  }

  return futuresTxList
}

export default useFetchFuturesTxList
