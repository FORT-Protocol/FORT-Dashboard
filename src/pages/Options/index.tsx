import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import {useRecoilValue} from "recoil";
import {totalTxVolumeAtom} from "../../state/options/updateTotalOpenPosition";
import {longShortDistributionAtom} from "../../state/options/updateLongShortDistribution";
import {totalTxVolumeListAtom} from "../../state/options/updateOpenPosition";
import {distributionOfExerciseTimespanAtom} from "../../state/options/updateDistributionOfExerciseTimespan";
// import {
//   OpenInterestAtom
// } from "../../state/options/updateOpenInterest";
import {statusAtom} from "../../hooks/useFetchOptionsTxList";
import {PROCESSING} from "../../constant/status";
import {optionsCumulativeNumberOfTransactionAtom} from "../../state/options/updateCumulativeNumberOfTransaction";
import {useEffect, useState} from "react";

const Options = () => {
  const [totalTxVolume, setTotalTxVolume] = useState("-")
  const [currentBullishQty, setCurrentBullishQty] = useState("-")
  const [currentBearishQty, setCurrentBearishQty] = useState("-")
  const [distributionOfLongShort, setDistributionOfLongShort] = useState<{value: number, type: string}[]>([])
  const totalTxVolumeList = useState("-")
  const distributionOfExerciseTimespan = useRecoilValue(distributionOfExerciseTimespanAtom({}))
  // const totalTradingVolumeList = useRecoilValue(OpenInterestAtom({}))
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
    fetch("https://api.hedge.red/api/options/dirDist")
      .then((res) => res.json())
      .then((json) => setDistributionOfLongShort(json["value"])
      )



  }


  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 2, 2, 4]} spacing={["22px", "22px", "44px"]}>
        <Norm value={totalTxVolume} desc={"Total Open Position"} color={"#C7A072"}/>
        <Norm value={currentBullishQty} desc={"Current Call Option Positions"} color={"#00B388"}/>
        <Norm value={currentBearishQty} desc={"Current Short Option Positions"} color={"#F23A12"}/>
        <Norm value={cumluativeNumberOfTransaction} desc={"Cumulative Number of Transaction"} color={"#E57200"} />
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        {/*<LineChart title={"Open Position"} data={totalTxVolumeList} suffix={"DCU"}/>*/}
        {/*<LineChart title={"Open Interest"} data={totalTradingVolumeList} noTotal/>*/}
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={["22px", "22px", "44px"]}>
        <PieChart title={"Long-Short Distribution"} data={distributionOfLongShort}/>
        <PieChart title={"Distribution of Exercise Timespan"} data={distributionOfExerciseTimespan}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Options
