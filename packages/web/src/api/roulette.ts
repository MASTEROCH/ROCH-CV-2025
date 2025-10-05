import apiClient from './client'

export interface RouletteConfig {
  id: string
  segments: number
  probabilities: Record<number, number>
  createdAt: string
  updatedAt: string
}

export interface Spin {
  id: string
  userId: string
  result: number
  isWin: boolean
  reward?: number
  createdAt: string
}

export interface SpinRequest {
  isAutoSpin?: boolean
}

export interface SpinResponse {
  spinId: string
  result: number
  isWin: boolean
  reward?: number
  newBalance: {
    coins: number
    tickets: number
    tonGame: number
    totalSpins: number
  }
}

export const rouletteApi = {
  getConfig: (): Promise<RouletteConfig> =>
    apiClient.get('/roulette/config').then(res => res.data),
  
  spin: (data: SpinRequest): Promise<SpinResponse> =>
    apiClient.post('/roulette/spin', data).then(res => res.data),
  
  getHistory: (limit?: number): Promise<Spin[]> =>
    apiClient.get(`/roulette/history?limit=${limit || 10}`).then(res => res.data),
  
  getMoreChance: (): Promise<{
    available: boolean
    cost: number
    multiplier: number
  }> =>
    apiClient.get('/roulette/more-chance').then(res => res.data),
}