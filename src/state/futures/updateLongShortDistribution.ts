import {atomFamily, selectorFamily} from "recoil";
import {curOpenLongPositionsAtom} from "./updateCurrentOpenLongPositionsDCU";
import {curOpenShortPositionsAtom} from "./updateCurrentOpenShortPositionDCU";

export const longShortDistributionAtom = atomFamily({
  key: "futures-longShortDistribution::value",
  default: selectorFamily({
    key: "futures-longShortDistribution::default",
    get: () => ({get}) => {
      const long = get(curOpenLongPositionsAtom({}))
      const short = get(curOpenShortPositionsAtom({}))
      return [
        {
          "type": "Long",
          "value": long
        },
        {
          "type": "Short",
          "value": short
        },
      ]
    }
  })
})