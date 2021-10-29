import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useEffect, useState} from "react";

const Users = () => {
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
      <SimpleGrid columns={[1, 2, 2, 3]} spacing="44px">
        <Norm value={75647} desc={"All users"} color={"#C7A072"}/>
        <Norm value={75647} desc={"Futures Trading users"} color={"#E57200"}/>
        <Norm value={75647} desc={"Options Trading users"} color={"#00B388"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={"44px"}>
        <LineChart title={"New Users"} total={2738} data={data}/>
        <LineChart title={"Active Users"} total={38292} data={data}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Users
