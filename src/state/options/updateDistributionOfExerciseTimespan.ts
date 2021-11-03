import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block, blockNumberAtom} from "../app";
import {web3} from "../../provider";

export const distributionOfExerciseTimespanAtom = atomFamily({
  key: "options-distributionOfExerciseTimespan::value",
  default: selectorFamily({
    key: "options-distributionOfExerciseTimespan::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const blockNumber = get(blockNumberAtom)
      return updateDistributionOfExerciseTimespan(txList, blockNumber)
    }
  })
})

const updateDistributionOfExerciseTimespan = (txList: Block[], blockNumber: number) => {
  // 1 Month, 1-3 Month, 3-6 Month, 6-12 Month, 1 year
  let distribution = [0, 0, 0, 0, 0]

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      const time = (Number(parameters[3]) - blockNumber) * 14
      if (time > 0 && time <= 30*24*60*60 ){
        distribution[0] += 1
      }else if (time > 30*24*60*60 && time <= 30*24*60*60*3 ){
        distribution[1] += 1
      }else if (time > 30*24*60*60*3 && time <= 30*24*60*60*6){
        distribution[2] += 1
      }else if (time > 30*24*60*60*6 && time <= 30*24*60*60*12){
        distribution[3] += 1
      }else if (time > 30*24*60*60*12){
        distribution[4] += 1
      }
    }
  })

  return [
    {
      "type": "1 Month",
      "value": distribution[0]
    },
    {
      "type": "1-3 Month",
      "value": distribution[1]
    },
    {
      "type": "3-6 Month",
      "value": distribution[2]
    },
    {
      "type": "6-12 Month",
      "value": distribution[3]
    },
    {
      "type": "> 1 Year",
      "value": distribution[4]
    }
  ]
}