import { create } from 'zustand'

interface Ticket {
  id: string
  type: 'FREE' | 'PURCHASED' | 'REWARD'
  amount: number
  expiresAt?: string
  claimedAt?: string
  createdAt: string
}

interface TicketsState {
  tickets: Ticket[]
  nextFreeTicketTime: string | null
  isLoading: boolean
  setTickets: (tickets: Ticket[]) => void
  addTicket: (ticket: Ticket) => void
  setNextFreeTicketTime: (time: string | null) => void
  setLoading: (isLoading: boolean) => void
  canClaimFreeTicket: () => boolean
}

export const useTicketsStore = create<TicketsState>((set, get) => ({
  tickets: [],
  nextFreeTicketTime: null,
  isLoading: false,
  setTickets: (tickets) => set({ tickets }),
  addTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, ticket] })),
  setNextFreeTicketTime: (nextFreeTicketTime) => set({ nextFreeTicketTime }),
  setLoading: (isLoading) => set({ isLoading }),
  canClaimFreeTicket: () => {
    const { nextFreeTicketTime } = get()
    if (!nextFreeTicketTime) return true
    return new Date() >= new Date(nextFreeTicketTime)
  },
}))