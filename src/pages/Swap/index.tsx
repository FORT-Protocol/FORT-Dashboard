import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useEffect, useState} from "react";
import {APIHOSTNAME} from "../../constant";
import {formatNumber} from "../../utils/util";

const Swap = () => {
  const [cumulativeNumberOfTransaction, setCumulativeNumberOfTransaction] = useState("-")
  const [numberOfNEST, setNumberOfNEST] = useState("-")
  const [numberOfDCU, setNumberOfDCU] = useState("-")
  const [totalTransactionVolume, setTotalTransactionVolume] = useState("-")
  const [totalTransactionVolumeList, setTotalTransactionVolumeList] = useState<{ day: string, value: number, category: string }[]>([])
  const [totalSupply, setTotalSupply] = useState<{day: string, value: number, category: string}[]>([])

  useEffect(()=>{
    asyncFetch()
  }, [])

  const asyncFetch = () => {
    fetch(APIHOSTNAME + "/api/swap/nestBalances")
      .then((res) => res.json())
      .then((json) => setNumberOfNEST(formatNumber(json["value"]))
      )
    fetch(APIHOSTNAME + "/api/swap/dcuBalances")
      .then((res) => res.json())
      .then((json) => setNumberOfDCU(formatNumber(json["value"]))
      )
    fetch(APIHOSTNAME + "/api/swap/dcuTransactionCounts")
      .then((res) => res.json())
      .then((json) => setCumulativeNumberOfTransaction(formatNumber(json["value"]))
      )
    fetch(APIHOSTNAME + "/api/swap/ducTransactionVolume")
      .then((res) => res.json())
      .then((json) => setTotalTransactionVolume(formatNumber(json["value"]))
      )
    fetch(APIHOSTNAME + "/api/swap/ducTransactionVolumeOfDaily/ethereum")
      .then((res) => res.json())
      .then((json) => setTotalTransactionVolumeList(json["value"])
      )
    fetch(APIHOSTNAME + "/api/swap/ducTotalsupplyOfDaily")
      .then((res) => res.json())
      .then((json) => json["value"])
      .then((data) => {
        const newData = data.filter((data: { day: string, value: number, category: string }) => {
          const day = new Date(data.day.replace(/\./g, "/")).getTime()
          return day > new Date("2021/10/26").getTime()
        })
        setTotalSupply(newData)
      })
  }

  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 2, 2, 4]} spacing={["22px", "22px", "44px"]}>
        <Norm value={numberOfNEST} desc={"Number of USDT"} color={"#C7A072"}/>
        <Norm value={numberOfDCU} desc={"Number of NEST"} color={"#E57200"}/>
        <Norm value={totalTransactionVolume} desc={"Total Transaction Volume (NEST)"} color={"#F23A12"}/>
        <Norm value={cumulativeNumberOfTransaction} desc={"Cumulative Number of Transaction"} color={"#00B388"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        <LineChart title={"Total Transaction Volume"} suffix={"NEST"} data={totalTransactionVolumeList}/>
        <LineChart title={"Total Supply"} suffix={"NEST"} data={totalSupply} useLast useLimit/>
      </SimpleGrid>
    </Stack>
  )
}

export default Swap