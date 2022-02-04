import React, { useCallback, useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Select, Spacer, Flex } from '@chakra-ui/react'
import InputWithTitle from './InputWithTitle'
import {
  validateFee,
  validateEscalationLimit,
  validateBufferHours,
  validateExpireHours,
  validateResolutionHours,
  convertHoursToBlocks,
  oracleContract,
  findModeratorsByIdArr,
} from '../utils'
import { ArrowBackIcon } from '@chakra-ui/icons'

const UpdateParameters = ({ safeOracles, setSafeState }) => {
  const { sdk, safe } = useSafeAppsSDK()

  const [groups, setGroups] = useState(['0x40703F4eb55371520Bb82aE6021990eC1d482323'])
  /**
   * Oracle config state
   */
  const [fee, setFee] = useState('0.05')
  const [escalationLimit, setEscalationLimit] = useState(1)
  const [expireHours, setExpireHours] = useState(1)
  const [bufferHours, setBufferHours] = useState(1)
  const [resolutionHours, setResolutionHours] = useState(1)

  // get groups governed by safe
  useEffect(async () => {
    if (safeOracles.length != 0) {
      let res = await findModeratorsByIdArr(safeOracles)
      if (res == undefined) {
        return
      }
      setGroups(res.moderators)
    }
  }, [safeOracles])

  const submitTx = useCallback(async () => {
    try {
      const feeNum = Number(fee) * 1000
      const feeDenom = 1000
      const txData = oracleContract(groups[0])
        .methods.updateMarketConfig(
          true,
          feeNum,
          feeDenom,
          escalationLimit,
          convertHoursToBlocks(expireHours),
          convertHoursToBlocks(bufferHours),
          convertHoursToBlocks(resolutionHours),
        )
        .encodeABI()
      console.log(txData, ' encoded function call')
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: groups[0],
            value: '0',
            data: txData,
          },
        ],
      })
      console.log({ safeTxHash }, ' safe tx hash')
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk, groups, fee, escalationLimit, expireHours, bufferHours, resolutionHours])

  return (
    <Flex flexDirection={'column'}>
      <Flex alignItems="center">
        <ArrowBackIcon
          onClick={() => {
            setSafeState(0)
          }}
          // marginRight={5}
          w={20}
          h={20}
          marginBottom={10}
          color="#0B0B0B"
          _hover={{
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        />
        <Spacer />
      </Flex>

      <Flex flexDirection={'column'}>
        <Select
          onChange={(e) => {
            //   setFilter(e.target.value)
          }}
          fontSize={14}
          placeholder="No Filter"
          borderWidth={1}
          borderStyle="solid"
          borderColor="#0B0B0B"
        >
          <option value={1}>Live</option>
          <option value={2}>Challenge</option>
          <option value={3}>Resolution</option>
          <option value={4}>Final</option>
          <option value={5}>Pending Redeem</option>
          <option value={6}>Created by you</option>
        </Select>
        {InputWithTitle(
          'Fee',
          1,
          fee,
          setFee,
          validateFee,
          {
            defaultValue: 0.05,
            precision: 3,
          },
          '',
        )}
        {InputWithTitle(
          'Max. no. of Challenge rounds',
          1,
          escalationLimit,
          setEscalationLimit,
          validateEscalationLimit,
          {
            defaultValue: 1,
            precision: 0,
          },
          '',
        )}
        {InputWithTitle(
          'Trading Period (in hrs)',
          1,
          expireHours,
          setExpireHours,
          validateExpireHours,
          {
            defaultValue: 1,
            precision: 0,
          },
          'Hr',
        )}
        {InputWithTitle(
          'Challenge period (in hrs)',
          1,
          bufferHours,
          setBufferHours,
          validateBufferHours,
          {
            defaultValue: 1,
            precision: 0,
          },
          'Hr',
        )}
        {InputWithTitle(
          'Resolution period (in hrs)',
          1,
          resolutionHours,
          setResolutionHours,
          validateResolutionHours,
          {
            defaultValue: 1,
            precision: 0,
          },
          'Hr',
        )}
        <Button size="lg" color="primary" onClick={submitTx}>
          Send tx
        </Button>
      </Flex>
    </Flex>
  )
}

export default UpdateParameters
