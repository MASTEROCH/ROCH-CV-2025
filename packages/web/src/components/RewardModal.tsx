import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Gift, Coins, Ticket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../utils/cn'

interface RewardModalProps {
  isOpen: boolean
  onClose: () => void
  reward: {
    type: 'coins' | 'tickets' | 'special'
    amount: number
    title: string
    description?: string
  }
}

export function RewardModal({ isOpen, onClose, reward }: RewardModalProps) {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getRewardIcon = () => {
    switch (reward.type) {
      case 'coins':
        return <Coins className="h-16 w-16 text-yellow-500" />
      case 'tickets':
        return <Ticket className="h-16 w-16 text-blue-500" />
      default:
        return <Gift className="h-16 w-16 text-purple-500" />
    }
  }

  const getRewardColor = () => {
    switch (reward.type) {
      case 'coins':
        return 'text-yellow-600'
      case 'tickets':
        return 'text-blue-600'
      default:
        return 'text-purple-600'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                {getRewardIcon()}
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                {reward.title}
              </motion.h2>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={cn('text-4xl font-bold mb-4', getRewardColor())}
              >
                +{reward.amount}
              </motion.div>

              {reward.description && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 mb-6"
                >
                  {reward.description}
                </motion.p>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-gray-500"
              >
                {t('common.loading')}...
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}