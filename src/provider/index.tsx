const Web3 = require("web3")
require("dotenv").config()

const env = process.env.REACT_APP_ENV || "mainnet"

const host = (env === "mainnet") ? "https://mainnet.infura.io/" : "https://rinkeby.infura.io/"

export const web3 = new Web3(
  new Web3.providers.HttpProvider( host + "v3/2a2c48954c8147de9e5d2aeb64fcf747")
)
