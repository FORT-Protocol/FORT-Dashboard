import {atom, useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {dcuTokenAddress, swapContractAddress} from "../constant/contract";
import {useEffect} from "react";
import fetcher from "../utils/fetcher";
import {web3} from "../provider";

export const numberOfDCUAtom = atom({
  key: "swap-numberOfDCU::value",
  default: 0
})

const useNumberOfDCU = () => {
  const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY4 || process.env.REACT_APP_ETHERSCAN_APIKEY
  const swapAddress = swapContractAddress
  const tokenAddress = dcuTokenAddress
  const [numberOfDCU, setNumberOfDCU] = useRecoilState(numberOfDCUAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const res = await fetcher("https://api.etherscan.com/api?module=account&action=tokenbalance&apiKey=" + apiKey + "&tag=latest&contractaddress=" + tokenAddress + "&address=" + swapAddress)
    setNumberOfDCU(Number(web3.utils.fromWei(res.result)))
  }

  return numberOfDCU
}

export default useNumberOfDCU