import {Button, Spacer, Stack, Text} from "@chakra-ui/react";
import {FC, useState} from "react";
import {Line} from '@ant-design/charts';

interface LineChartProps {
  title?: string,
  total?: number | string,
  prefix?: string
  suffix?: string
  data?: any
}

const LineChart: FC<LineChartProps> = props => {
  const [selector, setSelector] = useState("1W")

  const config = {
    data: props.data,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    color: ['#1979C9', '#D62A0D', '#FAA219'],
  };

  return (
    <Stack borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]} spacing={"8px"}>
      {props.title && (
        <Text fontSize={"18px"} color={"#878787"} fontFamily={"Montserrat"}>{props.title}</Text>
      )}
      <Stack direction={"row"}>
        {props.total && (
          <Stack direction={"row"} alignItems={"baseline"}>
            <Text color={"hedge"} fontSize={"28px"} fontWeight={600}
                  fontFamily={"Montserrat"}>{props.prefix} {props.total || "-"}</Text>
            <Text color={"hedge"} fontWeight={600} fontFamily={"Montserrat"}>{props.suffix}</Text>
          </Stack>
        )}
        <Spacer/>
        <Stack direction={"row"}>
          <Button variant={"ghost"} size={"sm"} fontFamily={"Montserrat"} color={selector === "1W" ? "hedge" : "black"}
                  onClick={() => setSelector("1W")}>1W</Button>
          <Button variant={"ghost"} size={"sm"} fontFamily={"Montserrat"} color={selector === "1M" ? "hedge" : "black"}
                  onClick={() => setSelector("1M")}>1M</Button>
          <Button variant={"ghost"} size={"sm"} fontFamily={"Montserrat"} color={selector === "All" ? "hedge" : "black"}
                  onClick={() => setSelector("All")}>ALL</Button>
        </Stack>
      </Stack>
      <Line {...config} />
    </Stack>
  )
}

export default LineChart