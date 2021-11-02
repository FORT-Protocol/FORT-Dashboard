import {atomFamily, selectorFamily} from "recoil";

export const numberOfNESTAtom = atomFamily({
  key: "swap-numberOfNESTAtom::value",
  default: selectorFamily({
    key: "swap-numberOfNESTAtom::default",
    get: () => ({get}) => {
      return updateNumberOfNEST()
    }
  })
})

const updateNumberOfNEST = () => {
  return 0
}
