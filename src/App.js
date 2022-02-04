import React, { useCallback, useState, FC, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { NumberInput, NumberInputField, Input, Flex, Text, HStack } from '@chakra-ui/react'
import UpdateParameters from './components/UpdateParameters'
import { useQueryOraclesByManager, useQueryMarketsAtStage3ByOracles } from './hooks'
import DeclareOutcome from './components/DeclareOutcome'

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

  // state == 2 helpers
  const [selectedMarket, setSelectedMarket] = useState(null)

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
        _oracles.push(oracle.id.toLowerCase())
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

  const ActionRow = () => {
    return (
      <Flex>
        <Button
          size="md"
          color="secondary"
          onClick={() => {
            setSelectedMarket({
              marketIdentifier: '0x40703F4eb55371520Bb82aE6021990eC1d482323',
              oracle: { id: '0x40703f4eb55371520bb82ae6021990ec1d482323 ' },
            })
            setSafeState(2)
          }}
        >
          Declare Outcome
        </Button>
        <Text
          onClick={() => {
            window.open(
              'https://www.cocoverse.club/post/0x3ae023614e51415572486ddd21c691a264e912ca2589814440ba2189de0a5ced',
              '_blank',
            )
          }}
          _hover={{ cursor: 'pointer', textDecoration: 'underline' }}
        >
          View Post
        </Text>
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
          <Flex
            direction={'column'}
            sx={{
              '&::-webkit-scrollbar': {
                width: '16px',
                borderRadius: '8px',
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: `rgba(0, 0, 0, 0.05)`,
              },
            }}
          >
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
        </>
      ) : undefined}
      {safeState === 1 ? <UpdateParameters safeOracles={safeOracles} setSafeState={setSafeState} /> : undefined}
      {safeState === 2 ? <DeclareOutcome setSafeState={setSafeState} market={selectedMarket} /> : undefined}
    </Container>
  )
}

/**
 * In the second half, show a list of posts for which outcomes have to be delcared.
 */
export default SafeApp
