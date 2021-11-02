import {optionsContractAddress} from "../constant/contract";
import {useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {useEffect} from "react";
import {optionsTxListAtom} from "../state/options";

const useFetchOptionsTxList = (lastBlock: number) => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const address = optionsContractAddress
  const api = require("etherscan-api").init(apiKey)
  const [optionsTxList, setOptionsTxList] = useRecoilState(optionsTxListAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const list = await api.account.txlist(address, lastBlock, "latest", 1, 100, "asc").then((res: any) => {
      return res.result
    })
    setOptionsTxList(list)
  }

  return optionsTxList
}

export default useFetchOptionsTxList
