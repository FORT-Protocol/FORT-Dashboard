import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";

const activeUsersListAtom = atomFamily({
  key: "users-activeUsersList::value",
  default: selectorFamily({
    key: "users-activeUsersList::default",
    get: () => ({get}) => {
      const optionsTxList = get(optionsTxListAtom)
      const futuresTxList = get(futuresTxListAtom)
      return updateActiveUsersList(futuresTxList, optionsTxList)
    }
  })
})

const updateActiveUsersList = (futuresTxList: Block[], optionsTxList: Block[]) => {

}
