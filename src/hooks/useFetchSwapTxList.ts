import {dcuTokenContractAddress} from "../constant/contract";
import {useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {useEffect} from "react";
import {swapTxListAtom} from "../state/swap";

const useFetchSwapTxList = (lastBlock: number = 0) => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const tokenAddress = dcuTokenContractAddress
  const api = require("etherscan-api").init(apiKey)
  const [swapTxList, setSwapTxList] = useRecoilState(swapTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const list = await api.account.tokentx(tokenAddress, null, lastBlock, 'latest', 1, 100, 'asc').then((res: any) => {
      return res.result
    })
    setSwapTxList(list)
  }

  return swapTxList
}

export default useFetchSwapTxList