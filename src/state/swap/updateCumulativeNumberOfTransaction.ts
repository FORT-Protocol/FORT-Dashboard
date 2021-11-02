import {atomFamily, selectorFamily} from "recoil";

export const cumulativeNumberOfTransactionAtom = atomFamily({
  key: "swap-cumulativeNumberOfTransaction::value",
  default: selectorFamily({
    key: "swap-cumulativeNumberOfTransaction::default",
    get: () => ({get}) => {
      return updateCumulativeNumberOfTransaction()
    }
  })
})

const updateCumulativeNumberOfTransaction = () => {
  return 0
}
