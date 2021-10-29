import {color, Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react"
import Futures from "./Futures"
import Options from "./Options"
import Users from "./Users"
import logo from "../assets/svg/logo.svg";

const App = () => {
  return (
    <Stack alignItems={"center"}>
      <Tabs isLazy>
        <TabList alignItems={"center"}>
          <Stack pl={["22px", "22px", "44px"]}>
            <img src={logo}/>
          </Stack>
          <Spacer/>
          <Tab h={"66px"} fontWeight={"bold"}>Futures</Tab>
          <Tab h={"66px"} fontWeight={"bold"}>Options</Tab>
          <Tab h={"66px"} fontWeight={"bold"}>User</Tab>
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
    </Stack>
  )
}

export default App
