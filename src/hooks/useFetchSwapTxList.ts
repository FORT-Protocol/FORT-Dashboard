import {swapContractAddress} from "../constant/contract";
import {useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {useEffect} from "react";
import {swapTxListAtom} from "../state/swap";
import fetcher from "../utils/fetcher";

const useFetchSwapTxList = (lastBlock: number = 0) => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const swapAddress = swapContractAddress
  const [swapTxList, setSwapTxList] = useRecoilState(swapTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const list = await fetcher("https://api.etherscan.com/api?module=account&action=tokentx&startblock=0&endblock=latest&page=1&offset=1000&sort=asc&address=" + swapAddress + "&apiKey="+ apiKey)
    setSwapTxList(list.result)
  }

  return swapTxList
}

export default useFetchSwapTxList