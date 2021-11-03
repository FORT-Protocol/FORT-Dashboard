import {atom, useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {dcuTokenAddress, swapContractAddress} from "../constant/contract";
import {useEffect} from "react";
import {web3} from "../provider";

export const numberOfDCUAtom = atom({
  key: "swap-numberOfDCU::value",
  default: 0
})

const useNumberOfDCU = () => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const swapAddress = swapContractAddress
  const tokenAddress = dcuTokenAddress
  const api = require("etherscan-api").init(apiKey)
  const [numberOfDCU, setNumberOfDCU] = useRecoilState(numberOfDCUAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const res = await api.account.tokenbalance(swapAddress, "", tokenAddress).then((res: any) => {
      return Number(web3.utils.fromWei(res.result))
    })
    setNumberOfDCU(res)
  }

  return numberOfDCU
}

export default useNumberOfDCU