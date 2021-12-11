import {Stack, Text} from "@chakra-ui/react";
import {FC} from "react";
import { Pie } from '@ant-design/charts';
import useWindowDimensions from "../../hooks/useWindowDimensions";

interface PieChartProps {
  title?: string
  data: {value: number, type: string}[]
}

const PieChart: FC<PieChartProps> = props => {
  const {width} = useWindowDimensions()

  const config = {
    appendPadding: 10,
    data: props.data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 40,
      radius: 0.75,
      content: '{name}\n{percentage}',
      style: { fontSize: 12, fontWeight: 700},
    },
    interactions: [{type: 'pie-legend-active'}, {type: 'element-active'}],
    color: ["#4FB08B", "#D7772C", "#F6E272", "#BEDE9F", "#5BCBEA"]
  };

  return (
    <Stack borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]}>
      <Text fontSize={width < 1000 ? 12 : 18} color={"#878787"} fontWeight={600} fontFamily={"Montserrat"}>{props.title}</Text>
      <Stack h={width < 1000 ? "240px" : "360px"}>
        <Pie {...config} />
      </Stack>
    </Stack>
  )
}

export default PieChart