import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";

export const futuresTradingUsersAtom = atomFamily({
  key: "users-futuresTradingUsers::value",
  default: selectorFamily({
    key: "users-futuresTradingUsers::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      return updateFuturesTradingUsers(txList)
    }
  })
})

const updateFuturesTradingUsers = (txList: Block[]) => {
  let users = new Set<string>()

  txList.forEach((block)=>{
    users.add(block.from)
  })

  return users
}
