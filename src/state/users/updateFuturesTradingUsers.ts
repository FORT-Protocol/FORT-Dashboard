import {atomFamily, selectorFamily} from "recoil";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";

const futuresTradingUsersAtom = atomFamily({
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

}
