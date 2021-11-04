import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";

export const newUsersListAtom = atomFamily({
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
  let newUserListMap: {[index: string]: Set<string>} = {}
  let users = new Set<string>()
  let newUserList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(newUserListMap, now, past, "set")

  futuresTxList.forEach((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!users.has(block.from)){
      users.add(block.from)
      newUserListMap[date].add(block.from)
    }
  })

  optionsTxList.forEach((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!newUserListMap[date]){
      newUserListMap[date] = new Set<string>()
    }
    if (!users.has(block.from)){
      users.add(block.from)
      newUserListMap[date].add(block.from)
    }
  })

  Object.keys(newUserListMap).forEach((key)=>{
    newUserList.push({
      day: key,
      value: newUserListMap[key].size,
      category: "Total"
    })
  })
  return newUserList
}
