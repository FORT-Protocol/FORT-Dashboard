import {SimpleGrid, Stack} from "@chakra-ui/react";
import {useState} from "react";
import data from "../../tests/data.json";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";

const Swap = () => {
  const [tData] = useState(data);

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 4]} spacing="44px">
        <Norm value={tData.swap.numberOfNEST} desc={"Number of NEST"} color={"#C7A072"}/>
        <Norm value={tData.swap.numberOfDCU} desc={"Number of DCU"} color={"#E57200"}/>
        <Norm value={tData.swap.cumulativeNumberOfTransaction} desc={"Cumulative Number of Transaction"} color={"#00B388"}/>
        <Norm value={tData.swap.totalTransactionVolume} desc={"Total Transaction Volume"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing="44px">
        <LineChart title={"Total Transaction Volume"} total={725647} suffix={"DCU"} data={tData.swap.totalTransactionVolumeList}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Swap