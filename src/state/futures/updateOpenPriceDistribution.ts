import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";

export const openPriceDistributionAtom = atomFamily({
  key: "futures-openPriceDistribution::value",
  default: selectorFamily({
    key: "futures-openPriceDistribution::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateOpenPriceDistribution(txList)
    }
  })
})

const updateOpenPriceDistribution = (txList: Block[]) => {
  // 0-5k, 5-10k, 10-15k, 15-20k, >20k
  let distribution = [0, 0, 0, 0, 0]

  txList.map((block) => {
    const func = block.input.slice(0,10)
    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      if (Number(web3.utils.fromWei(parameters[3])) >= 20000) {
        distribution[5] += 1
      }
      else if (Number(web3.utils.fromWei(parameters[3])) < 20000 && Number(web3.utils.fromWei(parameters[3])) >= 15000) {
        distribution[4] += 1
      }
      else if (Number(web3.utils.fromWei(parameters[3])) < 15000 && Number(web3.utils.fromWei(parameters[3])) >= 10000) {
        distribution[3] += 1
      }
      else if (Number(web3.utils.fromWei(parameters[3])) < 10000 && Number(web3.utils.fromWei(parameters[3])) >= 5000) {
        distribution[2] += 1
      }
      else if (Number(web3.utils.fromWei(parameters[3])) < 5000 && Number(web3.utils.fromWei(parameters[3])) >= 0) {
        distribution[1] += 1
      }
    }
  })

  return [
    {
      "type": "0-5k",
      "value": distribution[0]
    },
    {
      "type": "5k-10k",
      "value": distribution[1]
    },
    {
      "type": "10k-15k",
      "value": distribution[2]
    },
    {
      "type": "15k-20k",
      "value": distribution[3]
    },
    {
      "type": ">20k",
      "value": distribution[4]
    }
  ]
}

export default updateOpenPriceDistribution