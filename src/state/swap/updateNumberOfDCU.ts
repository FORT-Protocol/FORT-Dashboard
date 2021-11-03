import { atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
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

const updateNumberOfDCU = (txList: TokenTxBlock[]) => {
  console.log(txList)
  return 2
}

export default updateNumberOfDCU