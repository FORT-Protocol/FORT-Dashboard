import {Box, SimpleGrid, Stack} from "@chakra-ui/react";

const Users = () => {
  return (
    <Stack spacing={"44px"} w={"100%"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 3]} spacing="44px">
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
        <Box bg="tomato" height="154px" borderRadius={"20px"}></Box>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing={"44px"}>
        <Box bg="blue" height="616px" borderRadius={"20px"}></Box>
        <Box bg="blue" height="616px" borderRadius={"20px"}></Box>
      </SimpleGrid>
    </Stack>
  )
}

export default Users
