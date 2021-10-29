import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useEffect, useState} from "react";

const Futures = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 4]} spacing="44px">
        <Norm value={75647} desc={"Total Transaction Volume"} color={"#C7A072"}/>
        <Norm value={75647} desc={"Total Transaction Volume (ETH)"} color={"#E57200"}/>
        <Norm value={75647} desc={"Current Open Long Positions (ETH)"} color={"#00B388"}/>
        <Norm value={75647} desc={"Current Open Short Positions (ETH)"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing="44px">
        <LineChart title={"Total Transaction Volume"} total={725647} suffix={"DCU"} data={data}/>
        <LineChart title={"Total Trading Volume"} total={12389} prefix={"$"} data={data}/>
        <LineChart title={"Cumulative liquidation amount"} total={367288} suffix={"DCU"}  data={data}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Futures
