import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";

const newUsersListAtom = atomFamily({
  key: "users-newUsersList::value",
  default: selectorFamily({
    key: "users-newUsersList::default",
    get: () => ({get}) => {
      const optionsTxList = get(optionsTxListAtom)
      const futuresTxList = get(futuresTxListAtom)
      return updateNewUsersList(futuresTxList, optionsTxList)
    }
  })
})

const updateNewUsersList = (futuresTxList: Block[], optionsTxList: Block[]) => {

}
