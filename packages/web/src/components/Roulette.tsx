import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, RotateCcw, History } from 'lucide-react'
import { useRouletteStore } from '../store/roulette'
import { useBalancesStore } from '../store/balances'
import { rouletteApi } from '../api/roulette'
import { cn } from '../utils/cn'

export function Roulette() {
  const { t } = useTranslation()
  const { 
    config, 
    isSpinning, 
    isAutoSpinning, 
    currentResult, 
    setConfig, 
    setSpinning, 
    setAutoSpinning, 
    setCurrentResult,
    addSpin 
  } = useRouletteStore()
  const { balance, updateBalance } = useBalancesStore()
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const configData = await rouletteApi.getConfig()
      setConfig(configData)
    } catch (error) {
      console.error('Failed to load roulette config:', error)
    }
  }

  const handleSpin = async () => {
    if (!balance || balance.tickets < 1) {
      alert(t('roulette.noTickets'))
      return
    }

    setSpinning(true)
    setCurrentResult(null)

    try {
      const result = await rouletteApi.spin({ isAutoSpin: false })
      
      // Simulate spinning animation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCurrentResult(result.result)
      addSpin({
        id: result.spinId,
        result: result.result,
        isWin: result.isWin,
        reward: result.reward,
        createdAt: new Date().toISOString()
      })
      
      updateBalance(result.newBalance)
    } catch (error) {
      console.error('Spin failed:', error)
      alert(t('common.error'))
    } finally {
      setSpinning(false)
    }
  }

  const handleAutoSpin = () => {
    if (isAutoSpinning) {
      setAutoSpinning(false)
    } else {
      setAutoSpinning(true)
      startAutoSpin()
    }
  }

  const startAutoSpin = async () => {
    while (isAutoSpinning && balance && balance.tickets > 0) {
      await handleSpin()
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    setAutoSpinning(false)
  }

  const getSegmentColor = (index: number) => {
    const colors = [
      'bg-red-500',
      'bg-black',
      'bg-red-500',
      'bg-black',
      'bg-red-500',
      'bg-black',
      'bg-red-500',
      'bg-black'
    ]
    return colors[index % colors.length]
  }

  const getSegmentTextColor = (index: number) => {
    return index % 2 === 0 ? 'text-white' : 'text-white'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('roulette.title')}</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn btn-outline btn-sm"
        >
          <History className="h-4 w-4 mr-2" />
          {t('roulette.history')}
        </button>
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Roulette Wheel */}
        <div className="relative">
          <div className={cn(
            'w-64 h-64 rounded-full border-8 border-gray-300 relative overflow-hidden transition-transform duration-1000',
            isSpinning && 'animate-spin-slow'
          )}>
            {config && Array.from({ length: config.segments }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  'absolute w-1/2 h-1/2 origin-bottom-right',
                  getSegmentColor(index),
                  getSegmentTextColor(index)
                )}
                style={{
                  transform: `rotate(${index * (360 / config.segments)}deg)`,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                }}
              >
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold">
                  {index}
                </div>
              </div>
            ))}
          </div>
          
          {/* Center pointer */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600"></div>
        </div>

        {/* Result Display */}
        {currentResult !== null && (
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {currentResult}
            </div>
            <div className="text-lg text-gray-600">
              {currentResult % 3 === 0 ? t('roulette.win') : t('roulette.lose')}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={handleSpin}
            disabled={isSpinning || !balance || balance.tickets < 1}
            className="btn btn-primary btn-lg flex items-center"
          >
            <Play className="h-5 w-5 mr-2" />
            {isSpinning ? t('common.loading') : t('roulette.spin')}
          </button>
          
          <button
            onClick={handleAutoSpin}
            disabled={!balance || balance.tickets < 1}
            className={cn(
              'btn btn-lg flex items-center',
              isAutoSpinning ? 'btn-secondary' : 'btn-outline'
            )}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            {isAutoSpinning ? t('roulette.stopAutoSpin') : t('roulette.autoSpin')}
          </button>
        </div>

        {/* Balance Display */}
        {balance && (
          <div className="flex space-x-6 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{balance.coins}</div>
              <div className="text-sm text-gray-500">{t('balance.coins')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{balance.tickets}</div>
              <div className="text-sm text-gray-500">{t('balance.tickets')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}