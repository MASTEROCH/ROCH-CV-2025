import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useRouletteStore } from '../store/roulette'
import { useBalancesStore } from '../store/balances'
import { cn } from '../utils/cn'

export function AutoSpinBar() {
  const { t } = useTranslation()
  const { isAutoSpinning, setAutoSpinning } = useRouletteStore()
  const { balance } = useBalancesStore()
  const [remainingSpins, setRemainingSpins] = useState(0)

  useEffect(() => {
    if (balance) {
      setRemainingSpins(balance.tickets)
    }
  }, [balance])

  const handleToggleAutoSpin = () => {
    setAutoSpinning(!isAutoSpinning)
  }

  if (!isAutoSpinning && (!balance || balance.tickets === 0)) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white rounded-lg shadow-lg border p-4 min-w-80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-full',
              isAutoSpinning ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            )}>
              {isAutoSpinning ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </div>
            
            <div>
              <div className="font-medium text-gray-900">
                {isAutoSpinning ? t('roulette.autoSpin') : t('roulette.autoSpin')}
              </div>
              <div className="text-sm text-gray-500">
                {remainingSpins} {t('balance.tickets')} {t('common.loading')}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isAutoSpinning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                  )}
                  style={{
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
            
            <button
              onClick={handleToggleAutoSpin}
              className={cn(
                'btn btn-sm',
                isAutoSpinning ? 'btn-secondary' : 'btn-primary'
              )}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {isAutoSpinning ? t('roulette.stopAutoSpin') : t('roulette.autoSpin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}