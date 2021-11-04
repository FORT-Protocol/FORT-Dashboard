import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {useRecoilValue} from "recoil";
import {allUserAtom} from "../../state/users/updateAllUsers";
import {futuresTradingUsersAtom} from "../../state/users/updateFuturesTradingUsers";
import {optionsTradingUsersAtom} from "../../state/users/updateOptionsTradingUsers";
import {newUsersListAtom} from "../../state/users/updateNewUsersList";
import {activeUsersListAtom} from "../../state/users/updateActiveUsersList";
import {PROCESSING} from "../../constant/status";
import {statusAtom} from "../../hooks/useFetchFuturesTxList";

const Users = () => {
  const allUser = useRecoilValue(allUserAtom({}))
  const futuresTradingUsers = useRecoilValue(futuresTradingUsersAtom({}))
  const optionsTradingUsers = useRecoilValue(optionsTradingUsersAtom({}))
  const newUsersList = useRecoilValue(newUsersListAtom({}))
  const activeUsersList = useRecoilValue(activeUsersListAtom({}))
  const status = useRecoilValue(statusAtom)

  return (
    <Stack spacing={["22px", "22px", "44px"]} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 1, 3, 3]} spacing={["22px", "22px", "44px"]}>
        <Norm value={status === PROCESSING ? "-" : allUser.size} desc={"All users"} color={"#C7A072"}/>
        <Norm value={status === PROCESSING ? "-" : futuresTradingUsers.size} desc={"Futures Trading users"} color={"#E57200"}/>
        <Norm value={status === PROCESSING ? "-" : optionsTradingUsers.size} desc={"Options Trading users"} color={"#00B388"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={["22px", "22px", "44px"]}>
        <LineChart title={"New Users"} data={newUsersList} noFixed={true}/>
        <LineChart title={"Active Users"} data={activeUsersList} noFixed={true}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Users
