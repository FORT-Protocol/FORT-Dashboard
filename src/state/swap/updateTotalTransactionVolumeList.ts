import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
import {swapTxListAtom} from "./index";
import {web3} from "../../provider";

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
  let transactionVolumeList: {day: string, value: number}[] = []

  txList.forEach((block)=>{
    if (block.tokenSymbol === "DCU"){
      const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
      if (!totalTransactionVolumeListMap[date]){
        totalTransactionVolumeListMap[date] = 0
      }
      totalTransactionVolumeListMap[date] += Number(web3.utils.fromWei(block.value))
    }
  })

  Object.keys(totalTransactionVolumeListMap).forEach((key)=>{
    transactionVolumeList.push({
      day: key,
      value: totalTransactionVolumeListMap[key],
    })
  })

  return transactionVolumeList
}

export default updateTotalTransactionVolumeList
