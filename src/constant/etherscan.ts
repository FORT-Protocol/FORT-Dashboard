import {futuresContractAddress} from "./contract";

export const etherscanEndpoint = {
  mainnet: "https://api.etherscan.com/",
  rinkeby: "https://api-rinkeby.etherscan.io/"
}

export const env = process.env.REACT_APP_ENV || "mainnet"
export const api = ( env === "mainnet" ) ? etherscanEndpoint["mainnet"] : etherscanEndpoint["rinkeby"]