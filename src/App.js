import React, { useCallback, useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { NumberInput, NumberInputField, Input, Flex, Text, HStack } from '@chakra-ui/react'
import UpdateParameters from './components/UpdateParameters'
import { useQueryOraclesByManager, useQueryMarketsAtStage3ByOracles } from './hooks'

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

// const Link = styled.a`
//   margin-top: 8px;
// `

// interface ValidationFnReturn {
//   valid: boolean
//   expText: string
// }
// type ValidationFn = (...args: any[]) => ValidationFnReturn
// interface InputWithTitleProps {
//   title: string
//   inputType: number
//   value: string
//   setValue: ValidationFn
//   validationFn: ValidationFn
//   inputOptions: InputProps
//   symbol: string
// }

/**
 * States
 * 0. Main page
 * 1. Update parameters
 *
 */

const SafeApp = () => {
  const { sdk, safe } = useSafeAppsSDK()

  const [safeOracles, setSafeOracles] = useState([]) // oracles managed by safe (i.e. manager == safeAddress)
  const [safeState, setSafeState] = useState(0)

  const { result: oraclesByManagerResult, reexecuteQuery: rQoraclesByManager } = useQueryOraclesByManager(
    safe.safeAddress.toLowerCase(),
    false,
  )
  const { result: marketsAtStage3, reexecuteQuery: rQMarketsAtStage3 } = useQueryMarketsAtStage3ByOracles(
    safeOracles,
    true,
  )

  // reexecutes query for oracles managed by the safe (i.e safe is Manager)
  useEffect(() => {
    if (safe && safe.safeAddress) {
      rQoraclesByManager()
    }
  }, [safe])

  // update safeOracle list whenever oraclsByManagerResult updates, so that rQMarketsAtStage3 can be triggered
  useEffect(() => {
    if (oraclesByManagerResult.data && oraclesByManagerResult.data.oracles) {
      let _oracles = []
      oraclesByManagerResult.data.oracles.forEach((oracle) => {
        _oracles.push(oracle.id)
      })
      setSafeOracles(_oracles)
    }
  }, [oraclesByManagerResult])

  // reexcutes query for query markets at stage 3 by oracles (i.e. get all markets at stgage 3 manager by the safe)
  useEffect(() => {
    if (safeOracles.length != 0) {
      rQMarketsAtStage3()
    }
  }, [safeOracles])

  //

  const submitTx = useCallback(async () => {
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: safe.safeAddress,
            value: '0',
            data: '0x',
          },
        ],
      })
      console.log({ safeTxHash })
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
      console.log({ safeTx })
    } catch (e) {
      console.error(e)
    }
  }, [safe, sdk])

  const ActionRow = () => {
    return (
      <Flex>
        <Text>View Post</Text>
      </Flex>
    )
  }

  return (
    <Container>
      {safeState === 0 ? (
        <>
          <Button
            size="lg"
            color="primary"
            onClick={() => {
              setSafeState(1)
            }}
          >
            Update parameter
          </Button>

          <Title size="md">Posts that need action</Title>
          <Flex direction={'column'}>
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
            <ActionRow />
          </Flex>
          <Button size="lg" color="primary" onClick={submitTx}>
            Click to send a test
          </Button>
        </>
      ) : undefined}
      {safeState === 1 ? <UpdateParameters /> : undefined}
    </Container>
  )
}

/**
 * In the second half, show a list of posts for which outcomes have to be delcared.
 */
export default SafeApp
