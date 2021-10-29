import { atom } from "recoil"

export const futuresTxlistAtom = atom({
  key: "futuresTxlist",
  default: {},
})

export const 永续合约区块高度Atom = atom({
  key: "永续合约区块高度",
  default: 0,
})

export const 永续合约累计交易额Atom = atom({
  key: "永续合约累计交易额",
  default: 0,
})

export const 永续合约累计交易量Atom = atom({
  key: "永续合约累计交易量",
  default: 0,
})

export const 永续合约当前看涨期权持仓量Atom = atom({
  key: "永续合约当前看涨期权持仓量",
  default: 0,
})

export const 永续合约当前看跌期权持仓量Atom = atom({
  key: "永续合约当前看跌期权持仓量",
  default: 0,
})

export const 永续合约累计交易笔数Atom = atom({
  key: "永续合约累计交易笔数",
  default: 0,
})

export const 永续合约累计清算额Atom = atom({
  key: "永续合约累计清算额",
  default: 0,
})
