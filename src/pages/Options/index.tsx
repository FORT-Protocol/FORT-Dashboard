import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import PieChart from "../../components/PieChart";
import {useEffect, useState} from "react";

const Options = () => {
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

  const data2 = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
  ];

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 4]} spacing="44px">
        <Norm value={75647} desc={"Total Transaction Volume"} color={"#C7A072"}/>
        <Norm value={75647} desc={"Total Transaction Volume (ETH)"} color={"#E57200"}/>
        <Norm value={75647} desc={"Current Call Option Positions (ETH)"} color={"#00B388"}/>
        <Norm value={75647} desc={"Current Short Option Positions (ETH)"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={"44px"}>
        <LineChart title={"Total Transaction Volume"} total={382992} data={data}/>
        <LineChart title={"Total Trading Volume"} total={233323} data={data}/>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing="44px">
        <PieChart title={"Long-Short Distribution"} data={data2}/>
        <PieChart title={"Distribution of Exercise Timespan"} data={data2}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Options
