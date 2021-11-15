import {atomFamily, selectorFamily} from "recoil";
import {optionsTradingUsersAtom} from "./updateOptionsTradingUsers";
import {futuresTradingUsersAtom} from "./updateFuturesTradingUsers";
import {futuresRinkebyTradingUsersAtom} from "./updateRinkebyFuturesTradingUsers";
import {optionsRinkebyTradingUsersAtom} from "./updateRinkebyOptionsTradingUsers";

export const allUserAtom = atomFamily({
  key: "users-allUser::value",
  default: selectorFamily({
    key: "users-allUser::default",
    get: () => ({get}) => {
      const futuresUserList = get(futuresTradingUsersAtom({}))
      const optionsUserList = get(optionsTradingUsersAtom({}))
      const futuresRinkebyUsersList = get(futuresRinkebyTradingUsersAtom({}))
      const optionsRinkebyUsersList = get(optionsRinkebyTradingUsersAtom({}))
      // @ts-ignore
      return new Set<string>([...optionsUserList, ...futuresUserList, ...futuresRinkebyUsersList, ...optionsRinkebyUsersList])
    }
  })
})

