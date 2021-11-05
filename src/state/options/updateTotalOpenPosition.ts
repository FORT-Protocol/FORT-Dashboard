import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {web3} from "../../provider";
import {optionsTxListAtom} from "./index";

export const totalTxVolumeAtom = atomFamily({
  key: "options-totalTxVolume::value",
  default: selectorFamily({
    key: "options-totalTxVolume::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateTotalOpenPosition(txList)
    }
  })
})

const updateTotalOpenPosition = (txList: Block[]) => {
  let totalOpenPosition = 0

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))

      totalOpenPosition += Number(web3.utils.fromWei(parameters[4]))
    }
  })
  return totalOpenPosition
}

export default updateTotalOpenPosition