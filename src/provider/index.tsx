const Web3 = require("web3")
require("dotenv").config()

export const web3 = new Web3(
  new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/2a2c48954c8147de9e5d2aeb64fcf747")
)
