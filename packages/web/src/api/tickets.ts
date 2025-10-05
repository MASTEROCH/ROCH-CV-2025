import apiClient from './client'

export interface Ticket {
  id: string
  userId: string
  type: 'FREE' | 'PURCHASED' | 'REWARD'
  amount: number
  expiresAt?: string
  claimedAt?: string
  createdAt: string
}

export const ticketsApi = {
  getTickets: (): Promise<Ticket[]> =>
    apiClient.get('/tickets').then(res => res.data),
  
  claimFreeTicket: (): Promise<Ticket> =>
    apiClient.post('/tickets/claim-free').then(res => res.data),
  
  getNextFreeTicketTime: (): Promise<string | null> =>
    apiClient.get('/tickets/next-free').then(res => res.data),
}