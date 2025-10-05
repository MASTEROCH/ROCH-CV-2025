import { create } from 'zustand'

interface Friend {
  id: string
  friend: {
    id: string
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
  createdAt: string
}

interface ReferralStats {
  totalReferrals: number
  totalEarnings: number
}

interface FriendsState {
  friends: Friend[]
  referralCode: string
  referralLink: string
  referralStats: ReferralStats | null
  isLoading: boolean
  setFriends: (friends: Friend[]) => void
  addFriend: (friend: Friend) => void
  setReferralCode: (code: string) => void
  setReferralLink: (link: string) => void
  setReferralStats: (stats: ReferralStats) => void
  setLoading: (isLoading: boolean) => void
}

export const useFriendsStore = create<FriendsState>((set) => ({
  friends: [],
  referralCode: '',
  referralLink: '',
  referralStats: null,
  isLoading: false,
  setFriends: (friends) => set({ friends }),
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
  setReferralCode: (referralCode) => set({ referralCode }),
  setReferralLink: (referralLink) => set({ referralLink }),
  setReferralStats: (referralStats) => set({ referralStats }),
  setLoading: (isLoading) => set({ isLoading }),
}))