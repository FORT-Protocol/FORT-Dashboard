import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useState} from "react";
import testData from "../../tests/data.json";

const Futures = () => {
  const [tData] = useState(testData);

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 4]} spacing="44px">
        <Norm value={tData.futures.totalTxVolume} desc={"Total Transaction Volume"} color={"#C7A072"}/>
        <Norm value={tData.futures.totalTxVolumeETH} desc={"Total Transaction Volume (ETH)"} color={"#E57200"}/>
        <Norm value={tData.futures.curOpenLongPositionsETH} desc={"Current Open Long Positions (ETH)"} color={"#00B388"}/>
        <Norm value={tData.futures.curOpenShortPositionsETH} desc={"Current Open Short Positions (ETH)"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing="44px">
        <LineChart title={"Total Transaction Volume"} total={725647} suffix={"DCU"} data={tData.futures.totalTransactionVolume}/>
        <LineChart title={"Total Trading Volume"} total={12389} prefix={"$"} data={tData.futures.totalTradingVolume}/>
        <LineChart title={"Cumulative liquidation amount"} total={367288} suffix={"DCU"} data={tData.futures.cumulativeLiquidationAmount}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Futures
