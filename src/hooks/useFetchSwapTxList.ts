import {swapContractAddress} from "../constant/contract";
import {useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {useEffect} from "react";
import {swapTxListAtom} from "../state/swap";
import fetcher from "../utils/fetcher";
import {etherscanEndpoint} from "../constant/etherscan";

const env = process.env.REACT_APP_ENV || "mainnet"
const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY3 || process.env.REACT_APP_ETHERSCAN_APIKEY

const useFetchSwapTxList = () => {
  const swapAddress = ( env === "mainnet" ) ?  swapContractAddress["mainnet"] : swapContractAddress["rinkeby"]
  const api = ( env === "mainnet" ) ? etherscanEndpoint["mainnet"] : etherscanEndpoint["rinkeby"]

  const [swapTxList, setSwapTxList] = useRecoilState(swapTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)


  useEffect(() => {
    fetchAllTx()
  }, [blockNumber])

  async function fetchTxList(startblock = "0",
                             endblock = "latest",
                             sort = "asc") {
    const res = await fetcher(api + "api?module=account&action=tokentx&startblock=" + startblock
      + "&endblock=" + endblock
      + "&page=1&offset=10000&sort=" + sort
      + "&address=" + swapAddress
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
      console.log("Swap 数据可能不完整")
      singleRes = await fetchTxList(String(blockHigh), "latest")
      blockHigh = singleRes[singleRes.length - 1].blockNumber
      res = res.concat(singleRes)
    }
    console.log("Swap 统计完成")
    setSwapTxList(res)
  }

  return swapTxList
}

export default useFetchSwapTxList