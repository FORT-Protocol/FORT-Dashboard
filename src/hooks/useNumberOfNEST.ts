import {atom, useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {nestTokenAddress, swapContractAddress} from "../constant/contract";
import {useEffect} from "react";
import fetcher from "../utils/fetcher";

export const numberOfNESTAtom = atom({
  key: "swap-numberOfNESTAtom::value",
  default: 0
})

const useNumberOfNEST = () => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY
  const swapAddress = swapContractAddress
  const tokenAddress = nestTokenAddress
  const [numberOfNEST, setNumberOfNEST] = useRecoilState(numberOfNESTAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const res = await fetcher("https://api.etherscan.com/api?module=account&action=tokenbalance&apiKey=" + apiKey + "&tag=latest&contractaddress=" + tokenAddress + "&address=" + swapAddress)
    setNumberOfNEST(res.result)
  }

  return numberOfNEST
}

export default useNumberOfNEST