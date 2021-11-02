import {atomFamily, selectorFamily} from "recoil";

export const totalTransactionVolumeListAtom = atomFamily({
  key: "swap-totalTransactionVolumeList::value",
  default: selectorFamily({
    key: "swap-totalTransactionVolumeList::default",
    get: () => ({get}) => {
      return updateTotalTransactionVolumeList()
    }
  })
})

const updateTotalTransactionVolumeList = () => {
  return 0
}
