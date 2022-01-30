import React, { useCallback, useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Select } from '@chakra-ui/react'
import InputWithTitle from './InputWithTitle'
import {
  validateFee,
  validateEscalationLimit,
  validateBufferHours,
  validateExpireHours,
  validateResolutionHours,
  convertHoursToBlocks,
} from './../utils'
import Web3 from 'web3'
import OracleAbi from './../contracts/abis/Oracle.json'

const web3 = new Web3()
var oracleContractInstance = new web3.eth.Contract(OracleAbi, '0x40703F4eb55371520Bb82aE6021990eC1d482323')

const UpdateParameters = () => {
  const { sdk, safe } = useSafeAppsSDK()

  const [groups, setGroups] = useState([])
  /**
   * Oracle config state
   */
  const [fee, setFee] = useState('0.05')
  const [escalationLimit, setEscalationLimit] = useState(1)
  const [expireHours, setExpireHours] = useState(1)
  const [bufferHours, setBufferHours] = useState(1)
  const [resolutionHours, setResolutionHours] = useState(1)

  // get groups governed by safe
  useEffect(() => {
    // TODO groups
    const _groups = []
    setGroups(_groups)
  }, [])

  const submitTx = useCallback(async () => {
    try {
      console.log(' jm')
      const feeNum = Number(fee) * 1000
      const feeDenom = 1000
      console.log(
        true,
        feeNum,
        feeDenom,
        escalationLimit,
        convertHoursToBlocks(expireHours),
        convertHoursToBlocks(bufferHours),
        convertHoursToBlocks(resolutionHours),
      )
      const txData = oracleContractInstance.methods
        .updateMarketConfig(
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
            to: '0x40703F4eb55371520Bb82aE6021990eC1d482323',
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
  }, [safe, sdk])

  return (
    <>
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
    </>
  )
}

export default UpdateParameters
