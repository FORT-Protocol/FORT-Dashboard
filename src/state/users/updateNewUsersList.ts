import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";

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
  let newUserListMap: {[index: string]: number} = {}
  let users = new Set<string>()
  let newUserList: {day: string, value: number}[] = []

  futuresTxList.map((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!newUserListMap[date]){
      newUserListMap[date] = 0
    }
    if (!users.has(block.from)){
      users.add(block.from)
      newUserListMap[date] += 1
    }
  })

  optionsTxList.map((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!newUserListMap[date]){
      newUserListMap[date] = 0
    }
    if (!users.has(block.from)){
      users.add(block.from)
      newUserListMap[date] += 1
    }
  })

  Object.keys(newUserListMap).forEach((key)=>{
    newUserList.push({
      day: key,
      value: newUserListMap[key],
    })
  })

  return newUserList
}
