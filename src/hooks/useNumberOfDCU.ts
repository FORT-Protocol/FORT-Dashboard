import {atom, useRecoilState} from "recoil";
import {blockNumberAtom} from "../state/app";
import {dcuTokenAddress, swapContractAddress} from "../constant/contract";
import {useEffect} from "react";
import fetcher from "../utils/fetcher";
import {web3} from "../provider";
import {etherscanEndpoint} from "../constant/etherscan";

export const numberOfDCUAtom = atom({
  key: "swap-numberOfDCU::value",
  default: 0
})

const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY4 || process.env.REACT_APP_ETHERSCAN_APIKEY
const env = process.env.REACT_APP_ENV || "mainnet"

const useNumberOfDCU = () => {
  const swapAddress = (env === "mainnet") ? swapContractAddress["mainnet"] : swapContractAddress["rinkeby"]
  const tokenAddress = (env === "mainnet") ? dcuTokenAddress["mainnet"] : dcuTokenAddress["rinkeby"]

  const api = ( env === "mainnet" ) ? etherscanEndpoint["mainnet"] : etherscanEndpoint["rinkeby"]

  const [numberOfDCU, setNumberOfDCU] = useRecoilState(numberOfDCUAtom)
  const [blockNumber] = useRecoilState(blockNumberAtom)

  useEffect(() => {
    fetchTxList()
  }, [blockNumber])

  async function fetchTxList() {
    const res = await fetcher( api +"api?module=account&action=tokenbalance&apiKey=" + apiKey + "&tag=latest&contractaddress=" + tokenAddress + "&address=" + swapAddress)
    setNumberOfDCU(Number(web3.utils.fromWei(res.result)))
  }

  return numberOfDCU
}

export default useNumberOfDCU