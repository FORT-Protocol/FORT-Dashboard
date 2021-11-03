import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitObjectMap from "../../utils/fillAllDayToInitObjectMap";

export const totalTradingVolumeListAtom = atomFamily({
  key: "futures-totalTradingVolumeList::value",
  default: selectorFamily({
    key: "futures-totalTradingVolumeList::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateTotalTradingVolumeList(txList)
    }
  })
})

const updateTotalTradingVolumeList = (txList: Block[]) => {
  let totalTradingVolumeListMap: {[index: string]: number} = {}
  let buyTradingVolumeListMap: {[index: string]: number} = {}
  let sellTradingVolumeListMap: {[index: string]: number} = {}

  let TotalTradingVolumeList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date("2021.10.20").getTime()
  fillAllDayToInitObjectMap(totalTradingVolumeListMap, now, past, 0)
  fillAllDayToInitObjectMap(buyTradingVolumeListMap, now, past, 0)
  fillAllDayToInitObjectMap(sellTradingVolumeListMap, now, past, 0)

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)

    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      buyTradingVolumeListMap[date] += Number(web3.utils.fromWei(parameters[3]))
      totalTradingVolumeListMap[date] += Number(web3.utils.fromWei(parameters[3]))
    }

    if (func === "0xd79875eb"){
      // sell(uint256 amount, uint256 sellPrice)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      sellTradingVolumeListMap[date] += Number(web3.utils.fromWei(parameters[1]))
      totalTradingVolumeListMap[date] += Number(web3.utils.fromWei(parameters[1]))
    }
  })

  Object.keys(totalTradingVolumeListMap).forEach((key)=>{
    TotalTradingVolumeList.push({
      day: key,
      value: totalTradingVolumeListMap[key],
      category: "Total"
    })
  })

  Object.keys(buyTradingVolumeListMap).forEach((key)=>{
    TotalTradingVolumeList.push({
      day: key,
      value: buyTradingVolumeListMap[key],
      category: "Buy"
    })
  })

  Object.keys(sellTradingVolumeListMap).forEach((key)=>{
    TotalTradingVolumeList.push({
      day: key,
      value: sellTradingVolumeListMap[key],
      category: "Sell"
    })
  })

  return TotalTradingVolumeList
}
