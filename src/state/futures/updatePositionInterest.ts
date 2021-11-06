import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block, LogBlock} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";
import {futuresLogListAtom} from "../../hooks/useFetchFuturesLogList";

export const positionInterestAtom = atomFamily({
  key: "futures-positionInterest::value",
  default: selectorFamily({
    key: "futures-positionInterest::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      const logList = get(futuresLogListAtom)
      const {positionList} = updatePositionInterest(txList, logList)
      return positionList
    }
  })
})

export const currentOpenLongPositionsAtom = atomFamily({
  key: "futures-curOpenLongPositions::value",
  default: selectorFamily({
    key: "futures-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      const logList = get(futuresLogListAtom)
      const {long} = updatePositionInterest(txList, logList)
      return long
    }
  })
})

export const currentOpenShortPositionsAtom = atomFamily({
  key: "futures-curOpenShortPositions::value",
  default: selectorFamily({
    key: "futures-curOpenShortPositions::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      const logList = get(futuresLogListAtom)
      const {short} = updatePositionInterest(txList, logList)
      return short
    }
  })
})

const updatePositionInterest = (txList: Block[], logList: LogBlock[]) => {
  let totalPositionInterestMap: { [index: string]: number } = {},
    longPositionInterestMap: { [index: string]: number } = {},
    shortPositionInterestMap: { [index: string]: number } = {},
    // 地址Map，存储当时时刻下，每个用户的持仓分布
    addressMap: { [index: string]: number[] } = {},
    logMap: { [index: string]: {index: number, address: string}[]} = {}

  let longPosition = 0, shortPosition = 0, totalPosition = 0
  let positionList: { day: string, value: number, category: string }[] = []

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalPositionInterestMap, now, past, "number")
  fillAllDayToInitMap(longPositionInterestMap, now, past, "number")
  fillAllDayToInitMap(shortPositionInterestMap, now, past, "number")

  logList.forEach((block)=>{
    if (!logMap.hasOwnProperty(block.transactionHash)){
      logMap[block.transactionHash] = []
    }
    const parameters = web3.eth.abi.decodeParameters(["uint256", "address", "address"], block.data)
    const item = {
      index: Number(parameters[0]),
      address: parameters[1]
    }
    logMap[block.transactionHash.toLowerCase()].push(item)
  })

  txList.forEach((block) => {
    const func = block.input.slice(0, 10)
    const date = new Date(Number(block.timeStamp) * 1000).toJSON().substr(0, 10)
    if (!addressMap.hasOwnProperty(block.from)) {
      addressMap[block.from] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      if (parameters[2]) {
        longPosition += Number(web3.utils.fromWei(parameters[3]))
        longPositionInterestMap[date] = longPosition
        const index = Number(parameters[1] - 1)
        addressMap[block.from][index] += Number(web3.utils.fromWei(parameters[3]))
      }
      if (!parameters[2]) {
        shortPosition += Number(web3.utils.fromWei(parameters[3]))
        shortPositionInterestMap[date] = shortPosition
        const index = Number(parameters[1]) + 4
        addressMap[block.from][index] += Number(web3.utils.fromWei(parameters[3]))
      }
      totalPosition += Number(web3.utils.fromWei(parameters[3]))
      totalPositionInterestMap[date] = totalPosition
    }

    if (func === "0x6214f36a") {
      // buyDirect(uint256 index, uint256 fortAmount)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      const index = Number(parameters[0] - 1)
      addressMap[block.from][index] += Number(web3.utils.fromWei(parameters[1]))
      if (Number(parameters[0]) <= 5) {
        longPosition += Number(web3.utils.fromWei(parameters[1]))
        longPositionInterestMap[date] = longPosition
      }
      if (Number(parameters[0]) > 5) {
        shortPosition += Number(web3.utils.fromWei(parameters[1]))
        shortPositionInterestMap[date] = shortPosition
      }
      totalPosition += Number(web3.utils.fromWei(parameters[1]))
      totalPositionInterestMap[date] = totalPosition
    }

    if (func === "0xd79875eb") {
      // sell(uint256 amount, uint256 sellPrice)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      const index = Number(parameters[0] - 1)
      addressMap[block.from][index] -= Number(web3.utils.fromWei(parameters[1]))
      if (Number(parameters[0]) <= 5) {
        longPosition -= Number(web3.utils.fromWei(parameters[1]))
        longPositionInterestMap[date] = longPosition
      }
      if (Number(parameters[0]) > 5) {
        shortPosition -= Number(web3.utils.fromWei(parameters[1]))
        shortPositionInterestMap[date] = shortPosition
      }
      totalPosition -= Number(web3.utils.fromWei(parameters[1]))
      totalPositionInterestMap[date] = totalPosition
    }

    if (func === "0xc09835f2") {
    // settle(uint256 index, address[] addresses)
      if (logMap[block.hash]) {
        logMap[block.hash].forEach((item)=> {
          const pool = addressMap[item.address.toLowerCase()]
          if (item.index <= 5){
            longPosition -= Number(pool[item.index - 1])
            longPositionInterestMap[date] = longPosition
          }
          if (item.index > 5){
            shortPosition -= Number(pool[item.index - 1])
            shortPositionInterestMap[date] = shortPosition
          }
          totalPosition -= Number(pool[item.index - 1])
          totalPositionInterestMap[date] = totalPosition
          addressMap[item.address.toLowerCase()][item.index - 1] = 0
        })
      }
    }
  })
  // 用于解决Map初始化为0的问题
  let total = 0
  Object.keys(totalPositionInterestMap).forEach((key) => {
    totalPositionInterestMap[key] = totalPositionInterestMap[key] === 0 ? total : totalPositionInterestMap[key]
    positionList.push({
      day: key,
      value: totalPositionInterestMap[key],
      category: "Total"
    })
    total = totalPositionInterestMap[key]
  })

  // 用于解决Map初始化为0的问题
  let long = 0
  Object.keys(longPositionInterestMap).forEach((key) => {
    longPositionInterestMap[key] = longPositionInterestMap[key] === 0 ? long : longPositionInterestMap[key]
    positionList.push({
      day: key,
      value: longPositionInterestMap[key],
      category: "Long"
    })
    long = longPositionInterestMap[key]
  })

  // 用于解决Map初始化为0的问题
  let short = 0
  Object.keys(shortPositionInterestMap).forEach((key) => {
    shortPositionInterestMap[key] = shortPositionInterestMap[key] === 0 ? short : shortPositionInterestMap[key]
    positionList.push({
      day: key,
      value: shortPositionInterestMap[key],
      category: "Short"
    })
    short = shortPositionInterestMap[key]
  })
  return {
    positionList,
    long,
    short
  }
}