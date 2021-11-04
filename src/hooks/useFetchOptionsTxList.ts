import {optionsContractAddress} from "../constant/contract";
import {useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {useEffect} from "react";
import {optionsTxListAtom} from "../state/options";
import fetcher from "../utils/fetcher";
import {etherscanEndpoint} from "../constant/etherscan";

const env = process.env.REACT_APP_ENV || "mainnet"
const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY2 || process.env.REACT_APP_ETHERSCAN_APIKEY

const useFetchOptionsTxList = () => {
  const address = (env === "mainnet") ? optionsContractAddress["mainnet"] : optionsContractAddress["rinkeby"]
  const api = ( env === "mainnet" ) ? etherscanEndpoint["mainnet"] : etherscanEndpoint["rinkeby"]

  const [optionsTxList, setOptionsTxList] = useRecoilState(optionsTxListAtom)
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
    setOptionsTxList(list.result)
  }

  return optionsTxList
}

export default useFetchOptionsTxList
