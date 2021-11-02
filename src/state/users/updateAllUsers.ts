import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";

export const allUserAtom = atomFamily({
  key: "users-totalTxVolume::value",
  default: selectorFamily({
    key: "users-totalTxVolume::default",
    get: () => ({get}) => {
      const optionsTxList = get(optionsTxListAtom)
      const futuresTxList = get(futuresTxListAtom)
      return updateAllUsers(futuresTxList, optionsTxList)
    }
  })
})

const updateAllUsers = (futuresTxList: Block[], optionsTxList: Block[]) => {
  let users = new Set()

  futuresTxList.map((block)=>{
    users.add(block.from)
  })

  optionsTxList.map((block)=>{
    users.add(block.from)
  })

  return users.size
}
