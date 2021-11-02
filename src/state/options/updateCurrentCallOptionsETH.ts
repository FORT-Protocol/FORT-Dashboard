import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {optionsTxListAtom} from "./index";

export const curCurrentCallOptionsDCUAtom = atomFamily({
  key: "futures-curCurrentCallOptionsDCU::value",
  default: selectorFamily({
    key: "futures-curCurrentCallOptionsDCU::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateCurrentCallOptionsDCU(txList)
    }
  })
})

const updateCurrentCallOptionsDCU = (txList: Block[]) => {

}

export default updateCurrentCallOptionsDCU