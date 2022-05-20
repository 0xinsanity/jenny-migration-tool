import { useCallback } from "react"
import { getContract } from "@config/utils"
import { useActiveWeb3React, useGeneralizedContractCall } from "@hooks/index"
import { parseEther } from "ethers/lib/utils"
import { MIGRATOR, OLD_JENNY } from "@config/constants"
import { MaxUint256 } from "@ethersproject/constants"
import ERC20_ABI from "../config/contracts/ERC20.json"
import MIGRATOR_ABI from "../config/contracts/Migrator.json"

export const useApproveMigration = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()

  const onApproveMigration = useCallback(
    async (cb: () => void) => {
      const erc20Contract = getContract(OLD_JENNY, ERC20_ABI, library, account)
      const method = erc20Contract.approve
      const estimate = erc20Contract.estimateGas.approve
      const args = [MIGRATOR, MaxUint256]
      const value = null
      const txnCb = async (response: any) => {
        await response.wait()
        cb()
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        cb: txnCb,
      })
    },
    [library, account, generalizedContractCall]
  )
  return {
    onApproveMigration,
    isPending,
  }
}

export const useMigrate = () => {
  const { account, library } = useActiveWeb3React()
  const { generalizedContractCall, isPending } = useGeneralizedContractCall()

  const onMigrate = useCallback(
    async (amount: string, cb: () => void) => {
      const migrateContract = getContract(
        MIGRATOR,
        MIGRATOR_ABI,
        library,
        account
      )
      const method = migrateContract.migrate
      const estimate = migrateContract.estimateGas.migrate
      const args = [parseEther(amount)]
      const value = null
      const txnCb = async (response: any) => {
        await response.wait()
        cb()
      }
      await generalizedContractCall({
        method,
        estimate,
        args,
        value,
        cb: txnCb,
      })
    },
    [library, account, generalizedContractCall]
  )
  return {
    onMigrate,
    isPending,
  }
}
