import React, { useEffect, useState } from "react"
import { UniversalContainer } from "@components/global.styles"
import Button from "@components/Button"
import { InputWithTitleAndButton } from "@components/Input"
import styled from "styled-components"
import { useWeb3Contract, useActiveWeb3React } from "@hooks/index"
import { MIGRATOR, OLD_JENNY } from "@config/constants"
import { formatEther } from "ethers/lib/utils"
import { useApproveMigration, useMigrate } from "@hooks/migration"
import jennyLogo from "../../images/jenny-logo-circle.png"
import ERC_20_ABI from "../../config/contracts/ERC20.json"

const Container = styled.div`
  width: 100%;
  max-width: 750px;
  grid-gap: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Home: React.FC = () => {
  const { account } = useActiveWeb3React()
  const [isApproved, setIsApproved] = useState(false)
  const [amount, setAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const { onApproveMigration, isPending: isPendingApprove } =
    useApproveMigration()
  const { onMigrate, isPending: isPendingMigrate } = useMigrate()
  const erc20 = useWeb3Contract(ERC_20_ABI)

  const getInfo = async () => {
    const [balance, allowance] = await Promise.all([
      erc20(OLD_JENNY).methods.balanceOf(account).call(),
      erc20(OLD_JENNY).methods.allowance(account, MIGRATOR).call(),
    ])
    setMaxAmount(formatEther(balance))
    setIsApproved(Number(allowance) > 0)
  }

  useEffect(() => {
    if (account !== undefined && account !== null) {
      getInfo()
    }
  }, [account])

  return (
    <UniversalContainer>
      <Container>
        <img style={{ maxHeight: 100 }} src={jennyLogo} alt="Jenny Logo" />
        <InputWithTitleAndButton
          value={amount}
          placeholder="0.0"
          title="Amount"
          id="inputAmount"
          buttonText="Max"
          onChange={(e) => setAmount(e.target.value)}
          onClick={() => setAmount(maxAmount)}
        />
        <Button
          disabled={amount.length === 0 || isPendingApprove || isPendingMigrate}
          onClick={async () => {
            if (isApproved) {
              await onMigrate(amount, async () => {
                await getInfo()
              })
            } else {
              await onApproveMigration(async () => {
                await getInfo()
              })
            }
          }}
        >
          {isPendingApprove || isPendingMigrate
            ? "Pending..."
            : isApproved
            ? "Migrate"
            : "Approve"}
        </Button>
      </Container>
    </UniversalContainer>
  )
}

export default Home
