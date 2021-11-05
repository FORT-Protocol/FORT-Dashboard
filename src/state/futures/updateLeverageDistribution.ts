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
  let distribution = [0, 0, 0, 0, 0]

  txList.forEach((block) => {
    const func = block.input.slice(0, 10)
    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      if (parameters[1] === "1") {
        distribution[0] += Number(web3.utils.fromWei(parameters[3]))
      }
      if (parameters[1] === "2") {
        distribution[1] += Number(web3.utils.fromWei(parameters[3]))
      }
      if (parameters[1] === "3") {
        distribution[2] += Number(web3.utils.fromWei(parameters[3]))
      }
      if (parameters[1] === "4") {
        distribution[3] += Number(web3.utils.fromWei(parameters[3]))
      }
      if (parameters[1] === "5") {
        distribution[4] += Number(web3.utils.fromWei(parameters[3]))
      }
    }
    if (func === "0x6214f36a") {
      // buyDirect(uint256 index, uint256 fortAmount)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      if (parameters[0] === "1" || parameters[0] === "6") {
        distribution[0] += Number(web3.utils.fromWei(parameters[1]))
      }
      if (parameters[0] === "2" || parameters[0] === "7") {
        distribution[1] += Number(web3.utils.fromWei(parameters[1]))
      }
      if (parameters[0] === "3" || parameters[0] === "8") {
        distribution[2] += Number(web3.utils.fromWei(parameters[1]))
      }
      if (parameters[0] === "4" || parameters[0] === "9") {
        distribution[3] += Number(web3.utils.fromWei(parameters[1]))
      }
      if (parameters[0] === "5" || parameters[0] === "10") {
        distribution[4] += Number(web3.utils.fromWei(parameters[1]))
      }
    }
    if (func === "0xd79875eb"){
      // sell(uint256 amount, uint256 sellPrice)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      if (parameters[0] === "1" || parameters[0] === "6") {
        distribution[0] -= Number(web3.utils.fromWei(parameters[1]))
      }
      if (parameters[0] === "2" || parameters[0] === "7") {
        distribution[1] -= Number(web3.utils.fromWei(parameters[1]))
      }
      if (parameters[0] === "3" || parameters[0] === "8") {
        distribution[2] -= Number(web3.utils.fromWei(parameters[1]))
      }
      if (parameters[0] === "4" || parameters[0] === "9") {
        distribution[3] -= Number(web3.utils.fromWei(parameters[1]))
      }
      if (parameters[0] === "5" || parameters[0] === "10") {
        distribution[4] -= Number(web3.utils.fromWei(parameters[1]))
      }
    }
  })

  return [
    {
      "type": "1 Times",
      "value": distribution[0]
    },
    {
      "type": "2 Times",
      "value": distribution[1]
    },
    {
      "type": "3 Times",
      "value": distribution[2]
    },
    {
      "type": "4 Times",
      "value": distribution[3]
    },
    {
      "type": "5 Times",
      "value": distribution[4]
    },
  ]
}
