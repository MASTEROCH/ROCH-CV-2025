import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  telegramId: string
  username?: string
  firstName?: string
  lastName?: string
  balance?: {
    coins: number
    tickets: number
    tonGame: number
    totalSpins: number
  }
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setLoading: (isLoading: boolean) => void
  updateBalance: (balance: User['balance']) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      updateBalance: (balance) => set((state) => ({
        user: state.user ? { ...state.user, balance } : null
      })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
)