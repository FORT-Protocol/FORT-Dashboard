import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";

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

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!totalTradingVolumeListMap[date]){
      totalTradingVolumeListMap[date] = 0
    }
    if (!buyTradingVolumeListMap[date]){
      buyTradingVolumeListMap[date] = 0
    }
    if (!sellTradingVolumeListMap[date]){
      sellTradingVolumeListMap[date] = 0
    }

    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      buyTradingVolumeListMap[date] += Number(web3.utils.fromWei(parameters[3]))
      totalTradingVolumeListMap[date] += Number(web3.utils.fromWei(parameters[3]))
    }

    if (func === "0xd79875eb"){
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
