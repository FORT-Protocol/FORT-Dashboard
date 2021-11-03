import {Button, Spacer, Stack, Text} from "@chakra-ui/react";
import {FC, useEffect, useState} from "react";
import {Line} from '@ant-design/charts';
import useWindowDimensions from "../../hooks/useWindowDimensions";

interface LineChartProps {
  title?: string,
  prefix?: string
  suffix?: string
  data?: any
}

const LineChart: FC<LineChartProps> = props => {
  const [selector, setSelector] = useState("1M")
  const {width} = useWindowDimensions()
  const [data, setData] = useState(props.data)
  const today = new Date().getTime()
  const [sum, setSum] = useState(0)

  useEffect(()=>{
    if (selector === "1W"){
      const tempData = props.data.filter((data: {day: string, value: number, category: string})=> {
        const day = new Date(data.day).getTime()
        return today - day <= 7 * 84600000
      })
      setData(tempData)
      let s = 0
      tempData.forEach((d: {day: string, value: number, category: string})=> {
        if (d.category === "Total"){
          s += d.value
        }
      })
      setSum(s)
    }
    if (selector === "1M"){
      const tempData = props.data.filter((data: {day: string, value: number, category: string})=> {
        const day = new Date(data.day).getTime()
        return today - day <= 30 * 84600000
      })
      setData(tempData)
      let s = 0
      tempData.forEach((d: {day: string, value: number, category: string})=> {
        if (d.category === "Total"){
          s += d.value
        }
      })
      setSum(s)
    }
    if (selector === "All"){
      setData(props.data)
      let s = 0
      props.data.forEach((d: {day: string, value: number, category: string})=> {
        if (d.category === "Total"){
          s += d.value
        }
      })
      setSum(s)
    }
  }, [selector, setSelector, data, setData])

  const config = {
    data: data,
    xField: 'day',
    yField: 'value',
    seriesField: 'category',
    color: ['#0047BB', "#4FB08B", "#D7772C", "#F6E272", "#BEDE9F", "#5BCBEA"],
  };

  return (
    <Stack borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]} spacing={"8px"}>
      {props.title && (
        <Text fontSize={width < 1000 ? "12px" : "18px"} fontWeight={600} color={"#878787"} fontFamily={"Montserrat"}>{props.title}</Text>
      )}
      <Stack direction={"row"}>
        <Stack direction={"row"} alignItems={"baseline"}>
          <Text color={"hedge"} fontSize={"28px"} fontWeight={600}
                fontFamily={"Montserrat"}>{props.prefix} {sum.toFixed(2) || "-"}</Text>
          <Text color={"hedge"} fontWeight={600} fontFamily={"Montserrat"}>{props.suffix}</Text>
        </Stack>
        <Spacer/>
        <Stack direction={"row"} spacing={"20px"}>
          <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"} color={selector === "1W" ? "hedge" : "black"}
                  onClick={() => setSelector("1W")} border={selector === "1W" ? "2px solid #0047BB" : "none"}>1W</Button>
          <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"} color={selector === "1M" ? "hedge" : "black"}
                  onClick={() => setSelector("1M")} border={selector === "1M" ? "2px solid #0047BB" : "none"}>1M</Button>
          <Button variant={"solid"} borderRadius={"20px"} size={"sm"} fontFamily={"Montserrat"} color={selector === "All" ? "hedge" : "black"}
                  onClick={() => setSelector("All")} border={selector === "All" ? "2px solid #0047BB" : "none"}>ALL</Button>
        </Stack>
      </Stack>
      <Line {...config} />
    </Stack>
  )
}

export default LineChart