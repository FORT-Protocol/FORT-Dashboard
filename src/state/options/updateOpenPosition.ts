import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {web3} from "../../provider";
import {optionsTxListAtom} from "./index";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";

export const totalTxVolumeListAtom = atomFamily({
  key: "options-totalTxVolumeList::value",
  default: selectorFamily({
    key: "options-totalTxVolumeList::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateOpenPosition(txList)
    }
  })
})

const updateOpenPosition = (txList: Block[]) => {
  let totalOpenPositionMap: {[index: string]: number} = {}
  let longOpenPositionMap: {[index: string]: number} = {}
  let shortOpenPositionMap: {[index: string]: number} = {}
  let totalOpenPositionList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalOpenPositionMap, now, past, "number")
  fillAllDayToInitMap(longOpenPositionMap, now, past, "number")
  fillAllDayToInitMap(shortOpenPositionMap, now, past, "number")

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)

    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      if (parameters[2]) {
        longOpenPositionMap[date] += Number(web3.utils.fromWei(parameters[4]))
      }
      if (!parameters[2]) {
        shortOpenPositionMap[date] += Number(web3.utils.fromWei(parameters[4]))
      }
      totalOpenPositionMap[date] += Number(web3.utils.fromWei(parameters[4]))
    }
  })

  Object.keys(totalOpenPositionMap).forEach((key)=>{
    totalOpenPositionList.push({
      day: key,
      value: totalOpenPositionMap[key],
      category: "Total"
    })
  })

  Object.keys(longOpenPositionMap).forEach((key)=>{
    totalOpenPositionList.push({
      day: key,
      value: longOpenPositionMap[key],
      category: "Long"
    })
  })

  Object.keys(shortOpenPositionMap).forEach((key)=>{
    totalOpenPositionList.push({
      day: key,
      value: shortOpenPositionMap[key],
      category: "Short"
    })
  })

  return totalOpenPositionList
}

export default updateOpenPosition