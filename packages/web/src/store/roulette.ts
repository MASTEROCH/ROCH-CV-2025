import { create } from 'zustand'

interface Spin {
  id: string
  result: number
  isWin: boolean
  reward?: number
  createdAt: string
}

interface RouletteConfig {
  segments: number
  probabilities: Record<number, number>
}

interface RouletteState {
  config: RouletteConfig | null
  spins: Spin[]
  isSpinning: boolean
  isAutoSpinning: boolean
  currentResult: number | null
  setConfig: (config: RouletteConfig) => void
  setSpins: (spins: Spin[]) => void
  addSpin: (spin: Spin) => void
  setSpinning: (isSpinning: boolean) => void
  setAutoSpinning: (isAutoSpinning: boolean) => void
  setCurrentResult: (result: number | null) => void
  clearHistory: () => void
}

export const useRouletteStore = create<RouletteState>((set) => ({
  config: null,
  spins: [],
  isSpinning: false,
  isAutoSpinning: false,
  currentResult: null,
  setConfig: (config) => set({ config }),
  setSpins: (spins) => set({ spins }),
  addSpin: (spin) => set((state) => ({ spins: [spin, ...state.spins] })),
  setSpinning: (isSpinning) => set({ isSpinning }),
  setAutoSpinning: (isAutoSpinning) => set({ isAutoSpinning }),
  setCurrentResult: (currentResult) => set({ currentResult }),
  clearHistory: () => set({ spins: [] }),
}))