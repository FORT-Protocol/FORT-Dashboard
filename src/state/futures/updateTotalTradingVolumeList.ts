import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import updateTotalTxVolume from "./updateTotalTxVolume";
import {Block} from "../app";
import {web3} from "../../provider";

export const totalTradingVolumeListAtom = atomFamily({
  key: "futures-totalTradingVolumeList::value",
  default: selectorFamily({
    key: "futures-totalTradingVolumeList::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateTotalTxVolume(txList)
    }
  })
})

const updateTotalTradingVolumeList = (txList: Block[]) => {
  let total = 0
  txList.map((block) => {
    const func = block.input.slice(0,10)
    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      total += Number(web3.utils.fromWei(parameters[3]))
    }

    if (func === "0xd79875eb"){
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      console.log(parameters[0], parameters[1])
    }
  })

  return
}

export default updateTotalTradingVolumeList