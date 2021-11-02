import {atomFamily, selectorFamily} from "recoil";

export const totalTransactionVolumeAtom = atomFamily({
  key: "swap-totalTransactionVolumeAtom::value",
  default: selectorFamily({
    key: "swap-totalTransactionVolumeAtom::default",
    get: () => ({get}) => {
      return updateTotalTransactionVolume()
    }
  })
})

const updateTotalTransactionVolume = () => {
  return 0
}
