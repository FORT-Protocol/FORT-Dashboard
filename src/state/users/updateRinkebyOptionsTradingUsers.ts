import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {rinkebyOptionsTxListAtom} from "../../hooks/useRinkebyFetchOptionsTxList";

export const optionsRinkebyTradingUsersAtom = atomFamily({
  key: "users-rinkeby-optionsTradingUsers::value",
  default: selectorFamily({
    key: "users-rinkeby-optionsTradingUsers::default",
    get: () => ({get}) => {
      const txList = get(rinkebyOptionsTxListAtom)
      return updateRinkebyOptionsTradingUsers(txList)
    }
  })
})

const updateRinkebyOptionsTradingUsers = (txList: Block[]) => {
  let users = new Set<string>()

  txList.forEach((block)=>{
    users.add(block.from)
  })

  return users
}
