import { create } from 'zustand'

interface ShopItem {
  id: string
  name: string
  description?: string
  type: 'COINS' | 'TICKETS' | 'STARTER_PACK' | 'FREE_BUNDLE'
  price: number
  currency: 'COINS' | 'TON' | 'STARS'
  isActive: boolean
}

interface Purchase {
  id: string
  itemId: string
  amount: number
  totalCost: number
  createdAt: string
  item: ShopItem
}

interface ShopState {
  items: ShopItem[]
  purchases: Purchase[]
  isLoading: boolean
  setItems: (items: ShopItem[]) => void
  setPurchases: (purchases: Purchase[]) => void
  addPurchase: (purchase: Purchase) => void
  setLoading: (isLoading: boolean) => void
  getItemsByType: (type: ShopItem['type']) => ShopItem[]
}

export const useShopStore = create<ShopState>((set, get) => ({
  items: [],
  purchases: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  setPurchases: (purchases) => set({ purchases }),
  addPurchase: (purchase) => set((state) => ({ purchases: [purchase, ...state.purchases] })),
  setLoading: (isLoading) => set({ isLoading }),
  getItemsByType: (type) => get().items.filter(item => item.type === type),
}))