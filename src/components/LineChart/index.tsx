import {Button, Spacer, Stack, Text} from "@chakra-ui/react";
import {FC, useEffect, useState} from "react";
import {Line} from '@ant-design/charts';

interface LineChartProps {
  title?: string,
  total?: number | string,
  prefix?: string
  suffix?: string
}

const DemoLine: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    data: data,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: {
        formatter: function formatter(v: any) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
    color: ['#1979C9', '#D62A0D', '#FAA219'],
  };
  return <Line {...config} />;
};

const LineChart: FC<LineChartProps> = props => {
  const [selector, setSelector] = useState("1W")

  return (
    <Stack height="616px" borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]}>
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
      <DemoLine/>
    </Stack>
  )
}

export default LineChart