import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RotateCcw, Coins, Ticket, ArrowRightLeft } from 'lucide-react'
import { useBalancesStore } from '../../store/balances'
import { converterApi } from '../../api/converter'
import { cn } from '../../utils/cn'

export function ConverterPage() {
  const { t } = useTranslation()
  const { balance, updateBalance } = useBalancesStore()
  const [rates, setRates] = useState({ coinsToTickets: 900, ticketsToCoins: 900 })
  const [coinsAmount, setCoinsAmount] = useState('')
  const [ticketsAmount, setTicketsAmount] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  useEffect(() => {
    loadRates()
  }, [])

  const loadRates = async () => {
    try {
      const ratesData = await converterApi.getRates()
      setRates(ratesData)
    } catch (error) {
      console.error('Failed to load conversion rates:', error)
    }
  }

  const handleCoinsToTickets = async () => {
    const amount = parseInt(coinsAmount)
    if (!amount || amount <= 0) return

    setIsConverting(true)
    try {
      const result = await converterApi.convertCoinsToTickets({ amount })
      updateBalance(result.newBalance)
      setCoinsAmount('')
      alert(`Successfully converted ${amount} coins to ${result.converted} tickets!`)
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }

  const handleTicketsToCoins = async () => {
    const amount = parseInt(ticketsAmount)
    if (!amount || amount <= 0) return

    setIsConverting(true)
    try {
      const result = await converterApi.convertTicketsToCoins({ amount })
      updateBalance(result.newBalance)
      setTicketsAmount('')
      alert(`Successfully converted ${amount} tickets to ${result.received} coins!`)
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }

  const calculateCoinsNeeded = (tickets: number) => {
    return tickets * rates.coinsToTickets
  }

  const calculateTicketsFromCoins = (coins: number) => {
    return Math.floor(coins / rates.coinsToTickets)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('converter.title')}</h1>
        
        {/* Current Balance */}
        {balance && (
          <div className="grid grid-cols-2 gap-4 mb-8">
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
          </div>
        )}

        {/* Conversion Rates */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('converter.rate')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{rates.coinsToTickets}</div>
              <div className="text-sm text-gray-500">{t('balance.coins')} = 1 {t('balance.tickets')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{rates.ticketsToCoins}</div>
              <div className="text-sm text-gray-500">1 {t('balance.tickets')} = {rates.ticketsToCoins} {t('balance.coins')}</div>
            </div>
          </div>
        </div>

        {/* Conversion Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coins to Tickets */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Coins className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">{t('converter.coinsToTickets')}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount of {t('balance.coins')}
                </label>
                <input
                  type="number"
                  value={coinsAmount}
                  onChange={(e) => setCoinsAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input w-full"
                />
                {coinsAmount && (
                  <div className="text-sm text-gray-500 mt-1">
                    You will get {calculateTicketsFromCoins(parseInt(coinsAmount) || 0)} {t('balance.tickets')}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleCoinsToTickets}
                disabled={!coinsAmount || isConverting || !balance || balance.coins < parseInt(coinsAmount)}
                className="w-full btn btn-primary"
              >
                {isConverting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('converter.convert')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tickets to Coins */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Ticket className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">{t('converter.ticketsToCoins')}</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount of {t('balance.tickets')}
                </label>
                <input
                  type="number"
                  value={ticketsAmount}
                  onChange={(e) => setTicketsAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="input w-full"
                />
                {ticketsAmount && (
                  <div className="text-sm text-gray-500 mt-1">
                    You will get {calculateCoinsNeeded(parseInt(ticketsAmount) || 0)} {t('balance.coins')}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleTicketsToCoins}
                disabled={!ticketsAmount || isConverting || !balance || balance.tickets < parseInt(ticketsAmount)}
                className="w-full btn btn-primary"
              >
                {isConverting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('converter.convert')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Conversion Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowRightLeft className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-blue-900">Conversion Info</h4>
          </div>
          <p className="text-sm text-blue-700">
            You can convert between coins and tickets at any time. The conversion rate is fixed at {rates.coinsToTickets} coins per ticket.
            This allows you to manage your resources based on your gaming preferences.
          </p>
        </div>
      </div>
    </div>
  )
}