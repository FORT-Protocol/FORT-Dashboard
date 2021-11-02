import {
  DrawerContent,
  IconButton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  DrawerOverlay,
  Drawer,
  DrawerBody, Divider,
} from "@chakra-ui/react"
import Futures from "./Futures"
import Options from "./Options"
import Users from "./Users"
import logo from "../assets/svg/logo.svg";
import smallLogo from "../assets/svg/small-logo.svg"
import {useState} from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import {HamburgerIcon, CloseIcon} from "@chakra-ui/icons";
import Swap from "./Swap";
import useFetchFuturesTxlist from "../hooks/useFetchFuturesTxlist";
import useBlockNumber from "../hooks/useBlockNumber";

const App = () => {
  const [index, setIndex] = useState(0)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const blockNumber = useBlockNumber()
  const tabList = [
    {index: 0, label: "Futures", path: "/", content: <Futures/>},
    {index: 1, label: "Options", path: "/options", content: <Options/>},
    {index: 2, label: "Users", path: "/users", content: <Users/>},
    {index: 3, label: "Swap", path: "/swap", content: <Swap/>}
  ]

  // 获取当前区块高度，调用钩子函数后台更新Futures交易列表
  useFetchFuturesTxlist(blockNumber)

  const handleTabsChange = (index: number) => {
    setIndex(index)
  }

  const {width} = useWindowDimensions()

  return (
    <Tabs isLazy size={"lg"} index={index} onChange={handleTabsChange} variant={"unstyled"}>
      {width >= 1000 ? (
        <TabList alignItems={"center"} h={"66px"}>
          <Stack w={"100%"} h={"66px"} justifyContent={"center"} spacing={0}>
            <Stack pl={["22px", "22px", "44px"]} direction={"row"} spacing={4} position={"absolute"}>
              <img src={logo} alt={"logo"}/>
            </Stack>
            <Stack justifyContent={"center"} direction={"row"} w={"100%"} spacing={0}>
              {tabList.map((tab) => (
                <Tab h={"66px"} p={0} key={tab.index}>
                  <Stack borderBottom={"2px"} borderColor={index === tab.index ? "hedge" : "white"} h={"66px"}
                         w={"120px"} justifyContent={"center"}>
                    <Text color={index === tab.index ? "hedge" : "black"} fontSize={"16px"}
                          fontWeight={index === tab.index ? 700 : 500} fontFamily={"Montserrat"}>{tab.label}</Text>
                  </Stack>
                </Tab>
              ))}
            </Stack>
            <Divider/>
          </Stack>
        </TabList>
      ) : (
        <Stack w={"100%"} alignItems={"center"} spacing={0}>
          <Stack direction={"row"} alignItems={"center"} px={2} w={"100%"}>
            <IconButton aria-label="Search database" icon={<HamburgerIcon/>}
                        variant={"ghost"} position={"absolute"} onClick={onOpen}/>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} w={"100%"} h={"64px"}>
              <img src={smallLogo} alt={"logo"}/>
            </Stack>
          </Stack>
          <Divider/>
          <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay/>
            <DrawerContent>
              <DrawerBody>
                <Stack direction={"row"} alignItems={"center"} w={"100%"}>
                  <IconButton aria-label="Search database" icon={<CloseIcon/>} color={"hedge"}
                              variant={"ghost"} position={"absolute"} onClick={onClose}/>
                  <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} w={"100%"} h={"64px"}>
                    <img src={smallLogo} alt={"logo"}/>
                  </Stack>
                </Stack>
                <TabList>
                  <Stack py={"44px"} w={"100%"} alignItems={"center"}>
                    {tabList.map((tab)=> (
                      <Tab h={"66px"} p={0} w={"120px"} key={tab.index}>
                        <Stack borderBottom={"2px"} borderColor={index === tab.index ? "hedge": "white"} h={"66px"} w={"120px"} justifyContent={"center"}>
                          <Text color={index === tab.index ? "hedge" : "black"} fontSize={"16px"} fontWeight={index === tab.index ? 700 : 500} fontFamily={"Montserrat"}>{tab.label}</Text>
                        </Stack>
                      </Tab>
                    ))}
                  </Stack>
                </TabList>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </Stack>
      )}
      <TabPanels>
        {tabList.map((tab, index)=>(
          <TabPanel p={0} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export default App
