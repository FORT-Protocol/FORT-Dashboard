import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
import {swapTxListAtom} from "./index";

const env = process.env.REACT_APP_ENV || "mainnet"

export const cumulativeNumberOfTransactionAtom = atomFamily({
  key: "swap-cumulativeNumberOfTransaction::value",
  default: selectorFamily({
    key: "swap-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(swapTxListAtom)
      return updateCumulativeNumberOfTransaction(txList)
    }
  })
})

const updateCumulativeNumberOfTransaction = (txList: TokenTxBlock[]) => {
  const initBlock = (env === "mainnet") ? 13491361 : 9497542
  const tl = txList.filter((block)=>{ return Number(block.blockNumber) >= initBlock && block.tokenSymbol === "DCU" })
  return tl.length
}

export default updateCumulativeNumberOfTransaction