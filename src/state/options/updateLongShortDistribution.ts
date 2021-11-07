import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block, blockNumberAtom, LogBlock} from "../app";
import {optionsOpenLogListAtom} from "../../hooks/useFetchOptionsOpenLogList";
import {optionsSellLogListAtom} from "../../hooks/useFetchOptionsSellLogList";
import {web3} from "../../provider";

export const longShortDistributionAtom = atomFamily({
  key: "options-longShortDistribution::value",
  default: selectorFamily({
    key: "options-longShortDistribution::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const blockNumber = get(blockNumberAtom)
      const openLogList = get(optionsOpenLogListAtom)
      const sellLogList = get(optionsSellLogListAtom)
      return updatelongShortDistribution(txList, blockNumber, openLogList, sellLogList)
    }
  })
})

const updatelongShortDistribution = (txList: Block[], blockNumber: number, openLogList: LogBlock[], sellLogList: LogBlock[]) => {
  // long, short
  let distribution = [0, 0]
  // Open Log 区块hash：index
  let openHashIndexMap: {[index: string]: string} = {}
  // 期权表
  let indexInfoMap: {[index: string]: {amount: number, exerciseBlock: number, orientation: boolean}} = {}

  // 遍历开仓Log，并初始化indexInfoMap，其中exerciseBlock初始化为0，sale初始化为false
  openLogList.forEach((block)=>{
    // index, dcuAmount, owner, amount
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    openHashIndexMap[block.transactionHash.toLowerCase()]= parameters[0]
    // 初始化indexInfoMap
    indexInfoMap[parameters[0]] = {
      amount: Number(web3.utils.fromWei(parameters[3])),
      exerciseBlock: 0,
      orientation: true
    }
  })

  // 遍历Sell Log，更新indexInfoMap中的sale字段
  sellLogList.forEach((block)=>{
    // Sell (uint256 index, uint256 amount, address owner, uint256 dcuAmount)
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    if (indexInfoMap[parameters[0]]){
      indexInfoMap[parameters[0]].amount = 0
    }
  })

  // 遍历txList，更新indexInfoMap重的exerciseBlock字段
  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      const index = openHashIndexMap[block.hash]
      if (index && indexInfoMap[index]){
        indexInfoMap[index].exerciseBlock = Number(parameters[3])
        indexInfoMap[index].orientation = parameters[2]
      }
    }
  })

  // 遍历indexInfoMap，筛选当前的持仓
  Object.keys(indexInfoMap).forEach((key)=>{
    const exerciseBlock = indexInfoMap[key].exerciseBlock
    const amount = indexInfoMap[key].amount

    const time = exerciseBlock - blockNumber
    if (time > 0) {
      if (indexInfoMap[key].orientation){
        distribution[0] += amount
      } else if (!indexInfoMap[key].orientation) {
        distribution[1] += amount
      }
    }
  })

  console.log(distribution[0]+ distribution[1])

  return [
    {
      "type": "Long",
      "value": distribution[0]
    },
    {
      "type": "Short",
      "value": distribution[1]
    },
  ]

}