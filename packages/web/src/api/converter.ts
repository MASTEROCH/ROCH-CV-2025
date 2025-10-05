import apiClient from './client'

export interface ConversionRates {
  coinsToTickets: number
  ticketsToCoins: number
}

export interface ConvertRequest {
  amount: number
}

export interface ConvertResponse {
  converted: number
  cost?: number
  received?: number
  newBalance: {
    coins: number
    tickets: number
    tonGame: number
    totalSpins: number
  }
}

export const converterApi = {
  getRates: (): Promise<ConversionRates> =>
    apiClient.get('/converter/rates').then(res => res.data),
  
  convertCoinsToTickets: (data: ConvertRequest): Promise<ConvertResponse> =>
    apiClient.post('/converter/coins-to-tickets', data).then(res => res.data),
  
  convertTicketsToCoins: (data: ConvertRequest): Promise<ConvertResponse> =>
    apiClient.post('/converter/tickets-to-coins', data).then(res => res.data),
}