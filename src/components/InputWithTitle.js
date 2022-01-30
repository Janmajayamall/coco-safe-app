import React, { useCallback, useState, FC } from 'react'
import { NumberInput, NumberInputField, Input, Flex, Text, HStack } from '@chakra-ui/react'

const InputWithTitle = (title, inputType, value, setValue, validationFn, inputOptions = {}, symbol = undefined) => {
  const { valid, expText } = validationHelper()

  function validationHelper() {
    let res = {
      valid: false,
      expText: 'Invalid input type',
    }
    res = validationFn(value)
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
        {title}
      </Text>
      {inputType === 0 ? (
        <HStack>
          <Input
            {...inputOptions}
            style={{
              width: '100%',
              marginTop: 5,
            }}
            placeholder={title}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            value={value}
            fontSize={14}
          />
          {symbol != undefined ? <Text fontSize={14}>{`${symbol}`}</Text> : undefined}
        </HStack>
      ) : undefined}
      {inputType === 1 ? (
        <HStack>
          <NumberInput
            {...inputOptions}
            style={{
              width: '100%',
              marginTop: 5,
            }}
            onChange={(val) => {
              console.log(val, ' mmk')
              setValue(val)
            }}
            value={value}
            fontSize={14}
          >
            <NumberInputField />
          </NumberInput>
          {symbol != '' ? <Text fontSize={14}>{`${symbol}`}</Text> : undefined}
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

export default InputWithTitle
