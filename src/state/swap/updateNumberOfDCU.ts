import { atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {swapTxListAtom} from "./index";

export const numberOfDCUAtom = atomFamily({
  key: "swap-numberOfDCU::value",
  default: selectorFamily({
    key: "futures-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(swapTxListAtom)
      return updateNumberOfDCU(txList)
    }
  })
})

const updateNumberOfDCU = (txList: Block[]) => {
  console.log(txList)
  return 0
}

export default updateNumberOfDCU