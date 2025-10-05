import { create } from 'zustand'

interface Balance {
  coins: number
  tickets: number
  tonGame: number
  totalSpins: number
}

interface BalancesState {
  balance: Balance | null
  isLoading: boolean
  setBalance: (balance: Balance) => void
  setLoading: (isLoading: boolean) => void
  updateCoins: (amount: number) => void
  updateTickets: (amount: number) => void
  updateTonGame: (amount: number) => void
  updateTotalSpins: (amount: number) => void
}

export const useBalancesStore = create<BalancesState>((set) => ({
  balance: null,
  isLoading: false,
  setBalance: (balance) => set({ balance }),
  setLoading: (isLoading) => set({ isLoading }),
  updateCoins: (amount) => set((state) => ({
    balance: state.balance ? { ...state.balance, coins: state.balance.coins + amount } : null
  })),
  updateTickets: (amount) => set((state) => ({
    balance: state.balance ? { ...state.balance, tickets: state.balance.tickets + amount } : null
  })),
  updateTonGame: (amount) => set((state) => ({
    balance: state.balance ? { ...state.balance, tonGame: state.balance.tonGame + amount } : null
  })),
  updateTotalSpins: (amount) => set((state) => ({
    balance: state.balance ? { ...state.balance, totalSpins: state.balance.totalSpins + amount } : null
  })),
}))