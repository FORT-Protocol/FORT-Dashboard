import {atom, useRecoilState} from "recoil";
import {nestTokenAddress, swapContractAddress} from "../constant/contract";
import {useEffect} from "react";
import fetcher from "../utils/fetcher";
import {web3} from "../provider";
import {api} from "../constant/etherscan";

const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY5 || process.env.REACT_APP_ETHERSCAN_APIKEY
const env = process.env.REACT_APP_ENV || "mainnet"

export const numberOfNESTAtom = atom({
  key: "swap-numberOfNESTAtom::value",
  default: 0
})

const useNumberOfNEST = () => {
  const swapAddress = (env === "mainnet") ? swapContractAddress["mainnet"] : swapContractAddress["rinkeby"]
  const tokenAddress = (env === "mainnet") ? nestTokenAddress["mainnet"] : nestTokenAddress["rinkeby"]

  const [numberOfNEST, setNumberOfNEST] = useRecoilState(numberOfNESTAtom)

  useEffect(() => {
    fetchTxList()
  }, [])

  async function fetchTxList() {
    const res = await fetcher(api + "api?module=account&action=tokenbalance&apiKey=" + apiKey + "&tag=latest&contractaddress=" + tokenAddress + "&address=" + swapAddress)
    setNumberOfNEST(Number(web3.utils.fromWei(res.result)))
  }

  return numberOfNEST
}

export default useNumberOfNEST