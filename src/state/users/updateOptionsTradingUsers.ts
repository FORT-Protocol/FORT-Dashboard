import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {Block} from "../app";

export const optionsTradingUsersAtom = atomFamily({
  key: "users-optionsTradingUsers::value",
  default: selectorFamily({
    key: "users-optionsTradingUsers::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateOptionsTradingUsers(txList)
    }
  })
})


const updateOptionsTradingUsers = (txList: Block[]) => {
  let users = new Set<string>()

  txList.map((block)=>{
    users.add(block.from)
  })

  return users
}
