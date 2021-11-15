import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";
import {rinkebyFuturesTxListAtom} from "../../hooks/useRinkebyFetchFuturesTxList";

export const newUsersListAtom = atomFamily({
  key: "users-newUsersList::value",
  default: selectorFamily({
    key: "users-newUsersList::default",
    get: () => ({get}) => {
      const optionsTxList = get(optionsTxListAtom)
      const futuresTxList = get(futuresTxListAtom)
      const rinkebyFuturesTxList = get(rinkebyFuturesTxListAtom)
      const rinkebyOptionsTxList = get(rinkebyFuturesTxListAtom)
      return updateNewUsersList(futuresTxList, optionsTxList, rinkebyFuturesTxList, rinkebyOptionsTxList)
    }
  })
})

const updateNewUsersList = (futuresTxList: Block[], optionsTxList: Block[], rinkebyFuturesTxList: Block[], rinkebyOptionsTxList: Block[]) => {
  let newUserListMap: {[index: string]: Set<string>} = {}
  let mainnetNewUserListMap: {[index: string]: Set<string>} = {}
  let rinkebyNewUserListMap: {[index: string]: Set<string>} = {}

  let users = new Set<string>()
  let rinkebyUsers = new Set<string>()
  let newUserList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(newUserListMap, now, past, "set")
  fillAllDayToInitMap(mainnetNewUserListMap, now, past, "set")
  fillAllDayToInitMap(rinkebyNewUserListMap, now, past, "set")

  futuresTxList.forEach((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!newUserListMap[date]){
      newUserListMap[date] = new Set<string>()
    }
    if (!mainnetNewUserListMap[date]){
      mainnetNewUserListMap[date] = new Set<string>()
    }
    if (!users.has(block.from)){
      users.add(block.from)
      newUserListMap[date].add(block.from)
      mainnetNewUserListMap[date].add(block.from)
    }
  })

  optionsTxList.forEach((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!newUserListMap[date]){
      newUserListMap[date] = new Set<string>()
    }
    if (!mainnetNewUserListMap[date]){
      mainnetNewUserListMap[date] = new Set<string>()
    }
    if (!users.has(block.from)){
      users.add(block.from)
      newUserListMap[date].add(block.from)
      mainnetNewUserListMap[date].add(block.from)
    }
  })

  rinkebyFuturesTxList.forEach((block)=>{
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!newUserListMap[date]){
      newUserListMap[date] = new Set<string>()
    }
    if (!rinkebyNewUserListMap[date]){
      rinkebyNewUserListMap[date] = new Set<string>()
    }
    if (!rinkebyUsers.has(block.from)){
      rinkebyUsers.add(block.from)
      newUserListMap[date].add(block.from)
      rinkebyNewUserListMap[date].add(block.from)
    }
  })

  rinkebyOptionsTxList.forEach((block)=>{
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!newUserListMap[date]){
      newUserListMap[date] = new Set<string>()
    }
    if (!rinkebyNewUserListMap[date]){
      rinkebyNewUserListMap[date] = new Set<string>()
    }
    if (!rinkebyUsers.has(block.from)){
      rinkebyUsers.add(block.from)
      newUserListMap[date].add(block.from)
      rinkebyNewUserListMap[date].add(block.from)
    }
  })

  Object.keys(newUserListMap).forEach((key)=>{
    newUserList.push({
      day: key,
      value: newUserListMap[key].size,
      category: "Total"
    })
  })

  Object.keys(mainnetNewUserListMap).forEach((key)=>{
    newUserList.push({
      day: key,
      value: mainnetNewUserListMap[key].size,
      category: "Mainnet"
    })
  })

  Object.keys(rinkebyNewUserListMap).forEach((key)=>{
    newUserList.push({
      day: key,
      value: rinkebyNewUserListMap[key].size,
      category: "Rinkeby"
    })
  })

  return newUserList
}
