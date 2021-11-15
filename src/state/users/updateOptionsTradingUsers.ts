import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {Block} from "../app";
import {rinkebyOptionsTxListAtom} from "../../hooks/useRinkebyFetchOptionsTxList";

export const optionsTradingUsersAtom = atomFamily({
  key: "users-optionsTradingUsers::value",
  default: selectorFamily({
    key: "users-optionsTradingUsers::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const rinkebyTxList = get(rinkebyOptionsTxListAtom)
      return updateOptionsTradingUsers(txList, rinkebyTxList)
    }
  })
})


const updateOptionsTradingUsers = (txList: Block[], rinkebyTxList: Block[]) => {
  let users = new Set<string>()

  txList.forEach((block)=>{
    users.add(block.from)
  })

  rinkebyTxList.forEach((block)=> {
    users.add(block.from)
  })

  return users
}
