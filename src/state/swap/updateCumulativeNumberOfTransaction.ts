import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
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

const updateCumulativeNumberOfTransaction = (txList: TokenTxBlock[]) => {
  const tl = txList.filter((block)=>{ return block.tokenSymbol === "DCU" })
  return tl.length
}

export default updateCumulativeNumberOfTransaction