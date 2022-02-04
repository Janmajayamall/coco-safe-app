import Web3 from 'web3'
import OracleAbi from './../contracts/abis/Oracle.json'

// contract instances
const web3 = new Web3()
export const oracleContract = (oracleAddress) => new web3.eth.Contract(OracleAbi, oracleAddress)
