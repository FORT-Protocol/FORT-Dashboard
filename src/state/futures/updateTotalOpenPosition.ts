// 更新 Total Volume 累计开仓量
import {web3} from "../../provider";
import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block} from "../app";

export const totalOpenPositionsAtom = atomFamily({
  key: "futures-totalOpenPositions::value",
  default: selectorFamily({
    key: "futures-totalOpenPositions::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateTotalOpenPosition(txList)
    }
  })
})

const updateTotalOpenPosition = (txList: Block[]) => {
  let totalOpenPosition = 0

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      totalOpenPosition += Number(web3.utils.fromWei(parameters[3]))
    }
    if (func === "0x6214f36a") {
      // buyDirect(uint256 index, uint256 fortAmount)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      totalOpenPosition += Number(web3.utils.fromWei(parameters[1]))
    }
  })
  return totalOpenPosition
}
