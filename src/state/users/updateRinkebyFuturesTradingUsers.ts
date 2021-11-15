import {atomFamily, selectorFamily} from "recoil";
import {Block} from "../app";
import {rinkebyFuturesTxListAtom} from "../../hooks/useRinkebyFetchFuturesTxList";

export const futuresRinkebyTradingUsersAtom = atomFamily({
  key: "users-rinkeby-futuresTradingUsers::value",
  default: selectorFamily({
    key: "users-rinkeby-futuresTradingUsers::default",
    get: () => ({get}) => {
      const txList = get(rinkebyFuturesTxListAtom)
      return updateRinkebyFuturesTradingUsers(txList)
    }
  })
})

const updateRinkebyFuturesTradingUsers = (txList: Block[]) => {
  let users = new Set<string>()

  txList.forEach((block)=>{
    users.add(block.from)
  })

  return users
}
