import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {Block} from "../app";

const optionsTradingUsersAtom = atomFamily({
  key: "users-futuresTradingUsers::value",
  default: selectorFamily({
    key: "users-futuresTradingUsers::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      return updateOptionsTradingUsers(txList)
    }
  })
})


const updateOptionsTradingUsers = (txList: Block[]) => {

}
