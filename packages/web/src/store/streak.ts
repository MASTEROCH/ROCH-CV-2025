import { create } from 'zustand'

interface Streak {
  id: string
  count: number
  lastDate: string
  createdAt: string
  updatedAt: string
}

interface StreakState {
  streak: Streak | null
  isLoading: boolean
  setStreak: (streak: Streak) => void
  setLoading: (isLoading: boolean) => void
  updateStreak: (count: number) => void
}

export const useStreakStore = create<StreakState>((set) => ({
  streak: null,
  isLoading: false,
  setStreak: (streak) => set({ streak }),
  setLoading: (isLoading) => set({ isLoading }),
  updateStreak: (count) => set((state) => ({
    streak: state.streak ? { ...state.streak, count } : null
  })),
}))