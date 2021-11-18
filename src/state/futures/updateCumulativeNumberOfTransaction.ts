import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
import {futuresTxListAtom} from "./index";

export const futuresCumulativeNumberOfTransactionAtom = atomFamily({
  key: "futures-cumulativeNumberOfTransaction::value",
  default: selectorFamily({
    key: "futures-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateCumulativeNumberOfTransaction(txList)
    }
  })
})

const updateCumulativeNumberOfTransaction = (txList: TokenTxBlock[]) => {
  return txList.length
}

export default updateCumulativeNumberOfTransaction