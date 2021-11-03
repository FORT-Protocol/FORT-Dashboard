import {atom, useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {nestTokenAddress, swapContractAddress} from "../constant/contract";
import {useEffect} from "react";
import {web3} from "../provider";

export const numberOfNESTAtom = atom({
  key: "swap-numberOfNESTAtom::value",
  default: 0
})

const useNumberOfNEST = () => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const swapAddress = swapContractAddress
  const tokenAddress = nestTokenAddress
  const api = require("etherscan-api").init(apiKey)
  const [numberOfNEST, setNumberOfNEST] = useRecoilState(numberOfNESTAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const res = await api.account.tokenbalance(swapAddress, "", tokenAddress).then((res: any) => {
      return Number(web3.utils.fromWei(res.result))
    })
    setNumberOfNEST(res)
  }

  return numberOfNEST
}

export default useNumberOfNEST