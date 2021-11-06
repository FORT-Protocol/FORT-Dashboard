import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block, LogBlock} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";
import {optionsOpenLogListAtom} from "../../hooks/useFetchOptionsOpenLogList";
import {optionsSellLogListAtom} from "../../hooks/useFetchOptionsSellLogList";

export const OpenInterestAtom = atomFamily({
  key: "options-OpenInterest::value",
  default: selectorFamily({
    key: "options-OpenInterest::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const openLogList = get(optionsOpenLogListAtom)
      const sellLogList = get(optionsSellLogListAtom)
      const { totalOpenInterestList } = updateOpenInterest(txList, openLogList, sellLogList)
      return totalOpenInterestList
    }
  })
})

export const currentCallOptionsDCUAtom = atomFamily({
  key: "options-currentCallOptionsDCU::value",
  default: selectorFamily({
    key: "options-currentCallOptionsDCU::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const openLogList = get(optionsOpenLogListAtom)
      const sellLogList = get(optionsSellLogListAtom)
      const { longOpenInterest } = updateOpenInterest(txList, openLogList, sellLogList)
      return longOpenInterest
    }
  })
})

export const currentShortOptionsDCUAtom = atomFamily({
  key: "options-currentShortOptionsDCU::value",
  default: selectorFamily({
    key: "options-currentShortOptionsDCU::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const openLogList = get(optionsOpenLogListAtom)
      const sellLogList = get(optionsSellLogListAtom)
      const { shortOpenInterest } = updateOpenInterest(txList, openLogList, sellLogList)
      return shortOpenInterest
    }
  })
})

const updateOpenInterest = (txList: Block[], openLogList: LogBlock[], sellLogList: LogBlock[]) => {
  let totalOpenInterestMap: {[index: string]: number} = {}
  let longOpenInterestMap: {[index: string]: number} = {}
  let shortOpenInterestMap: {[index: string]: number} = {}
  let totalOpenInterestList: {day: string, value: number, category: string}[] = []
  // Open Log 区块hash: index
  let openHashIndexMap: {[index: string]: string} = {}
  // 区块高度：[看涨行权份额,看跌行权份额]
  let exBlockNumberAmountMap: {[index: string]: number[]} = {}
  // 期权index: 份额、涨跌
  let indexInfoMap: {[index: string]: {amount: number, orientation: boolean}} = {}
  // Sell Log 区块hash: index，再通过index查询indexAmountMap，获取份额
  let sellHashIndexMap: {[index: string]: string} = {}

  let totalOpenInterest = 0, longOpenInterest = 0, shortOpenInterest = 0

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalOpenInterestMap, now, past, "number")
  fillAllDayToInitMap(longOpenInterestMap, now, past, "number")
  fillAllDayToInitMap(shortOpenInterestMap, now, past, "number")

  // 记录开仓Open hash以及对应期权的index，首次获得到index后，初始化indexInfoMap，
  // orientation置为true，初始化看涨，待遍历tx列表后更新indexInfoMap的orientation状态
  openLogList.forEach((block)=>{
    // index, dcuAmount, owner, amount
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    openHashIndexMap[block.transactionHash.toLowerCase()]= parameters[0]

    // 默认置为true，看涨，待遍历tx时，更新orientation
    indexInfoMap[parameters[0]]={
      amount: Number(web3.utils.fromWei(parameters[3])),
      orientation: true
    }
  })

  // 记录Sell hash以及对应的index
  sellLogList.forEach((block)=>{
    // Sell (uint256 index, uint256 amount, address owner, uint256 dcuAmount)
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    sellHashIndexMap[block.transactionHash.toLowerCase()] = parameters[0]
  })

  // 遍历tx列表，同时刷新时间序列，记录每天的持仓快照。
  // 额外的，需要在本次遍历中刷新
  txList.forEach((block)=>{
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)

    if (func === "0xee1ca960") {
    //  open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      // 获取 index，index在 Open Log 内，通过openHashIndexMap查找index
      const index = openHashIndexMap[block.hash.toLowerCase()]
      // 确定各区块高度下的行权数量
      if (!exBlockNumberAmountMap.hasOwnProperty(Number(parameters[3]))){
        exBlockNumberAmountMap[parameters[3]] = [0, 0]
      }
      // 份额
      let amount = 0
      if (openHashIndexMap[block.hash.toLowerCase()]){
        let index = openHashIndexMap[block.hash.toLowerCase()]
        if (index){
          amount = indexInfoMap[index].amount
        }
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
        // 更新indexInfoMap的看跌
        if (index){
          indexInfoMap[index].orientation = false
        }
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
      // const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      // 通过hash查找sellHashIndexMap，获取index
      const index = sellHashIndexMap[block.hash.toLowerCase()]
      // 通过index查找indexInfoMap获取看涨看跌和份额
      if (index){
        const amount = indexInfoMap[index]["amount"]
        const orientation = indexInfoMap[index]["orientation"]
        if (orientation){
          longOpenInterest -= amount
          longOpenInterestMap[date] = longOpenInterest
        }
        if (!orientation){
          shortOpenInterest -= amount
          shortOpenInterestMap[date] = shortOpenInterest
        }
        totalOpenInterest -= amount
        totalOpenInterestMap[date] = totalOpenInterest
      }
    }
  })

  let total = 0
  Object.keys(totalOpenInterestMap).forEach((key)=>{
    totalOpenInterestMap[key] = totalOpenInterestMap[key] === 0 ? total : totalOpenInterestMap[key]
    totalOpenInterestList.push({
      day: key,
      value: totalOpenInterestMap[key],
      category: "Total"
    })
    total = totalOpenInterestMap[key]
  })

  let long = 0
  Object.keys(longOpenInterestMap).forEach((key)=>{
    longOpenInterestMap[key] = longOpenInterestMap[key] === 0 ? long : longOpenInterestMap[key]
    totalOpenInterestList.push({
      day: key,
      value: longOpenInterestMap[key],
      category: "Long"
    })
    long = longOpenInterestMap[key]
  })

  let short = 0
  Object.keys(shortOpenInterestMap).forEach((key)=>{
    shortOpenInterestMap[key] = shortOpenInterestMap[key] === 0 ? short : shortOpenInterestMap[key]
    totalOpenInterestList.push({
      day: key,
      value: shortOpenInterestMap[key],
      category: "Short"
    })
    short = shortOpenInterestMap[key]
  })

  return {
    totalOpenInterestList,
    longOpenInterest,
    shortOpenInterest,
  }
}

export default updateOpenInterest