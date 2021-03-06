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
import {useState} from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import {HamburgerIcon, CloseIcon} from "@chakra-ui/icons";
import Swap from "./Swap";
import {useGA4React} from "ga-4-react";
import {FortLogo} from "../assets";

const App = () => {
  const [index, setIndex] = useState(0)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const ga4 = useGA4React()
  const tabList = [
    {index: 0, label: "Futures", path: "/", content: <Futures/>},
    {index: 1, label: "Options", path: "/options", content: <Options/>},
    {index: 2, label: "Swap", path: "/swap", content: <Swap/>},
    {index: 3, label: "Users", path: "/users", content: <Users/>},
  ]

  const handleTabsChange = (index: number) => {
    if (ga4) {
      ga4.pageview(tabList[index].path)
    }
    setIndex(index)
  }

  const {width} = useWindowDimensions()

  return (
    <Tabs isLazy size={"lg"} index={index} onChange={handleTabsChange} variant={"unstyled"}>
      {width >= 1000 ? (
        <TabList alignItems={"center"} h={"66px"}>
          <Stack w={"100%"} h={"66px"} justifyContent={"center"} spacing={0}>
            <Stack pl={["20px", "20px", "40px"]} spacing={4} position={"absolute"}>
              <FortLogo />
            </Stack>
            <Stack justifyContent={"center"} direction={"row"} w={"100%"} spacing={0}>
              {tabList.map((tab) => (
                <Tab h={"66px"} p={0} key={tab.index} _focus={{ outline: "none" }}>
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
            <IconButton aria-label="menu" icon={<HamburgerIcon/>}
                        _focus={{ outline: "none" }}
                        _active={{ bg: "white" }}
                        _hover={{ bg: "white" }}
                        variant={"ghost"} position={"absolute"} onClick={onOpen}/>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} w={"100%"} h={"64px"}>
              <FortLogo />
            </Stack>
          </Stack>
          <Divider/>
          <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay/>
            <DrawerContent>
              <DrawerBody>
                <Stack direction={"row"} alignItems={"center"} w={"100%"}>
                  <IconButton aria-label="close" icon={<CloseIcon/>} color={"hedge"}
                              _hover={{ bg: "white" }}
                              _active={{ bg: "white" }}
                              size={"sm"}
                              _focus={{ outline: "none" }}
                              variant={"ghost"} position={"absolute"} onClick={onClose}/>
                  <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} w={"100%"} h={"64px"}>
                    <FortLogo height={"20px"} />
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
