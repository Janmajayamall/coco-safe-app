import React, { useCallback, useState, FC } from 'react'
import styled from 'styled-components'
import { Button, Title } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { NumberInput, NumberInputField, Input, Flex, Text, HStack } from '@chakra-ui/react'

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

const InputWithTitle = (props) => {
  const { valid, expText } = validationHelper()

  function validationHelper() {
    let res = {
      valid: false,
      expText: 'Invalid input type',
    }
    res = props.validationFn(props.value)
    return res
  }

  return (
    <Flex
      style={{
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Text
        style={{
          width: '100%',
          marginTop: 5,
        }}
      >
        {props.title}
      </Text>
      {props.inputType === 0 ? (
        <HStack>
          <Input
            {...props.inputOptions}
            style={{
              width: '100%',
              marginTop: 5,
            }}
            placeholder={props.title}
            onChange={(e) => {
              props.setValue(e.target.value)
            }}
            value={props.value}
            fontSize={14}
          />
          {props.symbol != undefined ? <Text fontSize={14}>{`${props.symbol}`}</Text> : undefined}
        </HStack>
      ) : undefined}
      {props.inputType === 1 ? (
        <HStack>
          <NumberInput
            {...props.inputOptions}
            style={{
              width: '100%',
              marginTop: 5,
            }}
            onChange={(val) => {
              props.setValue(val)
            }}
            value={props.value}
            fontSize={14}
          >
            <NumberInputField />
          </NumberInput>
          {props.symbol != '' ? <Text fontSize={14}>{`${props.symbol}`}</Text> : undefined}
        </HStack>
      ) : undefined}
      {valid === false ? (
        <Text
          style={{
            fontSize: 12,
            color: '#EB5757',
          }}
        >
          {expText}
        </Text>
      ) : undefined}
    </Flex>
  )
}

const SafeApp = () => {
  const { sdk, safe } = useSafeAppsSDK()
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
      <Title size="md">Safe: {safe.safeAddress}</Title>

      <Button size="lg" color="primary" onClick={submitTx}>
        Click to send a test
      </Button>

      <InputWithTitle
        title="yolo"
        inputType={0}
        value={inputString}
        setValue={setInputString}
        validationFn={() => {
          return { valid: true, expStr: '2' }
        }}
        inputOptions={{}}
        symbol="hr"
      />
    </Container>
  )
}

export default SafeApp
