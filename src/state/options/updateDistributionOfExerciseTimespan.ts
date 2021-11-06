import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block, blockNumberAtom, LogBlock} from "../app";
import {web3} from "../../provider";
import {optionsOpenLogListAtom} from "../../hooks/useFetchOptionsOpenLogList";
import {optionsSellLogListAtom} from "../../hooks/useFetchOptionsSellLogList";

export const distributionOfExerciseTimespanAtom = atomFamily({
  key: "options-distributionOfExerciseTimespan::value",
  default: selectorFamily({
    key: "options-distributionOfExerciseTimespan::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const blockNumber = get(blockNumberAtom)
      const openLogList = get(optionsOpenLogListAtom)
      const sellLogList = get(optionsSellLogListAtom)
      return updateDistributionOfExerciseTimespan(txList, blockNumber, openLogList, sellLogList)
    }
  })
})

const updateDistributionOfExerciseTimespan = (txList: Block[], blockNumber: number, openLogList: LogBlock[], sellLogList: LogBlock[]) => {
  // 1 Month, 1-3 Month, 3-6 Month, 6-12 Month, 1 year
  let distribution = [0, 0, 0, 0, 0]

  // Open Log 区块hash：index
  let openHashIndexMap: {[index: string]: string} = {}
  // 期权表
  let indexInfoMap: {[index: string]: {amount: number, exerciseBlock: number, sale: boolean}} = {}

  // 遍历开仓Log，并初始化indexInfoMap，其中exerciseBlock初始化为0，sale初始化为false
  openLogList.forEach((block)=>{
    // index, dcuAmount, owner, amount
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    openHashIndexMap[block.transactionHash.toLowerCase()]= parameters[0]
    // 初始化indexInfoMap
    indexInfoMap[parameters[0]] = {
      amount: Number(web3.utils.fromWei(parameters[3])),
      exerciseBlock: 0,
      sale: false,
    }
  })

  // 遍历Sell Log，更新indexInfoMap中的sale字段
  sellLogList.forEach((block)=>{
    // Sell (uint256 index, uint256 amount, address owner, uint256 dcuAmount)
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    indexInfoMap[parameters[0]].sale = true
  })

  // 遍历txList，更新indexInfoMap重的exerciseBlock字段
  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      const index = openHashIndexMap[block.hash]
      if (index){
        indexInfoMap[index].exerciseBlock = Number(parameters[3])
      }
    }
  })

  // 遍历indexInfoMap，筛选当前的持仓，并计算时间
  Object.keys(indexInfoMap).forEach((key)=>{
    const exerciseBlock = indexInfoMap[key].exerciseBlock
    const amount = indexInfoMap[key].amount

    const time =(exerciseBlock - blockNumber) * 14
    if (time > 0 && time <= 30*24*60*60 ){
      distribution[0] += amount
    }else if (time > 30*24*60*60 && time <= 30*24*60*60*3 ){
      distribution[1] += amount
    }else if (time > 30*24*60*60*3 && time <= 30*24*60*60*6){
      distribution[2] += amount
    }else if (time > 30*24*60*60*6 && time <= 30*24*60*60*12){
      distribution[3] += amount
    }else if (time > 30*24*60*60*12){
      distribution[4] += amount
    }
  })

  return [
    {
      "type": "1 M",
      "value": distribution[0]
    },
    {
      "type": "1-3 M",
      "value": distribution[1]
    },
    {
      "type": "3-6 M",
      "value": distribution[2]
    },
    {
      "type": "6-12 M",
      "value": distribution[3]
    },
    {
      "type": "> 1 Y",
      "value": distribution[4]
    }
  ]
}