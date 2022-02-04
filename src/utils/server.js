import axios from 'axios'

const baseInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://backend.cocoverse.club/' : 'http://65.108.59.231:8080',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
})

export async function findModeratorsByIdArr(ids) {
  const filter = {
    oracleAddress: {
      $in: ids,
    },
  }

  try {
    const { data } = await baseInstance.request({
      url: '/moderator/find',
      method: 'POST',
      data: {
        filter,
      },
    })

    return data.response
  } catch (e) {}
}
