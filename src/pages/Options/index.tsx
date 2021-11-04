import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import {useRecoilValue} from "recoil";
import {totalTxVolumeAtom} from "../../state/options/updateTotalTxVolume";
import {currentCallOptionsDCUAtom} from "../../state/options/updateCurrentCallOptionsETH";
import {currentShortOptionsDCUAtom} from "../../state/options/updateCurrentShortOptionsETH";
import {longShortDistributionAtom} from "../../state/options/updateLongShortDistribution";
import {totalTxVolumeListAtom} from "../../state/options/updateTotalTxVolumeList";
import {distributionOfExerciseTimespanAtom} from "../../state/options/updateDistributionOfExerciseTimespan";
import {totalTradingVolumeListAtom} from "../../state/options/updateTotalTradingVolumeList";
import {statusAtom} from "../../hooks/useFetchOptionsTxList";
import {PROCESSING} from "../../constant/status";

const Options = () => {
  const totalTxVolume = useRecoilValue(totalTxVolumeAtom({}))
  const curCallOptionPosition = useRecoilValue(currentCallOptionsDCUAtom({}))
  const curShortOptionPosition = useRecoilValue(currentShortOptionsDCUAtom({}))
  const longShortDistribution = useRecoilValue(longShortDistributionAtom({}))
  const totalTxVolumeList = useRecoilValue(totalTxVolumeListAtom({}))
  const distributionOfExerciseTimespan = useRecoilValue(distributionOfExerciseTimespanAtom({}))
  const totalTradingVolumeList = useRecoilValue(totalTradingVolumeListAtom({}))
  const status = useRecoilValue(statusAtom)

  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 1, 3, 3]} spacing={["22px", "22px", "44px"]}>
        <Norm value={status === PROCESSING ? "-" : totalTxVolume.toFixed(2)} desc={"Total Transaction Volume (DCU)"} color={"#C7A072"}/>
        <Norm value={status === PROCESSING ? "-" : curCallOptionPosition.toFixed(2)} desc={"Current Call Option Positions (DCU)"} color={"#00B388"}/>
        <Norm value={status === PROCESSING ? "-" : curShortOptionPosition.toFixed(2)} desc={"Current Short Option Positions (DCU)"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        <LineChart title={"Total Transaction Volume"} data={totalTxVolumeList} suffix={"DCU"}/>
        <LineChart title={"Total Trading Volume"} data={totalTradingVolumeList} suffix={"DCU"}/>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={["22px", "22px", "44px"]}>
        <PieChart title={"Long-Short Distribution"} data={longShortDistribution}/>
        <PieChart title={"Distribution of Exercise Timespan"} data={distributionOfExerciseTimespan}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Options
