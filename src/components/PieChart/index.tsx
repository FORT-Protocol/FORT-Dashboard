import {Stack, Text} from "@chakra-ui/react";
import {FC} from "react";

interface PieChartProps {
  title?: string
}

const PieChart: FC<PieChartProps> = props => {
  return (
    <Stack  height="616px" borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]}>
      <Text fontSize={"18px"} color={"#878787"} fontFamily={"Montserrat"}>{props.title}</Text>
    </Stack>
  )
}

export default PieChart