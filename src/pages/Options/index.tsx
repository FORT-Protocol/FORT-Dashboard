import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import {useEffect, useState} from "react";

const Options = () => {
  const [totalTxVolume, setTotalTxVolume] = useState("-")
  const [currentBullishQty, setCurrentBullishQty] = useState("-")
  const [currentBearishQty, setCurrentBearishQty] = useState("-")
  const [distributionOfLongShort, setDistributionOfLongShort] = useState<{value: number, type: string}[]>([])
  const [totalTxVolumeList, setTotalTxVolumeList] = useState<{ day: string, value: number, category: string }[]>([])
  const [distributionOfExerciseTimespan, setDistributionOfExerciseTimespan] = useState<{value: number, type: string}[]>([])
  const [cumluativeNumberOfTransaction, setCumluativeNumberOfTransaction] = useState("-")

  useEffect(()=>{
    asyncFetch()
  }, [])

  const  asyncFetch = () => {
    fetch("https://api.hedge.red/api/options/openedOfTotal")
      .then((res) => res.json())
      .then((json) => setTotalTxVolume(json["value"])
      )
    fetch("https://api.hedge.red/api/options/currentBullishQty")
      .then((res) => res.json())
      .then((json) => setCurrentBullishQty(json["value"])
      )
    fetch("https://api.hedge.red/api/options/currentBearishQty")
      .then((res) => res.json())
      .then((json) => setCurrentBearishQty(json["value"])
      )
    fetch("https://api.hedge.red/api/options/transactionCounts")
      .then((res) => res.json())
      .then((json) => setCumluativeNumberOfTransaction(json["value"])
      )
    fetch("http://192.168.2.52:8080/api/options/dirDist/total")
      .then((res) => res.json())
      .then((json) => setDistributionOfLongShort(json["value"])
      )
    fetch("http://192.168.2.52:8080/api/options/openedQtyOfDaily/total")
      .then((res) => res.json())
      .then((json) => setTotalTxVolumeList(json["value"])
      )
    fetch("http://192.168.2.52:8080/api/options/strikePriceDist")
      .then((res) => res.json())
      .then((json) => setDistributionOfExerciseTimespan(json["value"])
      )
  }


  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 2, 2, 4]} spacing={["22px", "22px", "44px"]}>
        <Norm value={totalTxVolume} desc={"Total Open Position(DCU)"} color={"#C7A072"}/>
        <Norm value={currentBullishQty} desc={"Current Call Option Positions"} color={"#00B388"}/>
        <Norm value={currentBearishQty} desc={"Current Short Option Positions"} color={"#F23A12"}/>
        <Norm value={cumluativeNumberOfTransaction} desc={"Cumulative Number of Transaction"} color={"#E57200"} />
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        <LineChart title={"Open Position"} data={totalTxVolumeList} suffix={"DCU"}/>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={["22px", "22px", "44px"]}>
        <PieChart title={"Long-Short Distribution"} data={distributionOfLongShort}/>
        <PieChart title={"Distribution of Exercise Timespan"} data={distributionOfExerciseTimespan}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Options
