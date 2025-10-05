import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Package, Coins, Ticket, Gift } from 'lucide-react'
import { useTicketsStore } from '../../store/tickets'
import { useBalancesStore } from '../../store/balances'
import { ticketsApi } from '../../api/tickets'

export function InventoryPage() {
  const { t } = useTranslation()
  const { tickets, setTickets, nextFreeTicketTime, setNextFreeTicketTime } = useTicketsStore()
  const { balance } = useBalancesStore()

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      const ticketsData = await ticketsApi.getTickets()
      setTickets(ticketsData)
      
      const nextFreeTime = await ticketsApi.getNextFreeTicketTime()
      setNextFreeTicketTime(nextFreeTime)
    } catch (error) {
      console.error('Failed to load tickets:', error)
    }
  }

  const handleClaimFreeTicket = async () => {
    try {
      const ticket = await ticketsApi.claimFreeTicket()
      // Refresh tickets
      loadTickets()
    } catch (error) {
      console.error('Failed to claim free ticket:', error)
      alert('Failed to claim free ticket')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('navigation.inventory')}</h1>
        
        {/* Balance Overview */}
        {balance && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <Coins className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{balance.coins}</div>
              <div className="text-sm text-gray-500">{t('balance.coins')}</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Ticket className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{balance.tickets}</div>
              <div className="text-sm text-gray-500">{t('balance.tickets')}</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Gift className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{balance.tonGame}</div>
              <div className="text-sm text-gray-500">{t('balance.tonGame')}</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Package className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{balance.totalSpins}</div>
              <div className="text-sm text-gray-500">{t('balance.totalSpins')}</div>
            </div>
          </div>
        )}

        {/* Free Ticket Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Daily Ticket</h3>
              <p className="text-gray-600">
                {nextFreeTicketTime ? 
                  `Next free ticket available in ${Math.ceil((new Date(nextFreeTicketTime).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours` :
                  'Free ticket is available now!'
                }
              </p>
            </div>
            <button
              onClick={handleClaimFreeTicket}
              disabled={!!nextFreeTicketTime}
              className="btn btn-primary"
            >
              Claim Free Ticket
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tickets</h3>
          {tickets.length > 0 ? (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Ticket className="h-6 w-6 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {ticket.type === 'FREE' ? 'Free Ticket' : 
                         ticket.type === 'PURCHASED' ? 'Purchased Ticket' : 'Reward Ticket'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Amount: {ticket.amount} • {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {ticket.claimedAt ? 'Claimed' : 'Available'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No tickets yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}