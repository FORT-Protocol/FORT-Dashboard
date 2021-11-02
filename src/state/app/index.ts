import { atom } from "recoil"

export const blockNumberAtom = atom({
  key: "blockNumber",
  default: 0,
})

export interface Block {
  blockNumber: string,
  "timeStamp": string,
  "hash": string,
  "nonce": string,
  "blockHash": string,
  "transactionIndex": string,
  "from": string,
  "to": string,
  "value": string,
  "gas": string,
  "gasPrice": string,
  "isError": string,
  "txreceipt_status": string,
  "input": string,
  "contractAddress": string,
  "cumulativeGasUsed": string,
  "gasUsed": string,
  "confirmations": string
}