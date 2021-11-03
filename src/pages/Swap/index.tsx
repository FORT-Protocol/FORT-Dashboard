import {SimpleGrid, Stack} from "@chakra-ui/react";
import Norm from "../../components/Norm";
import LineChart from "../../components/LineChart";
import {cumulativeNumberOfTransactionAtom} from "../../state/swap/updateCumulativeNumberOfTransaction";
import {totalTransactionVolumeListAtom} from "../../state/swap/updateTotalTransactionVolumeList";
import {totalTransactionVolumeAtom} from "../../state/swap/updateTotalTransactionVolume";
import {useRecoilValue} from "recoil";
import useNumberOfNEST from "../../hooks/useNumberOfNEST";
import useNumberOfDCU from "../../hooks/useNumberOfDCU";

const Swap = () => {
  const cumulativeNumberOfTransaction = useRecoilValue(cumulativeNumberOfTransactionAtom({}))
  const numberOfNEST = useNumberOfNEST()
  const numberOfDCU = useNumberOfDCU()
  const totalTransactionVolumeList = useRecoilValue(totalTransactionVolumeListAtom({}))
  const totalTransactionVolume = useRecoilValue(totalTransactionVolumeAtom({}))

  return (
    <Stack spacing={"44px"} p={["22px", "22px", "44px"]}>
      <SimpleGrid columns={[1, 2, 2, 2, 4]} spacing="44px">
        <Norm value={numberOfNEST.toFixed(2)} desc={"Number of NEST"} color={"#C7A072"}/>
        <Norm value={numberOfDCU.toFixed(2)} desc={"Number of DCU"} color={"#E57200"}/>
        <Norm value={cumulativeNumberOfTransaction} desc={"Cumulative Number of Transaction (DCU)"} color={"#00B388"}/>
        <Norm value={totalTransactionVolume.toFixed(2)} desc={"Total Transaction Volume (DCU)"} color={"#F23A12"}/>
      </SimpleGrid>
      <SimpleGrid columns={1} spacing="44px">
        <LineChart title={"Total Transaction Volume"} total={totalTransactionVolume} suffix={"DCU"} data={totalTransactionVolumeList}/>
      </SimpleGrid>
    </Stack>
  )
}

export default Swap