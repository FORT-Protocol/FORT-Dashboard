import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import {cumulativeOpenPositionsAtom} from "../../state/futures/updateCumulativeOpenPositions";
import {useRecoilValue} from "recoil";
import {openingVolumeListAtom} from "../../state/futures/updateOpeningVolumeList";
import {longShortDistributionAtom} from "../../state/futures/updateLongShortDistribution";
import {leverageDistributionAtom} from "../../state/futures/updateLeverageDistribution";
// import {openPriceDistributionAtom} from "../../state/futures/updateOpenPriceDistribution";
import {
  currentOpenLongPositionsAtom,
  currentOpenShortPositionsAtom,
  positionListAtom
} from "../../state/futures/updatePositionList";
import {statusAtom} from "../../hooks/useFetchFuturesTxList";
import {PROCESSING} from "../../constant/status";

const Futures = () => {
  const cumulativeOpenPositions = useRecoilValue(cumulativeOpenPositionsAtom({}))
  const curOpenLongPositions = useRecoilValue(currentOpenLongPositionsAtom({}))
  const curOpenShortPositions = useRecoilValue(currentOpenShortPositionsAtom({}))
  const openingVolumeList = useRecoilValue(openingVolumeListAtom({}))
  const longShortDistribution = useRecoilValue(longShortDistributionAtom({}))
  const leverageDistribution = useRecoilValue(leverageDistributionAtom({}))
  // const openPriceDistribution = useRecoilValue(openPriceDistributionAtom({}))
  const positionList = useRecoilValue(positionListAtom({}))
  const status = useRecoilValue(statusAtom)

  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 1, 3]} spacing={["22px", "22px", "44px"]}>
        <Norm value={status === PROCESSING ? "-" : cumulativeOpenPositions.toFixed(2)} desc={"Cumulative open positions"} color={"#C7A072"}/>
        <Norm value={status === PROCESSING ? "-" : curOpenLongPositions.toFixed(2)} desc={"Current Open Long Positions (DCU)"} color={"#00B388"}/>
        <Norm value={status === PROCESSING ? "-" : curOpenShortPositions.toFixed(2)} desc={"Current Open Short Positions (DCU)"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        <LineChart title={"Opening volume"} suffix={"DCU"} data={openingVolumeList}/>
        <LineChart title={"Position"} suffix={"DCU"} data={positionList} noTotal/>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing={["22px", "22px", "44px"]}>
        <PieChart title={"Long-Short Distribution"} data={longShortDistribution}/>
        <PieChart title={"Leverage Distribution"} data={leverageDistribution}/>
      </SimpleGrid>
      {/*<SimpleGrid columns={1}>*/}
      {/*  <PieChart title={"Open Price distribution (DCU)"} data={openPriceDistribution}/>*/}
      {/*</SimpleGrid>*/}
    </Stack>
  )
}

export default Futures
