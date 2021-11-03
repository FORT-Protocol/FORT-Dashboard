import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {swapTxListAtom} from "./index";

export const totalTransactionVolumeAtom = atomFamily({
  key: "swap-totalTransactionVolumeAtom::value",
  default: selectorFamily({
    key: "futures-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(swapTxListAtom)
      return updateTotalTransactionVolume(txList)
    }
  })
})

const updateTotalTransactionVolume = (txList: Block[]) => {
  console.log(txList)
  return 2
}

export default updateTotalTransactionVolume