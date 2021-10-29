import {Box, SimpleGrid, Stack} from "@chakra-ui/react";

const Futures = () => {
  return (
    <Stack spacing={"44px"} w={"100%"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 4]} spacing="44px">
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
      </SimpleGrid>
      <Box bg="blue" height="616px" borderRadius={"20px"}></Box>
      <Box bg="blue" height="616px" borderRadius={"20px"}></Box>
      <Box bg="blue" height="616px" borderRadius={"20px"}></Box>
    </Stack>
  )
}

export default Futures
