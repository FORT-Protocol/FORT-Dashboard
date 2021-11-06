import {atomFamily, selectorFamily} from "recoil";
import {optionsTxListAtom} from "./index";
import {Block, blockNumberAtom, LogBlock} from "../app";
import {web3} from "../../provider";
import {optionsOpenLogListAtom} from "../../hooks/useFetchOptionsOpenLogList";

export const distributionOfExerciseTimespanAtom = atomFamily({
  key: "options-distributionOfExerciseTimespan::value",
  default: selectorFamily({
    key: "options-distributionOfExerciseTimespan::default",
    get: () => ({get}) => {
      const txList = get(optionsTxListAtom)
      const blockNumber = get(blockNumberAtom)
      const openLogList = get(optionsOpenLogListAtom)
      return updateDistributionOfExerciseTimespan(txList, blockNumber, openLogList)
    }
  })
})

const updateDistributionOfExerciseTimespan = (txList: Block[], blockNumber: number, openLogList: LogBlock[]) => {
  // 1 Month, 1-3 Month, 3-6 Month, 6-12 Month, 1 year
  let distribution = [0, 0, 0, 0, 0]

  // Open Log 区块hash：份额
  let openHashAmountMap: {[index: string]: number} = {}

  // 记录开仓Open hash以及对应期权的index，首次获得到index后，初始化indexInfoMap，
  // orientation置为true，初始化看涨，待遍历tx列表后更新indexInfoMap的orientation状态
  openLogList.forEach((block)=>{
    // index, dcuAmount, owner, amount
    const parameters = web3.eth.abi.decodeParameters(["uint256", "uint256", "address", "uint256"], block.data)
    openHashAmountMap[block.transactionHash.toLowerCase()]= Number(web3.utils.fromWei(parameters[3]))
    console.log(Number(web3.utils.fromWei(parameters[3])))
  })

  txList.forEach((block) => {
    const func = block.input.slice(0,10)
    if (func === "0xee1ca960") {
      // open(address tokenAddress, uint256 strikePrice, bool orientation, uint256 exerciseBlock, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256", "uint256"], block.input.slice(10))
      const time = (Number(parameters[3]) - blockNumber) * 14
      if (!openHashAmountMap[block.hash.toLowerCase()]){
        openHashAmountMap[block.hash.toLowerCase()] = 0
      }
      if (time > 0 && time <= 30*24*60*60 ){
        distribution[0] += openHashAmountMap[block.hash.toLowerCase()]
      }else if (time > 30*24*60*60 && time <= 30*24*60*60*3 ){
        distribution[1] += openHashAmountMap[block.hash.toLowerCase()]
      }else if (time > 30*24*60*60*3 && time <= 30*24*60*60*6){
        distribution[2] += openHashAmountMap[block.hash.toLowerCase()]
      }else if (time > 30*24*60*60*6 && time <= 30*24*60*60*12){
        distribution[3] += openHashAmountMap[block.hash.toLowerCase()]
      }else if (time > 30*24*60*60*12){
        distribution[4] += openHashAmountMap[block.hash.toLowerCase()]
      }
    }
  })

  return [
    {
      "type": "1 M",
      "value": distribution[0]
    },
    {
      "type": "1-3 M",
      "value": distribution[1]
    },
    {
      "type": "3-6 M",
      "value": distribution[2]
    },
    {
      "type": "6-12 M",
      "value": distribution[3]
    },
    {
      "type": "> 1 Y",
      "value": distribution[4]
    }
  ]
}