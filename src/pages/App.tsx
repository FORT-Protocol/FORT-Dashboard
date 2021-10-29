import {Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react"
import Futures from "./Futures"
import Options from "./Options"
import Users from "./Users"
import logo from "../assets/svg/logo.svg";
import {useState} from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const App = () => {
  const [index, setIndex] = useState(0)

  const handleTabsChange = (index: number) => {
    setIndex(index)
  }

  const {width} = useWindowDimensions()

  return (
    <Tabs isLazy size={"lg"} index={index} onChange={handleTabsChange}>
      <TabList alignItems={"center"}>
        { width >= 1000 && (
          <Stack pl={["22px", "22px", "44px"]} direction={"row"} spacing={4} position={"absolute"}>
            <img src={logo} alt={"logo"}/>
            <Text px={4} py={2} borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} fontWeight={600}
                  fontSize={"18px"} color={"#878787"} fontFamily={"Montserrat"}>Dashboard</Text>
          </Stack>
        )}
        <Spacer/>
        <Tab h={"66px"}>
          <Text color={index === 0 ? "hedge" : "black"} fontWeight={"bold"} fontFamily={"Montserrat"}>Futures</Text>
        </Tab>
        <Tab h={"66px"}>
          <Text color={index === 1 ? "hedge" : "black"} fontWeight={"bold"} fontFamily={"Montserrat"}>Options</Text>
        </Tab>
        <Tab h={"66px"}>
          <Text color={index === 2 ? "hedge" : "black"} fontWeight={"bold"} fontFamily={"Montserrat"}>User</Text>
        </Tab>
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
