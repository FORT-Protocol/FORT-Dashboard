import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";

export const leverageDistributionAtom = atomFamily({
  key: "futures-leverageDistribution::value",
  default: selectorFamily({
    key: "futures-leverageDistribution::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateLeverageDistribution(txList)
    }
  })
})

const updateLeverageDistribution = (txList: Block[]) => {
  let times1 = 0, times2 = 0, times3 = 0, times4 = 0, times5 = 0

  txList.map((block) => {
    const func = block.input.slice(0, 10)
    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      if (parameters[1] === "1") {
        times1 += Number(web3.utils.fromWei(parameters[3]))
      }
      if (parameters[1] === "2") {
        times2 += Number(web3.utils.fromWei(parameters[3]))
      }
      if (parameters[1] === "3") {
        times3 += Number(web3.utils.fromWei(parameters[3]))
      }
      if (parameters[1] === "4") {
        times4 += Number(web3.utils.fromWei(parameters[3]))
      }
      if (parameters[1] === "5") {
        times5 += Number(web3.utils.fromWei(parameters[3]))
      }
    }
  })

  return [
    {
      "type": "1 Times",
      "value": times1
    },
    {
      "type": "2 Times",
      "value": times2
    },
    {
      "type": "3 Times",
      "value": times3
    },
    {
      "type": "4 Times",
      "value": times4
    },
    {
      "type": "5 Times",
      "value": times5
    },
  ]
}
