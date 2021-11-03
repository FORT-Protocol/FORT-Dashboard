import {swapContractAddress} from "../constant/contract";
import {useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {useEffect} from "react";
import {swapTxListAtom} from "../state/swap";
import fetcher from "../utils/fetcher";

const useFetchSwapTxList = () => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const swapAddress = swapContractAddress
  const [swapTxList, setSwapTxList] = useRecoilState(swapTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList(startblock = "0",
                             endblock = "latest",
                             offset = "1000",
                             page = "1",
                             sort = "asc") {
    const list = await fetcher("https://api.etherscan.com/api?module=account&action=tokentx&startblock=" + startblock
      + "&endblock=" + endblock
      + "&page=" + page
      + "&offset=" + offset
      + "&sort=" + sort
      + "&address=" + swapAddress
      + "&apiKey=" + apiKey)
    setSwapTxList(list.result)
  }

  return swapTxList
}

export default useFetchSwapTxList