import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block, LogBlock} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";
import {optionsOpenLogListAtom} from "../../hooks/useFetchOptionsOpenLogList";

export const OpenInterestAtom = atomFamily({
  key: "options-OpenInterest::value",
  default: selectorFamily({
    key: "options-OpenInterest::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const openLogList = get(optionsOpenLogListAtom)
      return updateOpenInterest(txList, openLogList)
    }
  })
})

// export const currentCallOptionsDCUAtom = atomFamily({
//   key: "options-currentCallOptionsDCU::value",
//   default: selectorFamily({
//     key: "options-currentCallOptionsDCU::default",
//     get: () => ({get}) => {
//       const txList = get(optionsTxListAtom)
//       return updateCurrentCallOptionsDCU(txList)
//     }
//   })
// })

// export const currentShortOptionsDCUAtom = atomFamily({
//   key: "options-currentShortOptionsDCU::value",
//   default: selectorFamily({
//     key: "options-currentShortOptionsDCU::default",
//     get: () => ({get}) => {
//       const txList = get(optionsTxListAtom)
//       return updateCurrentShortOptionsETH(txList)
//     }
//   })
// })

const updateOpenInterest = (txList: Block[], openLogList: LogBlock[]) => {
  let totalOpenInterestMap: {[index: string]: number} = {}
  let longOpenInterestMap: {[index: string]: number} = {}
  let shortOpenInterestMap: {[index: string]: number} = {}
  let totalOpenInterestList: {day: string, value: number, category: string}[] = []
  // Open Log 区块hash：份额 + index
  let hashAmountMap: {[index: string]: {amount: number, index: string}} = {}
  // 区块高度：[看涨行权份额,看跌行权份额]
  let exBlockNumberAmountMap: {[index: string]: number[]} = {}
  // 期权index: 份额、涨跌
  let indexAmountMap: {[index: string]: {amount: number, orientation: boolean}} = {}

  let totalOpenInterest = 0, longOpenInterest = 0, shortOpenInterest = 0

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalOpenInterestMap, now, past, "number")
  fillAllDayToInitMap(longOpenInterestMap, now, past, "number")
  fillAllDayToInitMap(shortOpenInterestMap, now, past, "number")

  // 记录开仓hash以及份额
  openLogList.forEach((block)=>{
    // index, dcuAmount, owner, amount
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    hashAmountMap[block.transactionHash.toLowerCase()]= {
      amount: Number(web3.utils.fromWei(parameters[3])),
      index: parameters[0]
    }

    // 默认置为true，看涨，待遍历tx时，更新orientation
    indexAmountMap[parameters[0]]={
      amount: Number(web3.utils.fromWei(parameters[3])),
      orientation: true
    }
  })

  txList.forEach((block)=>{
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)

    if (func === "0xee1ca960") {
    //  open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      // 获取 index，index在 log 内，通过hash查找log信息

      // 确定各区块高度下的行权数量
      if (!exBlockNumberAmountMap.hasOwnProperty(Number(parameters[3]))){
        exBlockNumberAmountMap[parameters[3]] = [0, 0]
      }
      // 份额
      let amount = 0
      if (hashAmountMap[block.hash.toLowerCase()]){
        amount = hashAmountMap[block.hash.toLowerCase()]["amount"]
      }
      if (parameters[2]){
        longOpenInterest += amount
        exBlockNumberAmountMap[parameters[3]][0] += amount
        longOpenInterestMap[date] = longOpenInterest
      }
      if (!parameters[2]){
        shortOpenInterest += amount
        exBlockNumberAmountMap[parameters[3]][1] += amount
        shortOpenInterestMap[date] = shortOpenInterest
      }
      totalOpenInterest += amount
      totalOpenInterestMap[date] = totalOpenInterest

      if (exBlockNumberAmountMap[block.blockNumber]){
        longOpenInterest -= exBlockNumberAmountMap[block.blockNumber][0]
        shortOpenInterest -= exBlockNumberAmountMap[block.blockNumber][1]
        totalOpenInterest -= (exBlockNumberAmountMap[block.blockNumber][0] + exBlockNumberAmountMap[block.blockNumber][1])
        longOpenInterestMap[date] = longOpenInterest
        shortOpenInterestMap[date] = shortOpenInterest
        totalOpenInterestMap[date] = totalOpenInterest
      }
    }

    if (func === "0xd79875eb") {
      // sell(uint256 _price, uint256 _amountBabz)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      // 通过log查找index和份额
      // 通过index查找看涨看跌
      shortOpenInterestMap[date] += Number(web3.utils.fromWei(parameters[1]))
      totalOpenInterest -= Number(web3.utils.fromWei(parameters[1]))
      totalOpenInterestMap[date] = totalOpenInterest
    }
  })

  Object.keys(totalOpenInterestMap).forEach((key)=>{
    totalOpenInterestList.push({
      day: key,
      value: totalOpenInterestMap[key],
      category: "Total"
    })
  })

  Object.keys(longOpenInterestMap).forEach((key)=>{
    totalOpenInterestList.push({
      day: key,
      value: longOpenInterestMap[key],
      category: "Buy"
    })
  })

  Object.keys(shortOpenInterestMap).forEach((key)=>{
    totalOpenInterestList.push({
      day: key,
      value: shortOpenInterestMap[key],
      category: "Sell"
    })
  })

  return totalOpenInterestList
}

export default updateOpenInterest