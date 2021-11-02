import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";

export const activeUsersListAtom = atomFamily({
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
  let activeUserListMap: {[index: string]: Set<string>} = {}
  let activeUserList: {day: string, value: number}[] = []

  futuresTxList.map((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!activeUserListMap[date]){
      activeUserListMap[date] = new Set<string>()
    }

    activeUserListMap[date].add(block.from)
  })

  optionsTxList.map((block)=>{
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!activeUserListMap[date]){
      activeUserListMap[date] = new Set<string>()
    }

    activeUserListMap[date].add(block.from)
  })

  Object.keys(activeUserListMap).forEach((key)=>{
    activeUserList.push({
      day: key,
      value: activeUserListMap[key].size,
    })
  })

  return activeUserList
}
