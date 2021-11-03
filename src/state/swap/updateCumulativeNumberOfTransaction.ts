import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {swapTxListAtom} from "./index";

export const cumulativeNumberOfTransactionAtom = atomFamily({
  key: "swap-cumulativeNumberOfTransaction::value",
  default: selectorFamily({
    key: "futures-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(swapTxListAtom)
      return updateCumulativeNumberOfTransaction(txList)
    }
  })
})

const updateCumulativeNumberOfTransaction = (txList: Block[]) => {
  console.log(txList)
  return 0
}

export default updateCumulativeNumberOfTransaction