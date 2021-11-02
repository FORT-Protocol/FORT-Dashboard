import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "./index";
import {Block} from "../app";
import {web3} from "../../provider";

export const totalTxVolumeListAtom = atomFamily({
  key: "futures-totalTxVolumeList::value",
  default: selectorFamily({
    key: "futures-totalTxVolumeList::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
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