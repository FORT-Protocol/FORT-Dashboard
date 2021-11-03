import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {optionsTxListAtom} from "./index";
import {web3} from "../../provider";

export const currentCallOptionsDCUAtom = atomFamily({
  key: "options-currentCallOptionsDCU::value",
  default: selectorFamily({
    key: "options-currentCallOptionsDCU::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateCurrentCallOptionsDCU(txList)
    }
  })
})

const updateCurrentCallOptionsDCU = (txList: Block[]) => {
  let currentCallOptionsDCU = 0

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      if (parameters[2]) {
        currentCallOptionsDCU += Number(web3.utils.fromWei(parameters[4]))
      }
    }
  })

  return currentCallOptionsDCU
}
