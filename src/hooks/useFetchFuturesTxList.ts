import {useRecoilState} from "recoil"
import {futuresTxListAtom} from "../state/futures"
import {blockNumberAtom} from "../state/app"
import {useEffect} from "react"
import {futuresContractAddress} from "../constant/contract"
import fetcher from "../utils/fetcher";

const useFetchFuturesTxList = () => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const address = futuresContractAddress
  const [futuresTxList, setFuturesTxList] = useRecoilState(futuresTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList(startblock = "0",
                             endblock = "latest",
                             offset = "1000",
                             page = "1",
                             sort = "asc") {
    const list = await fetcher("https://api.etherscan.com/api?module=account&action=txlist&startblock=" + startblock
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
