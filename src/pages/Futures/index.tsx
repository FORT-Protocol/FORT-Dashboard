import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import {useEffect, useState} from "react";
import {APIHOSTNAME} from "../../constant";

const Futures = () => {
  const [totalOpenPositions, setTotalOpenPositions] = useState("-")
  const [curOpenLongPositions, setCurOpenLongPositions] = useState("-")
  const [curOpenShortPositions, setCurOpenShortPositions] = useState("-")
  const [openingVolumeList, setOpeningVolumeList] = useState<{ day: string, value: number, category: string }[]>([])
  const [longShortDistribution, setLongShortDistribution] = useState<{value: number, type: string}[]>([])
  const [leverageDistribution, setLeverageDistribution] = useState<{value: number, type: string}[]>([])
  const [openPriceDistribution, setOpenPriceDistribution] = useState<{value: number, type: string}[]>([])
  const [positionInterest, setPositionInterest] = useState<{ day: string, value: number, category: string }[]>([])
  const [cumluativeNumberOfTransaction, setCumluativeNumberOfTransaction] = useState("-")

  useEffect(() => {
    asyncFetch()
  }, [])

  const asyncFetch = () => {
    fetch( APIHOSTNAME + "/api/futures/openedOfTotal")
      .then((res) => res.json())
      .then((json) => setTotalOpenPositions(json["value"]))
    fetch(APIHOSTNAME +"/api/futures/currentBullishQty")
      .then((res) => res.json())
      .then((json) => setCurOpenLongPositions(json["value"]))
    fetch(APIHOSTNAME + "/api/futures/currentBearishQty")
      .then((res) => res.json())
      .then((json) => setCurOpenShortPositions(json["value"]))
    fetch(APIHOSTNAME + "/api/futures/transactionCounts")
      .then((res) => res.json())
      .then((json) => setCumluativeNumberOfTransaction(json["value"]))
    fetch(APIHOSTNAME + "/api/futures/openedQtyOfDaily/ethereum")
      .then((res) => res.json())
      .then((json) => setOpeningVolumeList(json["value"]))
    fetch(APIHOSTNAME + "/api/futures/dirDist")
      .then((res) => res.json())
      .then((json) => setLongShortDistribution(json["value"]))
    fetch(APIHOSTNAME + "/api/futures/leverDist")
      .then((res) => res.json())
      .then((json) => setLeverageDistribution(json["value"]))
    fetch(APIHOSTNAME + "/api/futures/openPriceDist")
      .then((res) => res.json())
      .then((json) => setOpenPriceDistribution(json["value"]))
    fetch(APIHOSTNAME + "/api/futures/holdQtyOfDaily/ethereum")
      .then((res) => res.json())
      .then((json) => setPositionInterest(json["value"]))
  }

  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 2, 2, 4]} spacing={["22px", "22px", "44px"]}>
        <Norm value={totalOpenPositions} desc={"Total Open Position"} color={"#C7A072"}/>
        <Norm value={curOpenLongPositions} desc={"Current Open Long Positions (DCU)"} color={"#00B388"}/>
        <Norm value={curOpenShortPositions} desc={"Current Open Short Positions (DCU)"} color={"#F23A12"}/>
        <Norm value={cumluativeNumberOfTransaction} desc={"Cumulative Number of Transaction"} color={"#E57200"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        <LineChart title={"Open Position"} suffix={"DCU"} data={openingVolumeList}/>
        <LineChart title={"Open Interest"} suffix={"DCU"} data={positionInterest} noTotal/>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={["22px", "22px", "44px"]}>
        <PieChart title={"Long-Short Distribution"} data={longShortDistribution}/>
        <PieChart title={"Leverage Distribution"} data={leverageDistribution}/>
      </SimpleGrid>
      <SimpleGrid columns={1}>
        <PieChart title={"Open Price distribution (DCU)"} data={openPriceDistribution}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Futures
