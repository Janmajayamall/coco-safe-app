import { useQuery } from 'urql'

const QueryMarketsAtStage3ByOracles = `
	query ($oracles: [Bytes!]!) {
		markets(where: {oracle_in: $oracles, stage: 3}) {
			id
			creator
			eventIdentifier
			marketIdentifier
			outcomeReserve0
			outcomeReserve1
			probability0
			probability1
			stakingReserve0
			stakingReserve1
			tokenC
			feeNumerator
			feeDenominator
			fee
			expireAtBlock
			donBufferEndsAtBlock
			resolutionEndsAtBlock
			donBufferBlocks
			resolutionBufferBlocks
			donEscalationCount
			donEscalationLimit
			outcome
			stage
			staker0
			staker1
			lastAmountStaked
			lastOutcomeStaked
			timestamp
			oracle{
     			id
    		}
			oToken0Id
			oToken1Id
			sToken0Id
			sToken1Id
			tradeVolume
			stakeVolume
			totalVolume
		}
	}
`

const QueryOraclesByManager = `
  query ($manager: Bytes!) {
	oracles(where:{manager: $manager}){
		id
		delegate
		manager
		collateralToken
		isActive
		feeNumerator
		feeDenominator
		donEscalationLimit
		expireBufferBlocks
		donBufferBlocks
		resolutionBufferBlocks
		factory
	}
  }
`

export function useQueryMarketsAtStage3ByOracles(oracles, pause = false) {
  const [result, reexecuteQuery] = useQuery({
    query: QueryMarketsAtStage3ByOracles,
    variables: { oracles },
    pause,
  })
  return { result, reexecuteQuery }
}

export function useQueryOraclesByManager(manager, pause = false) {
  const [result, reexecuteQuery] = useQuery({
    query: QueryOraclesByManager,
    variables: { manager },
    pause,
  })
  return { result, reexecuteQuery }
}
