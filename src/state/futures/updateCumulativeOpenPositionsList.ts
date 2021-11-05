import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";

export const openingVolumeListAtom = atomFamily({
  key: "futures-openingVolumeList::value",
  default: selectorFamily({
    key: "futures-openingVolumeList::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateOpeningVolumeList(txList)
    }
  })
})

const updateOpeningVolumeList = (txList: Block[]) => {
  let totalTxVolumeListMap: {[index: string]: number} = {}
  let longTxVolumeListMap: {[index: string]: number} = {}
  let shortVolumeListMap: {[index: string]: number} = {}
  let totalTxVolumeList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalTxVolumeListMap, now, past, "number")
  fillAllDayToInitMap(longTxVolumeListMap, now, past, "number")
  fillAllDayToInitMap(shortVolumeListMap, now, past, "number")

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)

    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      if (parameters[2]) {
        longTxVolumeListMap[date] += Number(web3.utils.fromWei(parameters[3]))
      }
      if (!parameters[2]) {
        shortVolumeListMap[date] += Number(web3.utils.fromWei(parameters[3]))
      }
      totalTxVolumeListMap[date] += Number(web3.utils.fromWei(parameters[3]))

    }
    if (func === "0x6214f36a") {
      // buyDirect(uint256 index, uint256 fortAmount)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      if (Number(parameters[1]) <= 5) {
        longTxVolumeListMap[date] += Number(web3.utils.fromWei(parameters[1]))
      }
      if (Number(parameters[1]) > 5) {
        shortVolumeListMap[date] += Number(web3.utils.fromWei(parameters[1]))
      }
      totalTxVolumeListMap[date] += Number(web3.utils.fromWei(parameters[1]))
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
