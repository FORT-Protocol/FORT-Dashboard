import { atom } from "recoil"

export const optionsTxlistAtom = atom({
  key: "optionsTxlistAtom",
  default: {},
})

export const 期权区块高度Atom = atom({
  key: "期权区块数",
  default: 0,
})

export const 期权累计交易额Atom = atom({
  key: "期权累计交易额",
  default: 0,
})

export const 期权累计交易量Atom = atom({
  key: "期权累计交易量",
  default: 0,
})

export const 期权当前看涨期权持仓量Atom = atom({
  key: "期权当前看涨期权持仓量",
  default: 0,
})

export const 期权当前看跌期权持仓量Atom = atom({
  key: "期权当前看跌期权持仓量",
  default: 0,
})

export const 期权累计交易笔数Atom = atom({
  key: "期权累计交易笔数",
  default: 0,
})

export const 期权多空分布Atom = atom({
  key: "期权多空分布",
  default: {},
})

export const 期权行权时间分布Atom = atom({
  key: "期权行权时间分布",
  default: 0,
})
