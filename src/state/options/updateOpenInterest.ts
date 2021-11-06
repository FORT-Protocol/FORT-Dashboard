import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block, LogBlock} from "../app";
import {web3} from "../../provider";
import fillAllDayToInitMap from "../../utils/fillAllDayToInitMap";
import {optionsLogListAtom} from "../../hooks/useFetchOptionsLogList";

export const OpenInterestAtom = atomFamily({
  key: "options-OpenInterest::value",
  default: selectorFamily({
    key: "options-OpenInterest::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const logList = get(optionsLogListAtom)
      return updateOpenInterest(txList, logList)
    }
  })
})

// export const currentCallOptionsDCUAtom = atomFamily({
//   key: "options-currentCallOptionsDCU::value",
//   default: selectorFamily({
//     key: "options-currentCallOptionsDCU::default",
//     get: () => ({get}) => {
//       const txList = get(optionsTxListAtom)
//       return updateCurrentCallOptionsDCU(txList)
//     }
//   })
// })

// export const currentShortOptionsDCUAtom = atomFamily({
//   key: "options-currentShortOptionsDCU::value",
//   default: selectorFamily({
//     key: "options-currentShortOptionsDCU::default",
//     get: () => ({get}) => {
//       const txList = get(optionsTxListAtom)
//       return updateCurrentShortOptionsETH(txList)
//     }
//   })
// })

const updateOpenInterest = (txList: Block[], logList: LogBlock[]) => {
  let totalOpenInterestMap: {[index: string]: number} = {}
  let longOpenInterestMap: {[index: string]: number} = {}
  let shortOpenInterestMap: {[index: string]: number} = {}
  let totalOpenInterestList: {day: string, value: number, category: string}[] = []
  let amountMap: {[index: string]: number} = {}
  let exerciseMap: {[index: string]: number} = {}

  let totalOpenInterest = 0, longOpenInterest = 0, shortOpenInterest = 0

  const now = new Date().getTime()
  const past = new Date(1633046400000).getTime()
  fillAllDayToInitMap(totalOpenInterestMap, now, past, "number")
  fillAllDayToInitMap(longOpenInterestMap, now, past, "number")
  fillAllDayToInitMap(shortOpenInterestMap, now, past, "number")

  logList.forEach((block)=>{
    // index, dcuAmount, owner, amount
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    amountMap[block.transactionHash.toLowerCase()]=Number(web3.utils.fromWei(parameters[3]))
  })

  txList.forEach((block)=>{
    const func = block.input.slice(0,10)
    const date = new Date(Number(block.timeStamp)*1000).toJSON().substr(0, 10)

    if (func === "0xee1ca960") {
    //  open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      if (!exerciseMap.hasOwnProperty(Number(parameters[3]))){
        exerciseMap[parameters[3]] = 0
      }

      exerciseMap[parameters[3]] += amountMap[block.hash.toLowerCase()]

      let amount = 0

      if (amountMap[block.hash.toLowerCase()]){
        amount = amountMap[block.hash.toLowerCase()]
      }

      if (parameters[2]){
        longOpenInterest += amount
        longOpenInterestMap[date] = longOpenInterest
      }
      if (!parameters[2]){
        shortOpenInterest += amount
        shortOpenInterestMap[date] = shortOpenInterest
      }
      totalOpenInterest += amount
      totalOpenInterestMap[date] = totalOpenInterest

    }

    if (func === "0xd79875eb") {
      // sell(uint256 _price, uint256 _amountBabz)
      const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256"], block.input.slice(10))
      if (parameters)
      shortOpenInterestMap[date] += Number(web3.utils.fromWei(parameters[1]))
      totalOpenInterestMap[date] += Number(web3.utils.fromWei(parameters[1]))
    }
  })

  Object.keys(totalOpenInterestMap).forEach((key)=>{
    totalOpenInterestList.push({
      day: key,
      value: totalOpenInterestMap[key],
      category: "Total"
    })
  })

  Object.keys(longOpenInterestMap).forEach((key)=>{
    totalOpenInterestList.push({
      day: key,
      value: longOpenInterestMap[key],
      category: "Buy"
    })
  })

  Object.keys(shortOpenInterestMap).forEach((key)=>{
    totalOpenInterestList.push({
      day: key,
      value: shortOpenInterestMap[key],
      category: "Sell"
    })
  })

  return totalOpenInterestList
}

export default updateOpenInterest