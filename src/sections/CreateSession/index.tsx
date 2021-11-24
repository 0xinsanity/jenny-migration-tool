import React, { useState, FormEvent } from "react"
import {
  Title,
  Subheader,
  UniversalContainer,
  SubText,
} from "@components/global.styles"
import { ListGroup, ListGroupItem, Form, Modal, ModalBody } from "shards-react"
import { InputWithTitle } from "@components/Input"
import Button, { ButtonsWhite } from "@components/Button"
import styled from "styled-components"
import { useActiveWeb3React, useWeb3Contract } from "@hooks/index"
import { useOnCreateNewSession } from "@hooks/create-sessions"
import { ZERO_ADDRESS, ABC_PRICING_SESSION_ADDRESS } from "@config/constants"
import { openseaGet, shortenAddress } from "@config/utils"
import Link from "gatsby-link"
import ABC_PRICING_SESSION_ABI from "@config/contracts/ABC_PRICING_SESSION_ABI.json"
import { useGetCurrentNetwork } from "@state/application/hooks"
import {
  SplitContainer,
  VerticalSmallGapContainer,
  SquareImageContainer,
  SubText as SubTitle,
} from "../CurrentSession/CurrentSession.styles"

const ListGroupStyled = styled(ListGroup)`
  margin: 45px 0px;

  @media ${({ theme }) => theme.mediaMin.splitCenter} {
    min-width: 450px;
  }
`

const ModalSubtitle = styled(SubTitle)`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: bold;
`

const ModalTitle = styled(Title)`
  font-weight: bold;
  font-size: 1.2rem;
`

const ModalPair = ({ title, value }: { title: string; value: string }) => (
  <div style={{ marginBottom: 10 }}>
    <ModalSubtitle>{title}</ModalSubtitle>
    <ModalTitle>{value}</ModalTitle>
  </div>
)

interface CreateSessionItems {
  nftAddress: string
  tokenId: string
  initAppraisal: string
  votingTime: number
  bounty?: string
  img: string
  name: string
  collection: string
  nonce: number
}

const CreateSession: React.FC = () => {
  const { account } = useActiveWeb3React()
  const [openModal, setOpenModal] = useState(false)
  const [newSesh, setNewSesh] = useState<CreateSessionItems | null>(null)
  const { onCreateNewSession, isPending } = useOnCreateNewSession()
  const getPricingSessionContract = useWeb3Contract(ABC_PRICING_SESSION_ABI)
  const networkSymbol = useGetCurrentNetwork()

  const toggle = () => setOpenModal(!openModal)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const pricingSession = getPricingSessionContract(
      ABC_PRICING_SESSION_ADDRESS(networkSymbol)
    )
    const nftAddress = e.target.nftAddress.value
    const tokenId = e.target.tokenId.value
    const initAppraisal = e.target.initAppraisal.value
    const votingTime = Number(e.target.votingTime.value)
    const bounty =
      e.target.initBounty.value === "" ||
      Number(e.target.initBounty.value) === 0
        ? undefined
        : e.target.initBounty.value

    const meta = await openseaGet(`asset/${nftAddress}/${tokenId}`)

    if (!meta.token_id) {
      alert("The NFT Address and Token ID you have entered is not valid")
      return
    }

    if (votingTime > 24) {
      alert("You must choose a voting time that is 24 hours or below")
      return
    }

    onCreateNewSession(
      nftAddress,
      tokenId,
      initAppraisal,
      Math.round(votingTime * 3600),
      async () => {
        const nonce = await pricingSession.methods
          .nftNonce(nftAddress, tokenId)
          .call()
        setNewSesh({
          nftAddress,
          tokenId,
          initAppraisal,
          bounty,
          votingTime,
          img: meta.image_url,
          name: meta.name,
          collection: meta.collection.name,
          nonce: Number(nonce),
        })
        toggle()
      },
      bounty
    )
  }

  return (
    <UniversalContainer style={{ alignItems: "center" }}>
      <Modal size="lg" open={openModal} toggle={toggle} centered>
        <ModalBody>
          {newSesh === null ? null : (
            <SplitContainer>
              <VerticalSmallGapContainer>
                <SquareImageContainer
                  src={newSesh.img}
                  style={{ marginBottom: 15 }}
                />
                <SubTitle>{newSesh.collection}</SubTitle>
                <Title>
                  {newSesh.name} #{newSesh.tokenId}
                </Title>
              </VerticalSmallGapContainer>
              <VerticalSmallGapContainer
                style={{ justifyContent: "space-between" }}
              >
                <Title
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "15px !important",
                  }}
                >
                  Session Created!
                </Title>
                {newSesh.bounty && (
                  <ModalPair title="Bounty" value={newSesh.bounty} />
                )}
                <ModalPair
                  title="NFT Address"
                  value={shortenAddress(newSesh.nftAddress)}
                />
                <ModalPair title="Token ID" value={newSesh.tokenId} />
                <ModalPair
                  title="Initial Appraisal"
                  value={`${newSesh.initAppraisal} ETH`}
                />
                <ModalPair
                  title="Voting Time"
                  value={`${newSesh.votingTime} hours`}
                />
                <Button
                  as={Link}
                  style={{ width: "100%", textAlign: "center" }}
                  to={`/current-session?address=${newSesh.nftAddress}&tokenId=${newSesh.tokenId}&nonce=${newSesh.nonce}`}
                >
                  Go to session
                </Button>
              </VerticalSmallGapContainer>
            </SplitContainer>
          )}
        </ModalBody>
      </Modal>
      <div>
        <Title style={{ marginBottom: 3 }}>Create a Session</Title>
        <Subheader>Create a Pricing Protocol Session</Subheader>
        <Form onSubmit={handleSubmit}>
          <ListGroupStyled>
            <ListGroupItem>
              <InputWithTitle
                title="Initial Bounty (Optional)"
                id="initBounty"
                placeholder="0"
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="NFT address"
                id="nftAddress"
                placeholder={ZERO_ADDRESS}
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle title="Token ID" id="tokenId" placeholder="10" />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Initial Appraisal (ETH)"
                id="initAppraisal"
                placeholder="0.001"
              />
            </ListGroupItem>
            <ListGroupItem>
              <InputWithTitle
                title="Voting Time (Hours)"
                id="votingTime"
                placeholder="12"
              />
            </ListGroupItem>
          </ListGroupStyled>
          <div
            style={{ display: "flex", flexDirection: "column", gridGap: 10 }}
          >
            <ButtonsWhite
              type="submit"
              style={{ maxWidth: "fit-content" }}
              disabled={!account || isPending}
            >
              {isPending ? "Pending..." : "Start Session"}
            </ButtonsWhite>
            {!account && <SubText>Connect your wallet first</SubText>}
          </div>
        </Form>
      </div>
    </UniversalContainer>
  )
}

export default CreateSession
