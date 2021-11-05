import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {futuresTxListAtom} from "./index";
import {web3} from "../../provider";

export const longShortDistributionAtom = atomFamily({
  key: "futures-longShortDistribution::value",
  default: selectorFamily({
    key: "futures-longShortDistribution::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateLongShortDistribution(txList)
    }
  })
})

const updateLongShortDistribution = (txList: Block[]) => {
  // long、short
  let distribution = [0, 0]

  txList.forEach((block) => {
    const func = block.input.slice(0, 10)
    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      if (parameters[2]) {
        distribution[0] += Number(web3.utils.fromWei(parameters[3]))
      }
      if (!parameters[2]) {
        distribution[1] += Number(web3.utils.fromWei(parameters[3]))
      }
    }

    if (func === "0x6214f36a") {
      // buyDirect(uint256 index, uint256 fortAmount)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      if (Number(parameters[0]) <= 5) {
        distribution[0] += Number(web3.utils.fromWei(parameters[1]))
      }
      if (Number(parameters[0]) > 5) {
        distribution[1] += Number(web3.utils.fromWei(parameters[1]))
      }
    }

    if (func === "0xd79875eb") {
      // sell(uint256 amount, uint256 sellPrice)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      if (Number(parameters[0]) <= 5) {
        distribution[0] -= Number(web3.utils.fromWei(parameters[1]))
      }
      if (Number(parameters[0]) > 5) {
        distribution[1] -= Number(web3.utils.fromWei(parameters[1]))
      }
    }
  })

  return [
    {
      "type": "Long",
      "value": distribution[0]
    },
    {
      "type": "Short",
      "value": distribution[1]
    }
  ]
}