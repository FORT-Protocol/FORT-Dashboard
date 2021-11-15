import {atom, useRecoilState} from "recoil"
import {useEffect} from "react"
import fetcher from "../utils/fetcher";
import {IDLE, PROCESSING} from "../constant/status";
import {futuresContractAddress} from "../constant/contract";
import {Block} from "../state/app";
import {rinkebyApi} from "../constant/etherscan";

const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY5

export const rinkebyStatusAtom = atom({
  key: "fetch-rinkeby-futures::status",
  default: IDLE,
})

export const rinkebyFuturesTxListAtom = atom({
  key: "rinkebyFuturesTxList",
  default: [],
})

const useRinkebyFetchFuturesTxList = () => {
  const address = futuresContractAddress["rinkeby"]
  const [rinkebyFuturesTxList, setRinkebyFuturesTxList] = useRecoilState(rinkebyFuturesTxListAtom)
  const [rinkebyStatus, setRinkebyStatus] = useRecoilState(rinkebyStatusAtom)

  useEffect(() => {
    fetchAllTx()
  },[])

  async function fetchTxList(startblock = "0",
                             endblock = "latest",
                             sort = "asc") {
    const res = await fetcher(rinkebyApi + "api?module=account&action=txlist&startblock=" + startblock
      + "&endblock=" + endblock
      + "&page=1&offset=10000&sort=" + sort
      + "&address=" + address
      + "&apiKey=" + apiKey)
    return res.result
  }

  async function fetchAllTx() {
    let blockHigh = 0
    let res: never[] = []

    setRinkebyStatus(PROCESSING)
    while(res.length % 10000 === 0 ){
      let request
      request = await fetchTxList(String(blockHigh), "latest")
      blockHigh = Number(request[request.length - 1].blockNumber) + 1
      res = res.concat(request)
    }
    setRinkebyFuturesTxList(res.filter((block: Block)=>{
      return block.isError === "0"
    }))
    setRinkebyStatus(IDLE)
  }

  return { rinkebyFuturesTxList, rinkebyStatus }
}

export default useRinkebyFetchFuturesTxList
