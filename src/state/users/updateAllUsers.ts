import {atomFamily, selectorFamily} from "recoil";
import {optionsTradingUsersAtom} from "./updateOptionsTradingUsers";
import {futuresTradingUsersAtom} from "./updateFuturesTradingUsers";

export const allUserAtom = atomFamily({
  key: "users-allUser::value",
  default: selectorFamily({
    key: "users-allUser::default",
    get: () => ({get}) => {
      const optionsTxList = get(optionsTradingUsersAtom({}))
      const futuresTxList = get(futuresTradingUsersAtom({}))
      // @ts-ignore
      return new Set<string>([...optionsTxList, ...futuresTxList])
    }
  })
})

