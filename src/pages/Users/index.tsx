import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";

const Users = () => {
  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 3]} spacing="44px">
        <Norm value={75647} desc={"All users"} color={"#C7A072"}/>
        <Norm value={75647} desc={"Futures Trading users"} color={"#E57200"}/>
        <Norm value={75647} desc={"Options Trading users"} color={"#00B388"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={"44px"}>
        <LineChart title={"New Users"} total={2738}/>
        <LineChart title={"Active Users"} total={38292}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Users
