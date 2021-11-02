import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useRecoilValue} from "recoil";
import {allUserAtom} from "../../state/users/updateAllUsers";
import {futuresTradingUsersAtom} from "../../state/users/updateFuturesTradingUsers";
import {optionsTradingUsersAtom} from "../../state/users/updateOptionsTradingUsers";
import {newUsersListAtom} from "../../state/users/updateNewUsersList";
import {activeUsersListAtom} from "../../state/users/updateActiveUsersList";

const Users = () => {
  const allUser = useRecoilValue(allUserAtom({}))
  const futuresTradingUsers = useRecoilValue(futuresTradingUsersAtom({}))
  const optionsTradingUsers = useRecoilValue(optionsTradingUsersAtom({}))
  const newUsersList = useRecoilValue(newUsersListAtom({}))
  const activeUsersList = useRecoilValue(activeUsersListAtom({}))

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 3]} spacing="44px">
        <Norm value={allUser.size} desc={"All users"} color={"#C7A072"}/>
        <Norm value={futuresTradingUsers.size} desc={"Futures Trading users"} color={"#E57200"}/>
        <Norm value={optionsTradingUsers.size} desc={"Options Trading users"} color={"#00B388"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={"44px"}>
        <LineChart title={"New Users"} total={allUser.size} data={newUsersList}/>
        <LineChart title={"Active Users"} total={38292} data={activeUsersList}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Users
