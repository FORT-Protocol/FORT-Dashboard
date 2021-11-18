import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
import {optionsTxListAtom} from "./index";

export const optionsCumulativeNumberOfTransactionAtom = atomFamily({
  key: "options-cumulativeNumberOfTransaction::value",
  default: selectorFamily({
    key: "options-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateCumulativeNumberOfTransaction(txList)
    }
  })
})

const updateCumulativeNumberOfTransaction = (txList: TokenTxBlock[]) => {
  return txList.length
}

export default updateCumulativeNumberOfTransaction