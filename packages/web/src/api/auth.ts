import apiClient from './client'

export interface LoginRequest {
  initData: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: string
    telegramId: string
    username?: string
    firstName?: string
    lastName?: string
    balance: {
      coins: number
      tickets: number
      tonGame: number
      totalSpins: number
    }
  }
}

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiClient.post('/auth/login', data).then(res => res.data),
  
  getProfile: (): Promise<LoginResponse['user']> =>
    apiClient.get('/auth/me').then(res => res.data),
}