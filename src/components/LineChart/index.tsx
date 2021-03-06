import {Button, Stack, Text} from "@chakra-ui/react";
import {FC, useEffect, useState} from "react";
import {Line} from '@ant-design/charts';
import useWindowDimensions from "../../hooks/useWindowDimensions";
import {formatNumber} from "../../utils/util";

interface LineChartProps {
  title?: string,
  prefix?: string
  suffix?: string
  data: { day: string, value: number, category: string }[]
  noFixed?: boolean
  noTotal?: boolean
  value?: number
  useLast?: boolean
  useLimit?: boolean
}

const LineChart: FC<LineChartProps> = props => {
  const [selector, setSelector] = useState("1M")
  const {width} = useWindowDimensions()
  const [data, setData] = useState(props.data)
  const [sum, setSum] = useState(0)
  const [maxLimit, setMaxLimit] = useState(0)
  const [minLimit, setMinLimit] = useState(0)

  useEffect(()=>{
    let max = data[0]?.value;
    let min = data[0]?.value;
    data.forEach((d: { day: string, value: number, category: string }) => {
      if (d.value > max) {
        max = d.value
      }
      if (d.value < min) {
        min = d.value
      }
    })
    setMaxLimit(max)
    setMinLimit(min)
  }, [data])

  useEffect(()=> {
    if (props.useLast) {
      setSum(data[data.length - 1]?.value || 0)
    } else if (!props.noTotal){
      let s = 0
      data.forEach((d: { day: string, value: number, category: string }) => {
        if (d.category === "Total") {
          s += d.value
        }
      })
      setSum(s)
    }
  }, [data, props.noTotal, props.useLast])

  useEffect(() => {
    if (selector === "1W") {
      const tempData = props.data.filter((data) => {
        const day = new Date(data.day.replace(/\./g, "/")).getTime()
        return (new Date().getTime() - day) <= 7 * 84600000
      })
      setData(tempData)
    }
    if (selector === "1M") {
      const tempData = props.data.filter((data) => {
        const day = new Date(data.day.replace(/\./g, "/")).getTime()
        return new Date().getTime() - day <= 30 * 84600000
      })
      setData(tempData)
    }
    if (selector === "All") {
      setData(props.data)
    }
  }, [selector, setSelector, props.data])

  const config = {
    data: data,
    xField: 'day',
    yField: 'value',
    seriesField: 'category',
    color: ['#0047BB', "#4FB08B", "#D7772C", "#F6E272", "#BEDE9F", "#5BCBEA"],
    point: {
      shape: "circle",
      size: 4
    },
    autoFit: true,
    yAxis: {
      maxLimit: props.useLimit ? Math.ceil(maxLimit / 10000) * 10000 : null,
      minLimit: props.useLimit ? Math.floor(minLimit / 10000) * 10000 : null,
    },
    interactions: [{ type: 'marker-active' }],
    lineStyle: {
      lineWidth: 2.5,
    },
    smooth: true,
  };

  const ButtonGroups = () => {
    return (
      <Stack direction={"row"} spacing={"20px"}>
        <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                color={selector === "1W" ? "hedge" : "black"}
                _focus={{outline: "none"}}
                onClick={() => setSelector("1W")}
                border={"2px"}
                borderColor={selector === "1W" ? "#0047BB" : "#EDF2F7"}>1W</Button>
        <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                color={selector === "1M" ? "hedge" : "black"}
                _focus={{outline: "none"}}
                onClick={() => setSelector("1M")}
                border={"2px"}
                borderColor={selector === "1M" ? "#0047BB" : "#EDF2F7"}>1M</Button>
        <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                color={selector === "All" ? "hedge" : "black"}
                _focus={{outline: "none"}}
                onClick={() => setSelector("All")}
                border={"2px"}
                borderColor={selector === "All" ? "#0047BB" : "#EDF2F7"}>ALL</Button>
      </Stack>
    )
  }

  const Total = () => {
    return (
      <Stack direction={"row"} alignItems={"baseline"}>
        <Text color={"hedge"} fontSize={28} fontWeight={600}
              fontFamily={"Montserrat"}>{props.prefix} {formatNumber(props.noFixed ? sum : sum.toFixed(2))}</Text>
        <Text color={"hedge"} fontWeight={600} fontFamily={"Montserrat"}>{props.suffix}</Text>
      </Stack>
    )
  }

  return (
    <Stack borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]} spacing={"8px"}>
      {props.title && (
        <Text fontSize={width < 1000 ? 12 : 18} fontWeight={600} color={"#878787"}
              fontFamily={"Montserrat"}>{props.title}</Text>
      )}
      { width < 600 ? (
        <Stack>
          {!props.noTotal ? (
           <Total />
          ) : (
            <Text/>
          )}
          <ButtonGroups />
        </Stack>
      ) : (
        <Stack direction={"row"} justifyContent={"space-between"}>
          {!props.noTotal ? (
            <Total />
          ) : (
            <Text/>
          )}
          <ButtonGroups />
        </Stack>
      ) }
      <Stack h={width < 600 ? "240px" : "360px"} w={"100%"}>
        <Line {...config} />
      </Stack>
    </Stack>
  )
}

export default LineChart