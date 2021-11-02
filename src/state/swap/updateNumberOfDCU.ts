import {atomFamily, selectorFamily} from "recoil";

export const numberOfDCUAtom = atomFamily({
  key: "swap-numberOfDCU::value",
  default: selectorFamily({
    key: "swap-numberOfDCU::default",
    get: () => ({get}) => {
      return updateNumberOfDCU()
    }
  })
})

const updateNumberOfDCU = () => {
  return 0
}