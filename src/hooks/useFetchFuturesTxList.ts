import { useRecoilState } from "recoil"
import { futuresTxListAtom } from "../state/futures"
import { blockNumberAtom } from "../state/app"
import { useEffect } from "react"
import { futuresContractAddress } from "../constant/contract"
import fetcher from "../utils/fetcher";

const useFetchFuturesTxList = (lastBlock: number = 0) => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const address = futuresContractAddress
  const [futuresTxList, setFuturesTxList] = useRecoilState(futuresTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const list = await fetcher("https://api.etherscan.com/api?module=account&action=txlist&startblock=0&endblock=latest&page=1&offset=1000&sort=asc&address=" + address + "&apiKey=" + apiKey)
    setFuturesTxList(list.result)
  }

  return futuresTxList
}

export default useFetchFuturesTxList
