import {optionsContractAddress} from "../constant/contract";
import {useRecoilState} from "recoil";
import {futuresTxListAtom} from "../state/futures";
import {blockNumberAtom} from "../state/app";
import {useEffect} from "react";

const useFetchOptionsTxList = (lastBlock: number) => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const address = optionsContractAddress
  const api = require("etherscan-api").init(apiKey)
  const [optionsTxList, setOptionsTxList] = useRecoilState(futuresTxListAtom)
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
