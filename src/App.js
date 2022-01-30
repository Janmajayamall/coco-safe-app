import React, { useCallback, useState, FC } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { NumberInput, NumberInputField, Input, Flex, Text, HStack } from '@chakra-ui/react'
import UpdateParameters from './components/UpdateParameters'

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
  const [safeState, setSafeState] = useState(0)
  const [inputString, setInputString] = useState('')

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

          <Title size="md">Safe: {safe.safeAddress}</Title>

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
