import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block, LogBlock} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";
import {logsListAtom} from "../../hooks/useFetchLogsList";

export const positionListAtom = atomFamily({
  key: "futures-positionList::value",
  default: selectorFamily({
    key: "futures-positionList::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      const logList = get(logsListAtom)
      const {positionList} = updatePositionList(txList, logList)
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
      const logList = get(logsListAtom)
      const {long} = updatePositionList(txList, logList)
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
      const logList = get(logsListAtom)
      const {short} = updatePositionList(txList, logList)
      return short
    }
  })
})

const updatePositionList = (txList: Block[], logList: LogBlock[]) => {
  let totalPositionListMap: { [index: string]: number } = {},
    longPositionListMap: { [index: string]: number } = {},
    shortPositionListMap: { [index: string]: number } = {},
    // 地址Map，存储当时时刻下，每个用户的持仓分布
    addressMap: { [index: string]: number[] } = {},
    logMap: { [index: string]: {index: number, address: string}[]} = {}

  let longPosition = 0, shortPosition = 0, totalPosition = 0
  let positionList: { day: string, value: number, category: string }[] = []

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalPositionListMap, now, past, "number")
  fillAllDayToInitMap(longPositionListMap, now, past, "number")
  fillAllDayToInitMap(shortPositionListMap, now, past, "number")

  logList.forEach((block)=>{
    if (!logMap.hasOwnProperty(block.transactionHash)){
      logMap[block.transactionHash] = []
    }
    const parameters = web3.eth.abi.decodeParameters(["uint256", "address", "address"], block.data)
    const item = {
      index: Number(parameters[0]),
      address: parameters[1].toLowerCase()
    }
    logMap[block.transactionHash].push(item)
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
        longPositionListMap[date] = longPosition
        const index = Number(parameters[1] - 1)
        addressMap[block.from][index] += Number(web3.utils.fromWei(parameters[3]))
      }
      if (!parameters[2]) {
        shortPosition += Number(web3.utils.fromWei(parameters[3]))
        shortPositionListMap[date] = shortPosition
        const index = Number(parameters[1]) + 4
        addressMap[block.from][index] += Number(web3.utils.fromWei(parameters[3]))
      }
      totalPosition += Number(web3.utils.fromWei(parameters[3]))
      totalPositionListMap[date] = totalPosition
    }

    if (func === "0x6214f36a") {
      // buyDirect(uint256 index, uint256 fortAmount)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      const index = Number(parameters[0] - 1)
      addressMap[block.from][index] += Number(web3.utils.fromWei(parameters[1]))
      if (Number(parameters[0]) <= 5) {
        longPosition += Number(web3.utils.fromWei(parameters[1]))
        longPositionListMap[date] = longPosition
      }
      if (Number(parameters[0]) > 5) {
        shortPosition += Number(web3.utils.fromWei(parameters[1]))
        shortPositionListMap[date] = shortPosition
      }
      totalPosition += Number(web3.utils.fromWei(parameters[1]))
      totalPositionListMap[date] = totalPosition
    }

    if (func === "0xd79875eb") {
      // sell(uint256 amount, uint256 sellPrice)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      const index = Number(parameters[0] - 1)
      addressMap[block.from][index] -= Number(web3.utils.fromWei(parameters[1]))
      if (Number(parameters[0]) <= 5) {
        longPosition -= Number(web3.utils.fromWei(parameters[1]))
        longPositionListMap[date] = longPosition
      }
      if (Number(parameters[0]) > 5) {
        shortPosition -= Number(web3.utils.fromWei(parameters[1]))
        shortPositionListMap[date] = shortPosition
      }
      totalPosition -= Number(web3.utils.fromWei(parameters[1]))
      totalPositionListMap[date] = totalPosition
    }

    if (func === "0xc09835f2") {
    // settle(uint256 index, address[] addresses)
      if (logMap[block.hash]) {
        logMap[block.hash].forEach((item)=> {
          const pool = addressMap[item.address.toLowerCase()]
          if (item.index <= 5){
            longPosition -= Number(pool[item.index - 1])
            longPositionListMap[date] = longPosition
          }
          if (item.index > 5){
            shortPosition -= Number(pool[item.index - 1])
            shortPositionListMap[date] = shortPosition
          }
          totalPosition -= Number(pool[item.index - 1])
          totalPositionListMap[date] = totalPosition
          addressMap[item.address.toLowerCase()][item.index - 1] = 0
        })
      }
    }
  })
  // 用于解决Map初始化为0的问题
  let total = 0
  Object.keys(totalPositionListMap).forEach((key) => {
    totalPositionListMap[key] = totalPositionListMap[key] === 0 ? total : totalPositionListMap[key]
    positionList.push({
      day: key,
      value: totalPositionListMap[key],
      category: "Total"
    })
    total = totalPositionListMap[key]
  })

  // 用于解决Map初始化为0的问题
  let long = 0
  Object.keys(longPositionListMap).forEach((key) => {
    longPositionListMap[key] = longPositionListMap[key] === 0 ? long : longPositionListMap[key]
    positionList.push({
      day: key,
      value: longPositionListMap[key],
      category: "Long"
    })
    long = longPositionListMap[key]
  })

  // 用于解决Map初始化为0的问题
  let short = 0
  Object.keys(shortPositionListMap).forEach((key) => {
    shortPositionListMap[key] = shortPositionListMap[key] === 0 ? short : shortPositionListMap[key]
    positionList.push({
      day: key,
      value: shortPositionListMap[key],
      category: "Short"
    })
    short = shortPositionListMap[key]
  })
  return {
    positionList,
    long,
    short
  }
}
