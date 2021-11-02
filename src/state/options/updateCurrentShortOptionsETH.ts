import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";

export const currentShortOptionsDCUAtom = atomFamily({
  key: "options-currentShortOptionsDCU::value",
  default: selectorFamily({
    key: "options-currentShortOptionsDCU::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateCurrentShortOptionsETH(txList)
    }
  })
})

const updateCurrentShortOptionsETH = (txList: Block[]) => {
  let currentShortOptionsDCU = 0

  txList.map((block) => {
    const func = block.input.slice(0,10)
    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      if (!parameters[2]) {
        currentShortOptionsDCU += Number(web3.utils.fromWei(parameters[4]))
      }
    }
  })

  return currentShortOptionsDCU
}

export default updateCurrentShortOptionsETH