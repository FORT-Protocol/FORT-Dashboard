import {Button, Stack, Text} from "@chakra-ui/react";
import {FC, useEffect, useState} from "react";
import {Line} from '@ant-design/charts';
import useWindowDimensions from "../../hooks/useWindowDimensions";

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
  const today = new Date().getTime()
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
  }, [data])

  useEffect(() => {
    if (selector === "1W") {
      const tempData = props.data.filter((data) => {
        const day = new Date(data.day).getTime()
        return today - day <= 7 * 84600000
      })
      setData(tempData)
    }
    if (selector === "1M") {
      const tempData = props.data.filter((data: { day: string, value: number, category: string }) => {
        const day = new Date(data.day).getTime()
        return today - day <= 30 * 84600000
      })
      setData(tempData)
    }
    if (selector === "All") {
      setData(props.data)
    }
  }, [selector, setSelector, props])

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
    yAxis: {
      maxLimit: props.useLimit ? Math.ceil(maxLimit / 10000) * 10000 : null,
      minLimit: props.useLimit ? Math.floor(minLimit / 10000) * 10000 : null,
    },
    interactions: [{ type: 'marker-active' }],
    lineStyle: {
      lineWidth: 3,
    },
    slider: {
      start: 0,
      end: 1,
    },
  };

  return (
    <Stack borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]} spacing={"8px"}>
      {props.title && (
        <Text fontSize={width < 1000 ? 12 : 18} fontWeight={600} color={"#878787"}
              fontFamily={"Montserrat"}>{props.title}</Text>
      )}
      { width < 600 ? (
        <Stack>
          {!props.noTotal ? (
            <Stack direction={"row"} alignItems={"baseline"}>
              <Text color={"hedge"} fontSize={28} fontWeight={600}
                    fontFamily={"Montserrat"}>{props.prefix} {props.noFixed ? sum : sum.toFixed(2)}</Text>
              <Text color={"hedge"} fontWeight={600} fontFamily={"Montserrat"}>{props.suffix}</Text>
            </Stack>
          ) : (
            <Text/>
          )}
          <Stack direction={"row"} spacing={"20px"}>
            <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                    color={selector === "1W" ? "hedge" : "black"}
                    _focus={{outline: "none"}}
                    onClick={() => setSelector("1W")}
                    border={selector === "1W" ? "2px solid #0047BB" : "none"}>1W</Button>
            <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                    color={selector === "1M" ? "hedge" : "black"}
                    _focus={{outline: "none"}}
                    onClick={() => setSelector("1M")}
                    border={selector === "1M" ? "2px solid #0047BB" : "none"}>1M</Button>
            <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                    color={selector === "All" ? "hedge" : "black"}
                    _focus={{outline: "none"}}
                    onClick={() => setSelector("All")}
                    border={selector === "All" ? "2px solid #0047BB" : "none"}>ALL</Button>
          </Stack>
        </Stack>
      ) : (
        <Stack direction={"row"} justifyContent={"space-between"}>
          {!props.noTotal ? (
            <Stack direction={"row"} alignItems={"baseline"}>
              <Text color={"hedge"} fontSize={28} fontWeight={600}
                    fontFamily={"Montserrat"}>{props.prefix} {props.noFixed ? sum : sum.toFixed(2)}</Text>
              <Text color={"hedge"} fontWeight={600} fontFamily={"Montserrat"}>{props.suffix}</Text>
            </Stack>
          ) : (
            <Text/>
          )}
          <Stack direction={"row"} spacing={"20px"}>
            <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                    color={selector === "1W" ? "hedge" : "black"}
                    _focus={{outline: "none"}}
                    onClick={() => setSelector("1W")}
                    border={selector === "1W" ? "2px solid #0047BB" : "none"}>1W</Button>
            <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                    color={selector === "1M" ? "hedge" : "black"}
                    _focus={{outline: "none"}}
                    onClick={() => setSelector("1M")}
                    border={selector === "1M" ? "2px solid #0047BB" : "none"}>1M</Button>
            <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"}
                    color={selector === "All" ? "hedge" : "black"}
                    _focus={{outline: "none"}}
                    onClick={() => setSelector("All")}
                    border={selector === "All" ? "2px solid #0047BB" : "none"}>ALL</Button>
          </Stack>
        </Stack>
      ) }
      <Line {...config} />
    </Stack>
  )
}

export default LineChart