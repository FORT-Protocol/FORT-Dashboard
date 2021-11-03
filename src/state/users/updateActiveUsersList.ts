import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "../options";
import {futuresTxListAtom} from "../futures";
import {Block} from "../app";
import fillAllDayToInitObjectMap from "../../utils/fillAllDayToInitObjectMap";

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
  let activeUserList: {day: string, value: number, category: string}[] = []

  const now = new Date().getTime()
  const past = new Date("2021.10.20").getTime()
  fillAllDayToInitObjectMap(activeUserListMap, now, past, "set")

  futuresTxList.map((block) => {
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)
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
      category: "Total"
    })
  })

  return activeUserList
}
