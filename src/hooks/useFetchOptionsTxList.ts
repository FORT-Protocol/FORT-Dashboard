import {optionsContractAddress} from "../constant/contract";
import {useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {useEffect} from "react";
import {optionsTxListAtom} from "../state/options";
import fetcher from "../utils/fetcher";

const useFetchOptionsTxList = (lastBlock: number) => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const address = optionsContractAddress
  const [optionsTxList, setOptionsTxList] = useRecoilState(optionsTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const list = await fetcher("https://api.etherscan.com/api?module=account&action=txlist&startblock=0&endblock=latest&page=1&offset=1000&sort=asc&address=" + address + "&apiKey=" + apiKey)
    setOptionsTxList(list.result)
  }

  return optionsTxList
}

export default useFetchOptionsTxList
