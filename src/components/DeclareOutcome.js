import React, { useCallback, useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { Select, Spacer, Flex, Text } from '@chakra-ui/react'
import InputWithTitle from './InputWithTitle'
import { oracleContract } from './../utils'
import { ArrowBackIcon } from '@chakra-ui/icons'

const DeclareOutcome = ({ market, setSafeState }) => {
  const { sdk, safe } = useSafeAppsSDK()

  const [outcome, setOutcome] = useState(2)

  const submitTx = useCallback(async () => {
    try {
      console.log(outcome, ' kj')
      const txData = oracleContract(market.oracle.id).methods.setOutcome(outcome, market.marketIdentifier).encodeABI()
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: market.oracle.id,
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
  }, [safe, sdk, outcome])

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

      {market != undefined ? (
        <Flex flexDirection={'column'}>
          <Text>Declare outcome</Text>
          <Select
            onChange={(e) => {
              console.log(e.target.value, ' hkj')
              setOutcome(e.target.value)
            }}
            value={outcome}
            fontSize={14}
            placeholder="Choose Outcome"
            borderWidth={1}
            borderStyle="solid"
            borderColor="#0B0B0B"
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
            <option value={2}>Undecided</option>
          </Select>

          <Button size="lg" color="primary" onClick={submitTx}>
            Declare Outcome
          </Button>
        </Flex>
      ) : undefined}
    </Flex>
  )
}

export default DeclareOutcome
