import {optionsContractAddress} from "../constant/contract";
import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import fetcher from "../utils/fetcher";
import {rinkebyApi} from "../constant/etherscan";
import {IDLE, PROCESSING} from "../constant/status";
import {Block} from "../state/app";

const apiKey = process.env.REACT_APP_ETHERSCAN_APIKEY4

export const rinkebyStatusAtom = atom({
  key: "fetch-options::status",
  default: IDLE,
})

export const rinkebyOptionsTxListAtom = atom({
  key: "rinkebyOptionsTxList",
  default: [],
})

const useFetchRinkebyOptionsTxList = () => {
  const [rinkebyOptionsTxList, setRinkebyOptionsTxList] = useRecoilState(rinkebyOptionsTxListAtom)
  const address = optionsContractAddress["rinkeby"]
  const [rinkebyStatus, setRinkebyStatus] = useRecoilState(rinkebyStatusAtom)

  useEffect(() => {
    fetchAllTx()
  }, [])

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
    setRinkebyOptionsTxList(res.filter((block: Block)=>{
      return block.isError === "0"
    }))
    setRinkebyStatus(IDLE)
  }

  return { rinkebyOptionsTxList, rinkebyStatus }
}

export default useFetchRinkebyOptionsTxList
