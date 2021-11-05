import {atomFamily, selectorFamily} from "recoil";
import {currentOpenLongPositionsAtom} from "./updateCurrentOpenLongPositionsDCU";
import {currentOpenShortPositionsAtom} from "./updateCurrentOpenShortPositionDCU";

export const longShortDistributionAtom = atomFamily({
  key: "futures-longShortDistribution::value",
  default: selectorFamily({
    key: "futures-longShortDistribution::default",
    get: () => ({get}) => {
      const long = get(currentOpenLongPositionsAtom({}))
      const short = get(currentOpenShortPositionsAtom({}))
      return [
        {
          "type": "Long",
          "value": long
        },
        {
          "type": "Short",
          "value": short
        }
      ]
    }
  })
})
