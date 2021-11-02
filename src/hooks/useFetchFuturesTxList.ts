import { useRecoilState } from "recoil"
import { futuresTxListAtom } from "../state/futures"
import { blockNumberAtom } from "../state/app"
import { useEffect } from "react"
import { futuresContractAddress } from "../constant/contract"

const useFetchFuturesTxList = (lastBlock: number = 0) => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const address = futuresContractAddress
  const api = require("etherscan-api").init(apiKey)
  const [futuresTxList, setFuturesTxList] = useRecoilState(futuresTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const list = await api.account.txlist(address, lastBlock, "latest", 1, 100, "asc").then((res: any) => {
      return res.result
    })
    setFuturesTxList(list)
  }

  return futuresTxList
}

export default useFetchFuturesTxList
