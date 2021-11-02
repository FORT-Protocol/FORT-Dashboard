import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {web3} from "../../provider";
import {optionsTxListAtom} from "./index";

export const totalTxVolumeListAtom = atomFamily({
  key: "options-totalTxVolumeList::value",
  default: selectorFamily({
    key: "options-totalTxVolumeList::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateTotalTxVolumeList(txList)
    }
  })
})

const updateTotalTxVolumeList = (txList: Block[]) => {
  let totalTxVolumeListMap: {[index: string]: number} = {}
  let longTxVolumeListMap: {[index: string]: number} = {}
  let shortVolumeListMap: {[index: string]: number} = {}
  let totalTxVolumeList: {day: string, value: number, category: string}[] = []

  txList.map((block) => {
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    totalTxVolumeListMap[date] = 0
    longTxVolumeListMap[date] = 0
    shortVolumeListMap[date] = 0

    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      if (parameters[2]) {
        longTxVolumeListMap[date] += Number(web3.utils.fromWei(parameters[4]))
      }
      if (!parameters[2]) {
        shortVolumeListMap[date] += Number(web3.utils.fromWei(parameters[4]))
      }
      totalTxVolumeListMap[date] += Number(web3.utils.fromWei(parameters[4]))
    }
  })

  Object.keys(totalTxVolumeListMap).forEach((key)=>{
    totalTxVolumeList.push({
      day: key,
      value: totalTxVolumeListMap[key],
      category: "Total"
    })
  })

  Object.keys(longTxVolumeListMap).forEach((key)=>{
    totalTxVolumeList.push({
      day: key,
      value: longTxVolumeListMap[key],
      category: "Long"
    })
  })

  Object.keys(shortVolumeListMap).forEach((key)=>{
    totalTxVolumeList.push({
      day: key,
      value: shortVolumeListMap[key],
      category: "Short"
    })
  })

  return totalTxVolumeList
}

export default updateTotalTxVolumeList