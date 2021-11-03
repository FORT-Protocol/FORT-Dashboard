import {atomFamily, selectorFamily} from "recoil";
import {TokenTxBlock} from "../app";
import {swapTxListAtom} from "./index";
import {web3} from "../../provider";

export const totalTransactionVolumeAtom = atomFamily({
  key: "swap-totalTransactionVolumeAtom::value",
  default: selectorFamily({
    key: "futures-curOpenLongPositions::default",
    get: () => ({get}) => {
      const txList = get(swapTxListAtom)
      return updateTotalTransactionVolume(txList)
    }
  })
})

const updateTotalTransactionVolume = (txList: TokenTxBlock[]) => {
  let sum = 0
  const tl = txList.filter((block)=>{ return block.tokenSymbol === "DCU" })
  tl.forEach((block)=>{
    sum += Number(web3.utils.fromWei(block.value))
  })
  return sum
}

export default updateTotalTransactionVolume