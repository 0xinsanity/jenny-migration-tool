/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect } from "react"
import Navbar from "@components/Navbar"
import styled from "styled-components"
import { Container, Row } from "shards-react"
import Web3Modal from "@components/Web3Modal"
import Web3 from "web3"
import { useActiveWeb3React } from "@hooks/index"
import { NetworkSymbolEnum, NetworkSymbolAndId } from "@config/constants"
import GeneralizedContractError from "@components/GeneralizedContractError"
import NotConnectedAlert from "@components/NotConnectedAlert"
import { theme } from "@config/theme"
import { useSelectNetwork } from "@state/application/hooks"
import { GlobalStyles } from "./styles"

const StyledContainer = styled(Container)`
  width: 100%;
  max-width: 1600px;
`

const RowContainer = styled(Row)`
  flex-wrap: inherit;
  padding: 15px;
  justify-content: center;

  @media ${theme.mediaMin.splitCenter} {
    padding: 65px 80px;
  }
`

const GlobalLayout: React.FC = (props: any) => {
  const { children, location } = props
  const { chainId, account } = useActiveWeb3React()
  const selectNetwork = useSelectNetwork()

  useEffect(() => {
    const checkConnection = async () => {
      // Check if browser is running Metamask
      let web3: any
      // @ts-ignore
      if (window.web3) {
        // @ts-ignore
        web3 = new Web3(window.web3.currentProvider)
        // @ts-ignore
      } else if (window.ethereum) {
        // @ts-ignore
        web3 = new Web3(window.ethereum)
      }

      // Check if User is already connected by retrieving the accounts
      try {
        await web3?.eth.getAccounts()
      } catch (e) {
        console.log(e)
      }
    }
    checkConnection()
  }, [])

  useEffect(() => {
    const network = NetworkSymbolAndId[chainId]
    if (!account) {
      selectNetwork(NetworkSymbolEnum.NONE)
    } else if (network) {
      selectNetwork(network)
    }
  }, [account, chainId, selectNetwork])

  return (
    <>
      <GlobalStyles />
      <StyledContainer>
        <Navbar location={location} />
        <GeneralizedContractError />
        <NotConnectedAlert />
        <RowContainer>
          <Web3Modal />
          {children}
        </RowContainer>
      </StyledContainer>
    </>
  )
}

export default GlobalLayout
