import {Stack, Text} from "@chakra-ui/react";
import {FC} from "react";
import { Pie } from '@ant-design/charts';

interface PieChartProps {
  title?: string
  data?: any
}

const PieChart: FC<PieChartProps> = props => {
  const config = {
    appendPadding: 10,
    data: props.data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{type: 'pie-legend-active'}, {type: 'element-active'}],
    color: ["#4FB08B", "#D7772C", "#F6E272", "#BEDE9F", "#5BCBEA"]
  };

  return (
    <Stack borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]}>
      <Text fontSize={"18px"} color={"#878787"} fontWeight={600} fontFamily={"Montserrat"}>{props.title}</Text>
      <Pie {...config} />
    </Stack>
  )
}

export default PieChart