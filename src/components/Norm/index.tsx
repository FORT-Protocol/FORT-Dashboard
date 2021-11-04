import {Stack, Text} from "@chakra-ui/react";
import {FC} from "react";

interface NormProps {
  value?: number | string,
  desc?: string,
  color?: string,
}

const Norm: FC<NormProps> = props => {
  return (
    <Stack height="154px" borderRadius={"20px"} boxShadow={"0 0 10px #E5E5E5"} p={["22px", "22px", "44px"]}
           alignItems={"center"} justifyContent={"center"}>
      <Text fontWeight={"bold"} fontSize={32} color={props.color} overflow={"hidden"} fontFamily={"Hepta Slab"}>{props.value}</Text>
      <Text fontWeight={500} fontSize={12} color={"#878787"} textAlign={"center"} height={"15px"} fontFamily={"Montserrat"}>{props.desc}</Text>
    </Stack>
  )
}

export default Norm