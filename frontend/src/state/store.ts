import { create } from 'zustand'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

export type User = {
  id: number
  username?: string
  coins: number
  ton: number
  tickets: number
  hasVisited: boolean
  lastLoginAt?: string
  streakDays: number
  freeTicketAt?: string
  moreChanceLevel: number
  referralCode: string
}

export type InventoryItem = {
  id: number
  item_type: 'head'|'arms'|'body'|'legs'
  name: string
  rarity: string
  is_new: boolean
}

export type Task = {
  id: number
  title: string
  description?: string
  status: 'active'|'completed'
  reward_coins: number
  reward_tickets: number
  claimed: boolean
}

export type ShopItem = {
  id: number
  sku: string
  title: string
  description?: string
  type: string
  price_ton: number
  price_coins: number
  gives_coins: number
  gives_tickets: number
  active: boolean
}

export type ContentBundle = {
  locale: string
  texts: Record<string,string>
  images: Record<string,string>
}

export const useStore = create<{
  user?: User
  content?: ContentBundle
  online: boolean
  setOnline: (v:boolean)=>void
  initContent: ()=>Promise<void>
  initUser: ()=>Promise<void>
  claimStreak: ()=>Promise<void>
  spin: ()=>Promise<{ result_type: string; amount: number; item?: InventoryItem; coins:number; tickets:number; freeTicketAt?: string }>
  getInventory: ()=>Promise<InventoryItem[]>
  ackInventory: ()=>Promise<void>
  getTasks: ()=>Promise<Task[]>
  claimTask: (taskId:number)=>Promise<void>
  getShop: ()=>Promise<ShopItem[]>
  convertTicket: ()=>Promise<void>
}>(
  (set, get) => ({
    online: true,
    setOnline: (v) => set({ online: v }),
    async initContent() {
      const locale = navigator.language.split('-')[0] || 'en'
      const { data } = await api.get('/content', { params: { locale } })
      set({ content: data })
    },
    async initUser() {
      const { data } = await api.get<User>('/me')
      set({ user: data })
    },
    async claimStreak() {
      const { data } = await api.post<User>('/streak/claim')
      set({ user: data })
    },
    async spin() {
      const { data } = await api.post('/roulette/spin')
      set({ user: { ...(get().user as User), coins: data.coins, tickets: data.tickets, freeTicketAt: data.freeTicketAt } })
      return data
    },
    async getInventory() {
      const { data } = await api.get<InventoryItem[]>('/inventory')
      return data
    },
    async ackInventory() {
      await api.post('/inventory/ack')
    },
    async getTasks() {
      const { data } = await api.get<Task[]>('/tasks')
      return data
    },
    async claimTask(taskId:number) {
      const { data } = await api.post<User>(`/tasks/${taskId}/claim`)
      set({ user: data })
    },
    async getShop() {
      const { data } = await api.get<ShopItem[]>('/shop')
      return data
    },
    async convertTicket() {
      const { data } = await api.post<User>('/convert/coins-to-ticket')
      set({ user: data })
    },
  })
)
