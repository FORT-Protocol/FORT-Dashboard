import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import {useRecoilValue} from "recoil";
import {totalTxVolumeAtom} from "../../state/options/updateTotalOpenPosition";
import {longShortDistributionAtom} from "../../state/options/updateLongShortDistribution";
import {totalTxVolumeListAtom} from "../../state/options/updateOpenPosition";
import {distributionOfExerciseTimespanAtom} from "../../state/options/updateDistributionOfExerciseTimespan";
import {
  OpenInterestAtom
} from "../../state/options/updateOpenInterest";
import {statusAtom} from "../../hooks/useFetchOptionsTxList";
import {PROCESSING} from "../../constant/status";

const Options = () => {
  const totalTxVolume = useRecoilValue(totalTxVolumeAtom({}))
  const longShortDistribution = useRecoilValue(longShortDistributionAtom({}))
  const totalTxVolumeList = useRecoilValue(totalTxVolumeListAtom({}))
  const distributionOfExerciseTimespan = useRecoilValue(distributionOfExerciseTimespanAtom({}))
  const totalTradingVolumeList = useRecoilValue(OpenInterestAtom({}))
  const status = useRecoilValue(statusAtom)

  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 1, 3, 3]} spacing={["22px", "22px", "44px"]}>
        <Norm value={status === PROCESSING ? "-" : totalTxVolume.toFixed(2)} desc={"Total Open Position"} color={"#C7A072"}/>
        <Norm value={status === PROCESSING ? "-" : longShortDistribution[0].value.toFixed(2)} desc={"Current Call Option Positions"} color={"#00B388"}/>
        <Norm value={status === PROCESSING ? "-" : longShortDistribution[1].value.toFixed(2)} desc={"Current Short Option Positions"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        <LineChart title={"Open Position"} data={totalTxVolumeList} suffix={"DCU"}/>
        <LineChart title={"Open Interest"} data={totalTradingVolumeList} noTotal/>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={["22px", "22px", "44px"]}>
        <PieChart title={"Long-Short Distribution"} data={longShortDistribution}/>
        <PieChart title={"Distribution of Exercise Timespan"} data={distributionOfExerciseTimespan}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Options
