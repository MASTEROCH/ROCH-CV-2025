import apiClient from './client'

export interface Friend {
  id: string
  userId: string
  friendId: string
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

export interface AddFriendRequest {
  friendTelegramId: string
}

export interface ReferralCodeResponse {
  referralCode: string
  referralLink: string
}

export interface ReferralStats {
  totalReferrals: number
  totalEarnings: number
}

export const friendsApi = {
  getFriends: (): Promise<Friend[]> =>
    apiClient.get('/friends').then(res => res.data),
  
  addFriend: (data: AddFriendRequest): Promise<{ message: string }> =>
    apiClient.post('/friends/add', data).then(res => res.data),
  
  getReferralCode: (): Promise<ReferralCodeResponse> =>
    apiClient.get('/friends/referral-code').then(res => res.data),
  
  getReferralStats: (): Promise<ReferralStats> =>
    apiClient.get('/friends/referral-stats').then(res => res.data),
}