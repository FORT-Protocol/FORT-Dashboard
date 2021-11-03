import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
import {swapTxListAtom} from "./index";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";

export const totalTransactionVolumeListAtom = atomFamily({
  key: "swap-totalTransactionVolumeList::value",
  default: selectorFamily({
    key: "futures-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(swapTxListAtom)
      return updateTotalTransactionVolumeList(txList)
    }
  })
})

const updateTotalTransactionVolumeList = (txList: TokenTxBlock[]) => {
  let totalTransactionVolumeListMap: {[index: string]: number} = {}
  let transactionVolumeList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date("2021.10.20").getTime()
  fillAllDayToInitMap(totalTransactionVolumeListMap, now, past, "number")

  txList.forEach((block)=>{
    if (block.tokenSymbol === "DCU"){
      const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
      totalTransactionVolumeListMap[date] += Number(web3.utils.fromWei(block.value))
    }
  })

  Object.keys(totalTransactionVolumeListMap).forEach((key)=>{
    transactionVolumeList.push({
      day: key,
      value: totalTransactionVolumeListMap[key],
      category: "Total"
    })
  })

  return transactionVolumeList
}

export default updateTotalTransactionVolumeList
