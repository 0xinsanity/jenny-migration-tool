// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { AbstractConnector } from "@web3-react/abstract-connector"
import { InjectedConnector } from "@web3-react/injected-connector"
import Web3 from "web3"
import { InjectedConnectorProps } from "./connectors"
import EthIcon from "../../images/ETH.svg"
import AethIcon from "../../images/AETH.svg"

export declare enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MUMBAI = 80001,
}

export type NetworkSymbol = "ETH" | "AETH"

export enum NetworkSymbolEnum {
  NONE = "SOLID_NUTHIN",
  ETH = "ETH",
  ARBITRUM = "AETH",
}

export const NetworkSymbolIcons = {
  [NetworkSymbolEnum.NONE]: AethIcon,
  [NetworkSymbolEnum.ETH]: EthIcon,
  [NetworkSymbolEnum.ARBITRUM]: AethIcon,
}

export const OPENSEA_API_KEY = process.env.GATSBY_OPENSEA_API_KEY || undefined
export const NetworkContextName = "NETWORK"
export const ETH_RPC =
  "https://rinkeby.infura.io/v3/626c57c48b2f4e34bb6e05eca7ea256a"
export const NETWORK_CHAIN_ID = 4
export const IS_PRODUCTION = process.env.GATSBY_IS_PRODUCTION === "true"

export const OLD_JENNY = IS_PRODUCTION
  ? "0xa499648fd0e80fd911972bbeb069e4c20e68bf22"
  : "0x02fcbdb70a3c5b581d255ce1067a55d3d1ce6b4d"
export const MIGRATOR = IS_PRODUCTION
  ? ""
  : "0xd372aE03E8677ccC99308AbD1C3A478D2109A4A5"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export interface NetworkInfo {
  rpc: any
  chainId: number
  symbol: string
  network: string
  logo: string
  blockExplorer: string
}

const NETWORK_ADDRESSES = {
  [NetworkSymbolEnum.ETH]: ETH_RPC,
}

export const web3 = (networkSymbol: NetworkSymbolEnum) =>
  new Web3(NETWORK_ADDRESSES[networkSymbol])

export const web3Eth = new Web3(ETH_RPC)

export const NetworkInfoMap: NetworkInfo[] = [
  {
    rpc: ETH_RPC,
    chainId: NETWORK_CHAIN_ID,
    symbol: "ETH",
    network: IS_PRODUCTION ? "Ethereum Mainnet" : "Rinkeby Test Network",
    logo: "ETH.svg",
    blockExplorer: IS_PRODUCTION
      ? "https://etherscan.io/#/"
      : "https://rinkeby.etherscan.io/#/",
  },
]

export const NetworkSymbolAndId = {
  [NETWORK_CHAIN_ID]: NetworkSymbolEnum.ETH,
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  /* INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  }, */
  METAMASK: {
    connector: new InjectedConnector(InjectedConnectorProps),
    name: "MetaMask",
    iconName: "metamask.png",
    description: "Easy-to-use browser extension.",
    href: null,
    color: "#E8831D",
  },
}
