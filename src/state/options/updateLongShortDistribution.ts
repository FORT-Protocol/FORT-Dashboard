import {atomFamily, selectorFamily} from "recoil";
import {currentCallOptionsDCUAtom, currentShortOptionsDCUAtom} from "./updateOpenInterest";

export const longShortDistributionAtom = atomFamily({
  key: "options-longShortDistribution::value",
  default: selectorFamily({
    key: "options-longShortDistribution::default",
    get: () => ({get}) => {
      const long = get(currentCallOptionsDCUAtom({}))
      const short = get(currentShortOptionsDCUAtom({}))
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