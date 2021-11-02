import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useState} from "react";
import data from "../../tests/data.json";
import {useRecoilValue} from "recoil";
import {allUserAtom} from "../../state/users/updateAllUsers";

const Users = () => {
  const [tData] = useState(data);
  const allUser = useRecoilValue(allUserAtom({}))

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 3]} spacing="44px">
        <Norm value={allUser} desc={"All users"} color={"#C7A072"}/>
        <Norm value={tData.users.futuresTradingUsers} desc={"Futures Trading users"} color={"#E57200"}/>
        <Norm value={tData.users.optionsTradingUsers} desc={"Options Trading users"} color={"#00B388"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={"44px"}>
        <LineChart title={"New Users"} total={2738} data={tData.users.newUsersList}/>
        <LineChart title={"Active Users"} total={38292} data={tData.users.activeUsersList}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Users
