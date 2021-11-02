import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useState} from "react";
import testData from "../../tests/data.json";
import PieChart from "../../components/PieChart";
import {totalTxVolumeAtom} from "../../state/futures/updateTotalTxVolume";
import {useRecoilValue} from "recoil";
import {curOpenShortPositionsAtom} from "../../state/futures/updateCurrentOpenShortPositionDCU";
import {curOpenLongPositionsAtom} from "../../state/futures/updateCurrentOpenLongPositionsDCU";

const Futures = () => {
  const [tData] = useState(testData);
  // 调用Recoil状态直接供前端显示
  const totalTxVolume = useRecoilValue(totalTxVolumeAtom({}))
  const curOpenLongPositions = useRecoilValue(curOpenLongPositionsAtom({}))
  const curOpenShortPositions = useRecoilValue(curOpenShortPositionsAtom({}))

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 4]} spacing="44px">
        <Norm value={totalTxVolume.toFixed(2)} desc={"Total Transaction Volume"} color={"#C7A072"}/>
        <Norm value={tData.futures.totalTxVolumeETH} desc={"Total Transaction Volume (DCU)"} color={"#E57200"}/>
        <Norm value={curOpenLongPositions.toFixed(2)} desc={"Current Open Long Positions (DCU)"} color={"#00B388"}/>
        <Norm value={curOpenShortPositions.toFixed(2)} desc={"Current Open Short Positions (DCU)"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing="44px">
        <LineChart title={"Total Transaction Volume"} total={725647} suffix={"DCU"} data={tData.futures.totalTransactionVolumeList}/>
        <LineChart title={"Total Trading Volume"} total={12389} prefix={"$"} data={tData.futures.totalTradingVolumeList}/>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing="44px">
        <PieChart title={"Long-Short Distribution"} data={tData.futures.longShortDistribution}/>
        <PieChart title={"Leverage Distribution"} data={tData.futures.leverageDistribution}/>
      </SimpleGrid>
      <SimpleGrid columns={1}>
        <PieChart title={"Open Price distribution (USDT)"} data={tData.futures.openPriceDistributionUSDT}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Futures
