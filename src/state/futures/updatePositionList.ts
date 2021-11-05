import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";

export const positionListAtom = atomFamily({
  key: "futures-positionList::value",
  default: selectorFamily({
    key: "futures-positionList::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updatePositionList(txList)
    }
  })
})

const updatePositionList = (txList: Block[]) => {
  let totalPositionListMap: {[index: string]: number} = {}
  let longPositionListMap: {[index: string]: number} = {}
  let shortPositionListMap: {[index: string]: number} = {}
  let longPosition = 0, shortPosition = 0, totalPosition = 0
  let positionList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalPositionListMap, now, past, "number")
  fillAllDayToInitMap(longPositionListMap, now, past, "number")
  fillAllDayToInitMap(shortPositionListMap, now, past, "number")

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)

    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      if (parameters[2]){
        longPosition += Number(web3.utils.fromWei(parameters[3]))
        longPositionListMap[date] = longPosition
      }
      if (!parameters[2]){
        shortPosition += Number(web3.utils.fromWei(parameters[3]))
        shortPositionListMap[date] = shortPosition
      }
      totalPosition += Number(web3.utils.fromWei(parameters[3]))
      totalPositionListMap[date] = totalPosition
    }
    if (func === "0x6214f36a") {
      // buyDirect(uint256 index, uint256 fortAmount)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      if (Number(parameters[0])<=5){
        longPosition += Number(web3.utils.fromWei(parameters[1]))
        longPositionListMap[date] = longPosition
      }
      if (Number(parameters[0])>5){
        shortPosition += Number(web3.utils.fromWei(parameters[1]))
        shortPositionListMap[date] = shortPosition
      }
      totalPosition += Number(web3.utils.fromWei(parameters[1]))
      totalPositionListMap[date] = totalPosition
    }
    if (func === "0xd79875eb"){
      // sell(uint256 amount, uint256 sellPrice)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      if (Number(parameters[0])<=5){
        longPosition -= Number(web3.utils.fromWei(parameters[1]))
        longPositionListMap[date] = longPosition
      }
      if (Number(parameters[0])>5){
        shortPosition -= Number(web3.utils.fromWei(parameters[1]))
        shortPositionListMap[date] = shortPosition
      }
      totalPosition -= Number(web3.utils.fromWei(parameters[1]))
      totalPositionListMap[date] = totalPosition
    }
  })

  let value = 0
  Object.keys(totalPositionListMap).forEach((key)=>{
    totalPositionListMap[key] = totalPositionListMap[key] === 0 ? value : totalPositionListMap[key]
    positionList.push({
      day: key,
      value: totalPositionListMap[key],
      category: "Total"
    })
    value = totalPositionListMap[key]
  })

  Object.keys(longPositionListMap).forEach((key)=>{
    positionList.push({
      day: key,
      value: longPositionListMap[key],
      category: "Long"
    })
  })

  Object.keys(shortPositionListMap).forEach((key)=>{
    positionList.push({
      day: key,
      value: shortPositionListMap[key],
      category: "Short"
    })
  })

  return positionList
}
