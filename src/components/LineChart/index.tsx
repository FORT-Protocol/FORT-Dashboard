import {Button, Spacer, Stack, Text} from "@chakra-ui/react";
import {FC} from "react";

interface LineChartProps {
  title?: string,
  total?: number | string,
  prefix?: string
  suffix?: string
}

const LineChart: FC<LineChartProps> = props => {
  return (
    <Stack height="616px" borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]}>
      {props.title && (
        <Text fontSize={"18px"} color={"#878787"} fontFamily={"Montserrat"}>{props.title}</Text>
      )}
      <Stack direction={"row"}>
        {props.total && (
          <Stack direction={"row"} alignItems={"baseline"}>
            <Text color={"#0047BB"} fontSize={"28px"} fontWeight={600} fontFamily={"Montserrat"}>{props.prefix} {props.total || "-"}</Text>
            <Text color={"#0047BB"} fontWeight={600} fontFamily={"Montserrat"}>{props.suffix}</Text>
          </Stack>
        )}
        <Spacer/>
        <Stack direction={"row"}>
          <Button variant={"ghost"} size={"sm"} fontFamily={"Montserrat"}>1W</Button>
          <Button variant={"ghost"} size={"sm"} fontFamily={"Montserrat"}>1M</Button>
          <Button variant={"ghost"} size={"sm"} fontFamily={"Montserrat"}>ALL</Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default LineChart