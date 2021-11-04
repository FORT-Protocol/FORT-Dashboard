import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";

export const totalTradingVolumeListAtom = atomFamily({
  key: "options-totalTradingVolumeList::value",
  default: selectorFamily({
    key: "options-totalTradingVolumeList::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateTotalTradingVolumeList(txList)
    }
  })
})

const updateTotalTradingVolumeList = (txList: Block[]) => {
  let totalTradingVolumeListMap: {[index: string]: number} = {}
  let buyTxVolumeListMap: {[index: string]: number} = {}
  let sellVolumeListMap: {[index: string]: number} = {}
  let totalTradingVolumeList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date("2021.10.1").getTime()
  fillAllDayToInitMap(totalTradingVolumeListMap, now, past, "number")
  fillAllDayToInitMap(buyTxVolumeListMap, now, past, "number")
  fillAllDayToInitMap(sellVolumeListMap, now, past, "number")

  txList.forEach((block)=>{
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)

    if (func === "0xee1ca960") {
    //  open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      buyTxVolumeListMap[date] += Number(web3.utils.fromWei(parameters[4]))
      totalTradingVolumeListMap[date] += Number(web3.utils.fromWei(parameters[4]))
    }

    if (func === "0xd79875eb") {
      // sell(uint256 _price, uint256 _amountBabz)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      sellVolumeListMap[date] += Number(web3.utils.fromWei(parameters[1]))
      totalTradingVolumeListMap[date] += Number(web3.utils.fromWei(parameters[1]))
    }
  })

  Object.keys(totalTradingVolumeListMap).forEach((key)=>{
    totalTradingVolumeList.push({
      day: key,
      value: totalTradingVolumeListMap[key],
      category: "Total"
    })
  })

  Object.keys(buyTxVolumeListMap).forEach((key)=>{
    totalTradingVolumeList.push({
      day: key,
      value: buyTxVolumeListMap[key],
      category: "Buy"
    })
  })

  Object.keys(sellVolumeListMap).forEach((key)=>{
    totalTradingVolumeList.push({
      day: key,
      value: sellVolumeListMap[key],
      category: "Sell"
    })
  })

  return totalTradingVolumeList
}

export default updateTotalTradingVolumeList