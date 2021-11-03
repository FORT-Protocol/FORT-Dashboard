import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
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

const updateNumberOfNEST = (txList: TokenTxBlock[]) => {
  console.log(txList)
  return 2
}

export default updateNumberOfNEST