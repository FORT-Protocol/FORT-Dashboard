import {Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react"
import Futures from "./Futures"
import Options from "./Options"
import Users from "./Users"
import logo from "../assets/svg/logo.svg";

const App = () => {
  return (
    <Tabs isLazy>
      <TabList alignItems={"center"}>
        <Stack pl={["22px", "22px", "44px"]} direction={"row"} spacing={4} position={"absolute"}>
          <img src={logo} alt={"logo"}/>
          <Text px={4} py={2} borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} fontWeight={600}
                fontSize={"18px"} color={"#878787"} fontFamily={"Montserrat"}>Dashboard</Text>
        </Stack>
        <Spacer/>
        <Tab h={"66px"} fontWeight={"bold"} fontFamily={"Montserrat"}>Futures</Tab>
        <Tab h={"66px"} fontWeight={"bold"} fontFamily={"Montserrat"}>Options</Tab>
        <Tab h={"66px"} fontWeight={"bold"} fontFamily={"Montserrat"}>User</Tab>
        <Spacer/>
      </TabList>
      <TabPanels>
        <TabPanel p={0}>
          <Futures/>
        </TabPanel>
        <TabPanel p={0}>
          <Options/>
        </TabPanel>
        <TabPanel p={0}>
          <Users/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default App
