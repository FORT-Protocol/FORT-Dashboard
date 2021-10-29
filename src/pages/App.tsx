import {Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react"
import Futures from "./Futures"
import Options from "./Options"
import Users from "./Users"
import Footer from "../components/Footer";
import logo from "../assets/logo.svg";

const App = () => {
  return (
    <Stack alignItems={"center"} w={"100%"}>
      <Tabs isLazy w={"100%"}>
        <TabList alignItems={"center"}>
          <Stack pl={["22px", "22px", "44px"]}>
            <img src={logo}/>
          </Stack>
          <Spacer/>
          <Tab h={"66px"}>Futures</Tab>
          <Tab h={"66px"}>Options</Tab>
          <Tab h={"66px"}>User</Tab>
          <Spacer/>
        </TabList>
        <TabPanels>
          <TabPanel p={0} w={"100%"}>
            <Futures/>
          </TabPanel>
          <TabPanel p={0} w={"100%"}>
            <Options/>
          </TabPanel>
          <TabPanel p={0} w={"100%"}>
            <Users/>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Footer />
    </Stack>
  )
}

export default App
