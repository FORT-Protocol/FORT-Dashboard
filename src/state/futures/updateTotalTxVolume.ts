// 更新 Total Transaction Volume
import {web3} from "../../provider";
import {atomFamily, selectorFamily} from "recoil";
import {futuresTxlistAtom} from "./index";

interface block {
  blockNumber: string,
  "timeStamp": string,
  "hash": string,
  "nonce": string,
  "blockHash": string,
  "transactionIndex": string,
  "from": string,
  "to": string,
  "value": string,
  "gas": string,
  "gasPrice": string,
  "isError": string,
  "txreceipt_status": string,
  "input": string,
  "contractAddress": string,
  "cumulativeGasUsed": string,
  "gasUsed": string,
  "confirmations": string
}

export const totalTxVolumeAtom = atomFamily({
  key: "futures-totalTxVolume::value",
  default: selectorFamily({
    key: "futures-totalTxVolume::default",
    get: param => ({get}) => {
      const txList = get(futuresTxlistAtom)
      return updateTotalTxVolume(txList)
    }
  })
})

const updateTotalTxVolume = (txList: block[]) => {
  let totalTxVolume = 0

  txList.map((block) => {
    const func = block.input.slice(0,10)
    if (func === "0x15ee0aad") {
      // buy(address tokenAddress, uint256 lever, bool orientation, uint256 dcuAmount)
      const parameters = web3.eth.abi.decodeParameters(["address", "uint256", "bool", "uint256"], block.input.slice(10))
      totalTxVolume += Number(web3.utils.fromWei(parameters[3]))
    }
  })
  return totalTxVolume
}

export default updateTotalTxVolume