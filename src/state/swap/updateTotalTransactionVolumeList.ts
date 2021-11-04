import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
import {swapTxListAtom} from "./index";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";

const env = process.env.REACT_APP_ENV || "mainnet"

export const totalTransactionVolumeListAtom = atomFamily({
  key: "swap-totalTransactionVolumeList::value",
  default: selectorFamily({
    key: "swap-curOpenLongPositions::default",
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
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalTransactionVolumeListMap, now, past, "number")

  txList.forEach((block)=>{
    const initBlock = (env === "mainnet") ? 13491361 : 9497542
    if (block.tokenSymbol === "DCU" && Number(block.blockNumber) >= initBlock) {
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
