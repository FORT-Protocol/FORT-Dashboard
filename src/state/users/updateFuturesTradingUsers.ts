import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";
import {rinkebyFuturesTxListAtom} from "../../hooks/useRinkebyFetchFuturesTxList";

export const futuresTradingUsersAtom = atomFamily({
  key: "users-futuresTradingUsers::value",
  default: selectorFamily({
    key: "users-futuresTradingUsers::default",
    get: () => ({get}) => {
      const txList = get(futuresTxListAtom)
      const rinkebyTxList = get(rinkebyFuturesTxListAtom)
      return updateFuturesTradingUsers(txList, rinkebyTxList)
    }
  })
})

const updateFuturesTradingUsers = (txList: Block[], rinkebyTxList: Block[]) => {
  let users = new Set<string>()

  txList.forEach((block)=>{
    users.add(block.from)
  })

  rinkebyTxList.forEach((block)=>{
    users.add(block.from)
  })

  return users
}
