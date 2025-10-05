import apiClient from './client'

export interface ShopItem {
  id: string
  name: string
  description?: string
  type: 'COINS' | 'TICKETS' | 'STARTER_PACK' | 'FREE_BUNDLE'
  price: number
  currency: 'COINS' | 'TON' | 'STARS'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Purchase {
  id: string
  userId: string
  itemId: string
  amount: number
  totalCost: number
  createdAt: string
  item: ShopItem
}

export interface PurchaseRequest {
  itemId: string
  quantity?: number
}

export interface PurchaseResponse {
  purchase: Purchase
  newBalance: {
    coins: number
    tickets: number
    tonGame: number
    totalSpins: number
  }
}

export const shopApi = {
  getItems: (): Promise<ShopItem[]> =>
    apiClient.get('/shop/items').then(res => res.data),
  
  purchaseItem: (data: PurchaseRequest): Promise<PurchaseResponse> =>
    apiClient.post('/shop/purchase', data).then(res => res.data),
  
  getPurchaseHistory: (): Promise<Purchase[]> =>
    apiClient.get('/shop/history').then(res => res.data),
}