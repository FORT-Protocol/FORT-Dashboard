import {Stack, Text} from "@chakra-ui/react";
import {FC} from "react";
import { Pie } from '@ant-design/charts';

const DemoPie: FC = () => {
  var data = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
  ];
  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };
  return <Pie {...config} />;
};

interface PieChartProps {
  title?: string
}

const PieChart: FC<PieChartProps> = props => {
  return (
    <Stack  height="616px" borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]}>
      <Text fontSize={"18px"} color={"#878787"} fontFamily={"Montserrat"}>{props.title}</Text>
      <DemoPie/>
    </Stack>
  )
}

export default PieChart