import {Box, SimpleGrid, Stack} from "@chakra-ui/react";

const Options = () => {
  return (
    <Stack spacing={"44px"} w={"100%"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 4]} spacing="44px">
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={"44px"}>
        <Box bg="blue" height="616px" borderRadius={"20px"}></Box>
        <Box bg="blue" height="616px" borderRadius={"20px"}></Box>
      </SimpleGrid>
      <SimpleGrid columns={[1, 1, 1, 2]} spacing="44px">
        <Box bg="tomato" height="616px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="616px" borderRadius={"20px"}></Box>
      </SimpleGrid>
    </Stack>
  )
}

export default Options
