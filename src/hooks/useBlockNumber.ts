import { web3 } from "../provider"
import { useRecoilState } from "recoil"
import { blockNumberAtom } from "../state/app"

const useBlockNumber = () => {
  const [blockNumber, setBlockNumber] = useRecoilState(blockNumberAtom)

  web3.eth.getBlockNumber().then((res: any) => {
    setBlockNumber(res)
  })
  return blockNumber
}

export default useBlockNumber
