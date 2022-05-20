import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Row } from "shards-react"
import { useActiveWeb3React, usePrevious } from "@hooks/index"
import { shortenAddress } from "@config/utils"
import { useToggleWalletModal } from "@state/application/hooks"
import { theme } from "@config/theme"
import loadable from "@loadable/component"
import Button from "../Button"

const NetworkSelectorButton = loadable(() => import("./NetworkSelectorButton"))

const RowStyled = styled(Row)`
  padding: 0px;
  transition: 0.3s;
  margin: 0;
`

const LinkList = styled.div<{ menuOpen: boolean }>`
  display: ${({ menuOpen }) => (menuOpen ? "flex" : "none")};
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 100%;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: ${theme.navbar.height};
  background-color: ${theme.colors.bg1};
  z-index: 1;

  @media ${theme.mediaMin.splitCenter} {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    grid-gap: 40px;
    flex-direction: row;
    position: unset;
  }
`

const ListSectionSelector = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${theme.mediaMin.splitCenter} {
    flex-direction: row;
    grid-gap: 0px;
  }

  @media ${theme.mediaMin.tablet} {
    grid-gap: 10px;
  }
`

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0px;
  align-items: center;
  width: 100%;
  background-color: ${theme.colors.bg1};
  height: ${theme.navbar.height};

  @media ${theme.mediaMin.splitCenter} {
    height: unset;
    grid-gap: 30px;
    padding: 45px 80px;
  }
`

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${theme.colors.text1};
  width: 300px;
`

const Navbar = ({ location }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useToggleWalletModal()
  const prevLocation = usePrevious(location)

  useEffect(() => {
    if (location !== prevLocation) {
      setMenuOpen(false)
    }
  }, [location, prevLocation])

  return (
    <RowStyled>
      <NavbarContainer>
        <Logo href="/">uJenny Migration Tool</Logo>
        <LinkList menuOpen={menuOpen}>
          <ListSectionSelector>
            <NetworkSelectorButton />
            <Button onClick={() => toggleWalletModal()}>
              {account ? shortenAddress(account) : "Connect Wallet"}
            </Button>
          </ListSectionSelector>
        </LinkList>
      </NavbarContainer>
    </RowStyled>
  )
}

export default Navbar
