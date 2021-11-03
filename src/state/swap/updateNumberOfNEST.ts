import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {swapTxListAtom} from "./index";

export const numberOfNESTAtom = atomFamily({
  key: "swap-numberOfNESTAtom::value",
  default: selectorFamily({
    key: "futures-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(swapTxListAtom)
      return updateNumberOfNEST(txList)
    }
  })
})

const updateNumberOfNEST = (txList: Block[]) => {
  console.log(txList)
  return 2
}

export default updateNumberOfNEST