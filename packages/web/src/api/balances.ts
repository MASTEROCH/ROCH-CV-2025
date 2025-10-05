import apiClient from './client'

export interface Balance {
  id: string
  userId: string
  coins: number
  tickets: number
  tonGame: number
  totalSpins: number
  createdAt: string
  updatedAt: string
}

export const balancesApi = {
  getBalance: (): Promise<Balance> =>
    apiClient.get('/balances').then(res => res.data),
}