import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useEffect, useState} from "react";
import {APIHOSTNAME} from "../../constant";

const Swap = () => {
  const [cumulativeNumberOfTransaction, setCumulativeNumberOfTransaction] = useState("-")
  const [numberOfNEST, setNumberOfNEST] = useState("-")
  const [numberOfDCU, setNumberOfDCU] = useState("-")
  const [totalTransactionVolume, setTotalTransactionVolume] = useState("-")
  const [totalTransactionVolumeList, setTotalTransactionVolumeList] = useState<{ day: string, value: number, category: string }[]>([])

  useEffect(()=>{
    asyncFetch()
  }, [])

  const asyncFetch = () => {
    fetch(APIHOSTNAME + "/api/swap/nestBalances")
      .then((res) => res.json())
      .then((json) => setNumberOfNEST(Number(json["value"]).toFixed(2))
      )
    fetch(APIHOSTNAME + "/api/swap/dcuBalances")
      .then((res) => res.json())
      .then((json) => setNumberOfDCU(Number(json["value"]).toFixed(2))
      )
    fetch(APIHOSTNAME + "/api/swap/dcuTransactionCounts")
      .then((res) => res.json())
      .then((json) => setCumulativeNumberOfTransaction(Number(json["value"]).toFixed(0))
      )
    fetch(APIHOSTNAME + "/api/swap/ducTransactionVolume")
      .then((res) => res.json())
      .then((json) => setTotalTransactionVolume(Number(json["value"]).toFixed(2))
      )
    fetch(APIHOSTNAME + "/api/swap/ducTransactionVolumeOfDaily/total")
      .then((res) => res.json())
      .then((json) => setTotalTransactionVolumeList(json["value"])
      )
  }

  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 2, 2, 4]} spacing={["22px", "22px", "44px"]}>
        <Norm value={numberOfNEST} desc={"Number of NEST"} color={"#C7A072"}/>
        <Norm value={numberOfDCU} desc={"Number of DCU"} color={"#E57200"}/>
        <Norm value={totalTransactionVolume} desc={"Total Transaction Volume (DCU)"} color={"#F23A12"}/>
        <Norm value={cumulativeNumberOfTransaction} desc={"Cumulative Number of Transaction"} color={"#00B388"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        <LineChart title={"Total Transaction Volume"} suffix={"DCU"} data={totalTransactionVolumeList}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Swap