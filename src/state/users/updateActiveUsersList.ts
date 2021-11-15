import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";
import {rinkebyFuturesTxListAtom} from "../../hooks/useRinkebyFetchFuturesTxList";

export const activeUsersListAtom = atomFamily({
  key: "users-activeUsersList::value",
  default: selectorFamily({
    key: "users-activeUsersList::default",
    get: () => ({get}) => {
      const optionsTxList = get(optionsTxListAtom)
      const futuresTxList = get(futuresTxListAtom)
      const rinkebyFuturesTxList = get(rinkebyFuturesTxListAtom)
      const rinkebyOptionsTxList = get(rinkebyFuturesTxListAtom)
      return updateActiveUsersList(futuresTxList, optionsTxList, rinkebyFuturesTxList, rinkebyOptionsTxList)
    }
  })
})

const updateActiveUsersList = (futuresTxList: Block[], optionsTxList: Block[], rinkebyFuturesTxList: Block[], rinkebyOptionsTxList: Block[]) => {
  let activeUserListMap: {[index: string]: Set<string>} = {}
  let mainnetActiveUserListMap: {[index: string]: Set<string>} = {}
  let rinkebyActiveUserListMap: {[index: string]: Set<string>} = {}
  let activeUserList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(activeUserListMap, now, past, "set")
  fillAllDayToInitMap(mainnetActiveUserListMap, now, past, "set")
  fillAllDayToInitMap(rinkebyActiveUserListMap, now, past, "set")

  futuresTxList.forEach((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!activeUserListMap[date]){
      activeUserListMap[date] = new Set<string>()
    }
    if (!mainnetActiveUserListMap[date]){
      mainnetActiveUserListMap[date] = new Set<string>()
    }
    activeUserListMap[date].add(block.from)
    mainnetActiveUserListMap[date].add(block.from)
  })

  optionsTxList.forEach((block)=>{
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!activeUserListMap[date]){
      activeUserListMap[date] = new Set<string>()
    }
    if (!mainnetActiveUserListMap[date]){
      mainnetActiveUserListMap[date] = new Set<string>()
    }
    activeUserListMap[date].add(block.from)
    mainnetActiveUserListMap[date].add(block.from)
  })

  rinkebyFuturesTxList.forEach((block)=>{
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!activeUserListMap[date]){
      activeUserListMap[date] = new Set<string>()
    }
    if (!rinkebyActiveUserListMap[date]){
      rinkebyActiveUserListMap[date] = new Set<string>()
    }
    activeUserListMap[date].add(block.from)
    rinkebyActiveUserListMap[date].add(block.from)
  })

  rinkebyOptionsTxList.forEach((block)=>{
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
    if (!activeUserListMap[date]){
      activeUserListMap[date] = new Set<string>()
    }
    if (!rinkebyActiveUserListMap[date]){
      rinkebyActiveUserListMap[date] = new Set<string>()
    }
    activeUserListMap[date].add(block.from)
    rinkebyActiveUserListMap[date].add(block.from)
  })

  Object.keys(activeUserListMap).forEach((key)=>{
    activeUserList.push({
      day: key,
      value: activeUserListMap[key].size,
      category: "Total"
    })
  })

  Object.keys(mainnetActiveUserListMap).forEach((key)=>{
    activeUserList.push({
      day: key,
      value: mainnetActiveUserListMap[key].size,
      category: "Mainnet"
    })
  })

  Object.keys(rinkebyActiveUserListMap).forEach((key)=>{
    activeUserList.push({
      day: key,
      value: rinkebyActiveUserListMap[key].size,
      category: "Rinkeby"
    })
  })

  return activeUserList
}
