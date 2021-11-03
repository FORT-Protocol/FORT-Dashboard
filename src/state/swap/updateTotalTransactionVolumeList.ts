import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {swapTxListAtom} from "./index";

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

const updateTotalTransactionVolumeList = (txList: Block[]) => {
  console.log(txList)
  return []
}

export default updateTotalTransactionVolumeList
